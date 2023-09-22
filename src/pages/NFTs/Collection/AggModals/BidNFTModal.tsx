/* eslint-disable @typescript-eslint/no-unused-vars */
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey, SystemProgram, Transaction, TransactionInstruction } from '@solana/web3.js'
import BN from 'bn.js'
import { FC, ReactElement, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../../../../components/Button'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../../constants'
import {
  useAccounts,
  useConnectionConfig,
  useNFTAggregator,
  useNFTCollections,
  useNFTDetails,
  useWalletModal
} from '../../../../context'
import { GFX_LINK } from '../../../../styles'
import { checkMobile, formatSOLDisplay, formatSOLNumber, notify, truncateAddress } from '../../../../utils'
import { AppraisalValueSmall } from '../../../../utils/GenericDegsin'
import tw from 'twin.macro'
import 'styled-components/macro'
import {
  AH_FEE_ACCT,
  AUCTION_HOUSE,
  AUCTION_HOUSE_AUTHORITY,
  AUCTION_HOUSE_PREFIX,
  AUCTION_HOUSE_PROGRAM_ID,
  bnTo8,
  BuyInstructionAccounts,
  BuyInstructionArgs,
  confirmTransaction,
  createBuyInstruction,
  getMetadata,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  StringPublicKey,
  TOKEN_PROGRAM_ID,
  toPublicKey,
  TREASURY_MINT,
  TREASURY_PREFIX,
  WRAPPED_SOL_MINT
} from '../../../../web3'
import { minimizeTheString } from '../../../../web3/nfts/utils'
import { GenericTooltip } from '../../../Farm/Columns'
import { tokenSize, tradeStatePDA } from '../../actions'
import { TermsTextNFT } from '../AcceptBidModal'
import { STYLED_POPUP_BUY_MODAL } from '../BuyNFTModal'
import { BorderBottom } from '../SellNFTModal'
import { couldNotDeriveValueForBuyInstruction, pleaseTryAgain, successfulListingMessage } from './AggNotifications'
import { constructBidInstruction } from '../../../../web3/auction-house-sdk/bid'
import { saveNftTx } from '../../../../api/NFTs'

export const BidNFTModal: FC<{ cancelBid?: boolean }> = ({ cancelBid }): ReactElement => {
  const { bidNowClicked, setBidNow, setOpenJustModal, openJustModal, appraisalIsEnabled } = useNFTAggregator()
  const [selectedBtn, setSelectedBtn] = useState<number | undefined>(undefined)
  const [reviewBtnClicked, setReviewClicked] = useState<boolean>(false)
  const { connected, sendTransaction, wallet } = useWallet()
  const wal = useWallet()
  const { setGeneral } = useNFTDetails()
  const { connection } = useConnectionConfig()
  const { singleCollection } = useNFTCollections()
  const { general, ask, bids, nftMetadata } = useNFTDetails()
  const purchasePrice = useMemo(() => parseFloat(ask ? ask?.buyer_price : '0') / LAMPORTS_PER_SOL_NUMBER, [ask])
  const [curBid, setCurBid] = useState<number | undefined>(purchasePrice ? purchasePrice / 2 : undefined)
  const [pendingTxSig, setPendingTxSig] = useState<string | null>(null)

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { getUIAmount } = useAccounts()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const floorPrice = useMemo(
    () => (singleCollection ? formatSOLNumber(singleCollection[0]?.floor_price) : 0),
    [singleCollection]
  )

  const orderTotal: number = useMemo(() => curBid, [curBid])

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [inputRef.current])

  const listingPrice = useMemo(() => (ask?.buyer_price ? formatSOLNumber(ask?.buyer_price) : 0), [ask])
  const highestBid: number = useMemo(
    () =>
      bids.length > 0 ? Math.max(...bids.map((b) => parseFloat(b.buyer_price) / LAMPORTS_PER_SOL_NUMBER)) : 0,
    [bids]
  )
  const displayErrorMsg = useMemo(() => {
    if (curBid && listingPrice) {
      if (curBid == listingPrice) return ` Bid should be below listed price`

      if (curBid < listingPrice / 2)
        return `Minimum offer ${formatSOLDisplay(listingPrice / 2)} (50%) and bid should be below listed price`
      if (curBid > listingPrice) return `You can buy this NFT at ${formatSOLDisplay(listingPrice)}`
    }
    if (curBid && floorPrice) {
      if (curBid < floorPrice / 2) return `Offer ${formatSOLDisplay(floorPrice / 2)} (50%) of floor price or more`
    }
    return false
  }, [curBid])

  const sendNftTransactionLog = useCallback(
    (txType, signature) => {
      saveNftTx(
        'GooseFX',
        parseFloat(ask?.buyer_price) / LAMPORTS_PER_SOL_NUMBER,
        general?.mint_address,
        general?.collection_name,
        txType,
        signature,
        general?.uuid,
        publicKey.toString()
      )
    },
    [general, ask]
  )
  const { setVisible } = useWalletModal()
  const updateBidValue = (e) => {
    setCurBid(e.target.value)
  }
  const publicKey: PublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet])

  const notEnoughSol: boolean = useMemo(
    () => (orderTotal >= getUIAmount(WRAPPED_SOL_MINT.toBase58()) ? true : false),
    [curBid]
  )

  useEffect(() => {
    if (bidNowClicked) {
      if (!wallet?.adapter?.publicKey) {
        setVisible(true)
        setBidNow(false)
      }
    }
    return () => {
      handleModalClose()
    }
  }, [bidNowClicked])

  const handleModalClose = () => {
    setCurBid(0)
    setBidNow(false)
    openJustModal && setGeneral(null)
    setOpenJustModal(false)
  }
  const derivePDAsForInstruction = async () => {
    const buyerPriceInLamports = orderTotal * LAMPORTS_PER_SOL_NUMBER
    const buyerPrice: BN = new BN(buyerPriceInLamports)
    const buyerReceiptTokenAccount: [PublicKey, number] = await PublicKey.findProgramAddress(
      [publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), toPublicKey(general.mint_address).toBuffer()],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
    const auctionHouseTreasuryAddress: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(AUCTION_HOUSE_PREFIX), toPublicKey(AUCTION_HOUSE).toBuffer(), Buffer.from(TREASURY_PREFIX)],
      toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
    )

    const metaDataAccount: StringPublicKey = await getMetadata(general.mint_address)
    const escrowPaymentAccount: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(AUCTION_HOUSE_PREFIX), toPublicKey(AUCTION_HOUSE).toBuffer(), publicKey.toBuffer()],
      toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
    )

    const buyerTradeState: [PublicKey, number] = await tradeStatePDA(
      publicKey,
      AUCTION_HOUSE,
      general.token_account,
      general.mint_address,
      TREASURY_MINT,
      bnTo8(buyerPrice)
    )

    if (!metaDataAccount || !escrowPaymentAccount || !buyerTradeState) {
      return {
        metaDataAccount: undefined,
        escrowPaymentAccount: undefined,
        buyerTradeState: undefined,
        buyerPrice: undefined
      }
    }

    return {
      metaDataAccount,
      escrowPaymentAccount,
      buyerTradeState,
      buyerPrice,
      buyerReceiptTokenAccount,
      auctionHouseTreasuryAddress
    }
  }
  const callBuyInstruction = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    const bidIx = await constructBidInstruction(connection, wal, curBid, general)
    try {
      const signature = await sendTransaction(bidIx, connection)
      console.log(signature)
      setPendingTxSig(signature)
      const confirm = await confirmTransaction(connection, signature, 'confirmed')
      setIsLoading(false)
      if (confirm.value.err === null) {
        setBidNow(false)
        sendNftTransactionLog('BID', signature)
        notify(successfulListingMessage(signature, nftMetadata, formatSOLDisplay(curBid)))
      }
    } catch (error) {
      setIsLoading(false)
      pleaseTryAgain(false, error?.message)
    }
    return

    const {
      metaDataAccount,
      escrowPaymentAccount,
      buyerTradeState,
      buyerPrice,
      buyerReceiptTokenAccount,
      auctionHouseTreasuryAddress
    } = await derivePDAsForInstruction()

    if (!metaDataAccount || !escrowPaymentAccount || !buyerTradeState) {
      couldNotDeriveValueForBuyInstruction()
      return
    }

    const buyInstructionArgs: BuyInstructionArgs = {
      tradeStateBump: buyerTradeState[1],
      escrowPaymentBump: escrowPaymentAccount[1],
      buyerPrice: buyerPrice,
      tokenSize: tokenSize
    }

    // All bids will be placed on GFX AH Instance - Buys will be built with "ask" payload
    const buyInstructionAccounts: BuyInstructionAccounts = {
      wallet: publicKey,
      paymentAccount: publicKey,
      transferAuthority: publicKey,
      treasuryMint: new PublicKey(TREASURY_MINT),
      tokenAccount: new PublicKey(general.token_account),
      metadata: new PublicKey(metaDataAccount),
      escrowPaymentAccount: escrowPaymentAccount[0],
      authority: new PublicKey(AUCTION_HOUSE_AUTHORITY),
      auctionHouse: new PublicKey(AUCTION_HOUSE),
      auctionHouseFeeAccount: new PublicKey(AH_FEE_ACCT),
      buyerTradeState: buyerTradeState[0]
    }

    const buyIX: TransactionInstruction = await createBuyInstruction(buyInstructionAccounts, buyInstructionArgs)

    const transaction = new Transaction()
    transaction.add(buyIX)
    try {
      const escrowBalance = await connection.getBalance(escrowPaymentAccount[0])

      if (escrowBalance > 0.01 * LAMPORTS_PER_SOL_NUMBER) {
        const initialIX = SystemProgram.transfer({
          fromPubkey: wallet?.adapter?.publicKey,
          toPubkey: escrowPaymentAccount[0],
          lamports: escrowBalance >= curBid * LAMPORTS_PER_SOL_NUMBER ? buyerPrice : buyerPrice - escrowBalance
        })
        transaction.add(initialIX)
      }
    } catch (err) {
      console.log(err)
    }

    try {
      const signature = await sendTransaction(transaction, connection)

      console.log(signature)
      setPendingTxSig(signature)
      const confirm = await confirmTransaction(connection, signature, 'finalized')
      console.log(confirm, 'confirming')
      setIsLoading(false)
      if (confirm.value.err === null) {
        setBidNow(false)
        notify(successfulListingMessage(signature, nftMetadata, formatSOLDisplay(buyerPrice)))
      }
    } catch (error) {
      setIsLoading(false)
      pleaseTryAgain(false, error?.message)
    }
  }

  return (
    <STYLED_POPUP_BUY_MODAL
      lockModal={isLoading}
      height={checkMobile() ? '610px' : '780px'}
      width={checkMobile() ? '100%' : '580px'}
      title={null}
      centered={checkMobile() ? false : true}
      visible={bidNowClicked ? true : false}
      onCancel={() => !isLoading && handleModalClose()}
      footer={null}
    >
      <div>
        {checkMobile() && <img className="nftImgBid" src={general.image_url} alt="" />}
        <div tw="flex flex-col sm:mt-[-135px] sm:items-start items-center">
          <div className="buyTitle">
            You are about to bid for:
            <br />
            <GenericTooltip text={general?.nft_name}>
              <strong>{minimizeTheString(general?.nft_name, checkMobile() ? 12 : 15)} </strong>
            </GenericTooltip>
            {checkMobile() && <br />}
            {general?.collection_name && (
              <>
                {' '}
                by{' '}
                <GenericTooltip text={general?.collection_name}>
                  <strong>{minimizeTheString(general?.collection_name, checkMobile() ? 12 : 16)}</strong>
                </GenericTooltip>
              </>
            )}
          </div>
          {singleCollection && singleCollection[0]?.is_verified && (
            <div className="verifiedText">
              <div>
                {!checkMobile() && (
                  <img className="verifiedImg" src={`/img/assets/Aggregator/verifiedNFT.svg`} alt="" />
                )}
                This is a verified {checkMobile() && <br />} Creator
                {checkMobile() && (
                  <img className="verifiedImg" src={`/img/assets/Aggregator/verifiedNFT.svg`} alt="" />
                )}
              </div>
            </div>
          )}
        </div>
        {!checkMobile() && (
          <div className="vContainer" tw="flex">
            {!checkMobile() && (
              <div tw="mt-6" className="nftImgBid">
                <img src={general?.image_url} alt="" />
              </div>
            )}
            {listingPrice ? (
              <div tw="flex flex-col sm:mt-6">
                <div className="currentBid">Listed Price</div>
                <div className="priceNumber" tw=" ml-4 mt-2 flex items-center">
                  {listingPrice}
                  <img src={`/img/crypto/SOL.svg`} />
                </div>
              </div>
            ) : (
              <div tw="flex flex-col sm:mt-6">
                <div className="currentBid">Existing {!checkMobile() && <br />} Hightest Bid</div>
                <div className="priceNumber" tw=" ml-4 mt-2 flex items-center">
                  {highestBid}
                  <img src={`/img/crypto/SOL.svg`} />
                </div>
              </div>
            )}
          </div>
        )}

        <div className="vContainer">
          <div className="maxBid" tw="mt-6 sm:!mt-10">
            Enter Bid
          </div>
        </div>
        <div className="vContainer">
          <input
            className="enterBid"
            placeholder="0.0"
            type="number"
            ref={inputRef}
            value={curBid >= 0 ? curBid : undefined}
            onChange={(e) => updateBidValue(e)}
          />
          <img
            src="/img/crypto/SOL.svg"
            tw="absolute h-[35px]  ml-[300px] top-[10px] sm:ml-0 sm:top-2.5 sm:!h-[30px] sm:right-2"
          />
        </div>
        <div
          tw=" flex items-center font-semibold h-2 justify-center text-red-2 mt-4 text-center
          sm:mt-5 sm:text-[12px] sm:font-medium "
        >
          {displayErrorMsg}
        </div>

        {appraisalIsEnabled && (
          <div tw="mt-[20px]  sm:mt-4">
            <AppraisalValueSmall
              text={parseFloat(general?.gfx_appraisal_value) > 0 ? `${general.gfx_appraisal_value}` : null}
              label={parseFloat(general?.gfx_appraisal_value) > 0 ? 'Appraisal Value' : 'Appraisal Not Supported'}
              width={246}
            />
          </div>
        )}

        {pendingTxSig && (
          <div className="bm-title">
            <span>
              <img
                style={{ height: '26px', marginRight: '6px' }}
                src={`/img/assets/solscan.png`}
                alt="solscan-icon"
              />
            </span>
            <GFX_LINK href={`https://solscan.io/tx/${pendingTxSig}`} target={'_blank'} rel="noreferrer">
              View Transaction
            </GFX_LINK>
          </div>
        )}

        {/* {yourPreviousBid ? (
            <div tw=" flex !bottom-0">
              <Button className="semiBuyButton" disabled={curBid <= 0} onClick={() => setReviewClicked(true)}>
                Review Offer
              </Button>
              <Button
                className="semiSellButton"
                tw="!mt[-10px]"
                disabled={curBid <= 0}
                onClick={callCancelInstruction}
              >
                Cancel bid
              </Button>
            </div>
          ) : */}
        <div className="feesContainer">
          <div className="rowContainer">
            <div className="leftAlign">Minium Bid 50%</div>
            <div className="rightAlign">{listingPrice ? listingPrice / 2 : 'NA'} SOL</div>
          </div>
          {/* {!checkMobile() && (
              <div className="rowContainer">
                <div className="leftAlign">Quantity</div>
                <div className="rightAlign">1 NFT</div>
              </div>
            )} */}
          <div className="rowContainer">
            <div className="leftAlign">Main Wallet Balance</div>
            <div className="rightAlign"> {formatSOLDisplay(getUIAmount(WRAPPED_SOL_MINT.toBase58()))} SOL</div>
          </div>
          <div className="rowContainer">
            <div className="leftAlign"> Bidding Wallet Address</div>
            <div className="rightAlign">
              {' '}
              {wallet?.adapter?.publicKey && truncateAddress(wallet?.adapter?.publicKey.toString())}{' '}
            </div>
          </div>
        </div>
        <BorderBottom />
        <div className="buyBtnContainer">
          <Button
            loading={isLoading}
            className="buyButton"
            disabled={curBid <= 0 || (displayErrorMsg ? true : false) || notEnoughSol}
            onClick={callBuyInstruction}
          >
            <div>{notEnoughSol ? 'Insufficient SOL' : `Place Bid`}</div>
          </Button>
        </div>
        <div
          tw="bottom-0 left-[calc(50% - 180px)] sm:left-[calc(50% - 165px)] 
        w-auto sm:mb-[75px] absolute "
        >
          <TermsTextNFT string={'Place Bid'} />
        </div>
      </div>
    </STYLED_POPUP_BUY_MODAL>
  )
}
