/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactElement, useState, FC, useMemo, useEffect, useRef } from 'react'
import {
  // useAccounts,
  useConnectionConfig,
  useNFTAggregator,
  useNFTCollections,
  useNFTDetails
} from '../../../context'
// import { INFTAsk } from '../../../types/nft_details.d'
import { Button, SuccessfulListingMsg, TransactionErrorMsg } from '../../../components'
import { checkMobile, formatSOLDisplay, formatSOLNumber, notify } from '../../../utils'
import { AppraisalValueSmall, GenericTooltip } from '../../../utils/GenericDegsin'
import { PublicKey, TransactionInstruction, Transaction, SystemProgram } from '@solana/web3.js'
import {
  tradeStatePDA,
  // getBuyInstructionAccounts,
  tokenSize,
  // callCancelInstruction,
  freeSellerTradeStatePDA,
  getSellInstructionAccounts,
  freeSellerTradeStatePDAAgg
} from '../actions'
import { LAMPORTS_PER_SOL_NUMBER, NFT_MARKET_TRANSACTION_FEE } from '../../../constants'
// import { useHistory } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import BN from 'bn.js'
import {
  // signAndSendRawTransaction,
  AH_FEE_ACCT,
  AUCTION_HOUSE_PREFIX,
  AUCTION_HOUSE,
  AUCTION_HOUSE_PROGRAM_ID,
  AUCTION_HOUSE_AUTHORITY,
  TREASURY_MINT,
  toPublicKey,
  createSellInstruction,
  SellInstructionArgs,
  SellInstructionAccounts,
  createCancelInstruction,
  CancelInstructionArgs,
  CancelInstructionAccounts,
  getMetadata,
  StringPublicKey,
  bnTo8,
  confirmTransaction,
  ExecuteSaleInstructionArgs,
  ExecuteSaleInstructionAccounts,
  TOKEN_PROGRAM_ID,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  TREASURY_PREFIX,
  createExecuteSaleInstruction
} from '../../../web3'
import { GFX_LINK } from '../../../styles'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import tw from 'twin.macro'
import 'styled-components/macro'

const TEN_MILLION = 10000000

import { STYLED_POPUP_BUY_MODAL } from '../Collection/BuyNFTModal'
import {
  couldNotFetchNFTMetaData,
  successfulListingMsg,
  TransactionSignatureErrorNotify
} from './AggModals/AggNotifications'
import { getNFTMetadata, minimizeTheString } from '../../../web3/nfts/utils'
import { web3 } from '@project-serum/anchor'
import DelistNFTModal from './DelistNFTModal'
import AcceptBidModal, { TermsTextNFT } from './AcceptBidModal'

export const SellNFTModal: FC<{
  visible: boolean
  handleClose: any
  delistNFT?: boolean
  acceptBid?: boolean
}> = ({ visible, handleClose, delistNFT, acceptBid }): ReactElement => {
  const { connection, network } = useConnectionConfig()
  const { general, setGeneral, ask, nftMetadata, bids } = useNFTDetails()
  const highestBid = useMemo(() => {
    if (bids.length > 0) {
      return bids.reduce((maxBid, currentBid) => {
        const maxBidPrice = parseFloat(maxBid.buyer_price) / LAMPORTS_PER_SOL_NUMBER
        const currentBidPrice = parseFloat(currentBid.buyer_price) / LAMPORTS_PER_SOL_NUMBER

        return currentBidPrice > maxBidPrice ? currentBid : maxBid
      })
    }
  }, [bids])

  const bidPrice = useMemo(
    () => (highestBid ? parseFloat(highestBid.buyer_price) / LAMPORTS_PER_SOL_NUMBER : 0),
    [highestBid]
  )
  const { setSellNFT, setOpenJustModal, setRefreshClicked } = useNFTAggregator()
  const wal = useWallet()
  const { wallet } = wal
  const [askPrice, setAskPrice] = useState<number | null>(
    ask ? parseFloat(ask.buyer_price) / LAMPORTS_PER_SOL_NUMBER : null
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isDelistLoading, setDelistLoading] = useState<boolean>(false)
  const [pendingTxSig, setPendingTxSig] = useState<any>(null)
  const { singleCollection } = useNFTCollections()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const [onChainNFTMetadata, setOnChainNFTMetadata] = useState<any>()

  const appraisalValueAsFloat = useMemo(
    () => (general?.gfx_appraisal_value ? parseFloat(general?.gfx_appraisal_value) : null),
    [general?.gfx_appraisal_value]
  )

  const appraisalValueText = useMemo(
    () => (appraisalValueAsFloat && appraisalValueAsFloat > 0 ? `${general?.gfx_appraisal_value}` : null),
    [appraisalValueAsFloat, general?.gfx_appraisal_value]
  )

  const appraisalValueLabel = useMemo(
    () => (appraisalValueAsFloat && appraisalValueAsFloat > 0 ? 'Appraisal Value' : 'Appraisal Not Supported'),
    [appraisalValueAsFloat]
  )

  useEffect(() => {
    ;(async () => {
      const metadata = await getNFTMetadata(await getMetadata(general.mint_address), connection)
      setOnChainNFTMetadata(metadata)
    })()
  }, [])

  const sellerFeeBasisPoints = useMemo(
    () => (onChainNFTMetadata ? onChainNFTMetadata.data.sellerFeeBasisPoints : 0),
    [onChainNFTMetadata]
  )
  const orderTotal: number = useMemo(() => bidPrice, [bidPrice])

  const isSellingNow = useMemo(() => bidPrice === askPrice, [askPrice])

  const closeTheModal = () => {
    setOpenJustModal(false)
    handleClose()
  }

  useEffect(() => {
    if (highestBid) {
      setAskPrice(formatSOLNumber(highestBid.buyer_price))
    }
  }, [highestBid])
  const serviceFee = useMemo(
    () => (askPrice ? NFT_MARKET_TRANSACTION_FEE / 100 : 0),
    [sellerFeeBasisPoints, askPrice]
  )
  const creatorFee = useMemo(
    () => (askPrice * (sellerFeeBasisPoints / 100)) / 100,
    [sellerFeeBasisPoints, askPrice]
  )
  const totalToReceive = useMemo(
    () => (askPrice ? askPrice - (creatorFee + serviceFee + NFT_MARKET_TRANSACTION_FEE / 100) : 0),
    [askPrice]
  )
  const buyerPublicKey = useMemo(() => (highestBid ? new PublicKey(highestBid.wallet_key) : null), [highestBid])

  const handleTxError = (itemName: string, error: string) => {
    setPendingTxSig(null)
    setIsLoading(false)
    notify({
      type: 'error',
      message: <TransactionErrorMsg title={`NFT Listing error!`} itemName={itemName} supportText={error} />
    })
  }

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  }, [inputRef.current])

  useEffect(
    () => () => {
      setSellNFT(false)
    },
    []
  )

  const attemptConfirmTransaction = async (signature: any, notifyStr?: string): Promise<void> => {
    try {
      const confirm = await confirmTransaction(connection, signature, 'confirmed')
      console.log(confirm)
      // successfully list nft
      if (confirm.value.err === null) {
        setTimeout(() => {
          console.log('refreshing after 15 sec')
          setRefreshClicked((prev) => prev + 1)
        }, 15000)
        if (isSellingNow)
          notify(successfulListingMsg('accepted bid of', signature, nftMetadata, askPrice.toFixed(2)))
        else
          notify(
            successfulListingMsg(notifyStr ? notifyStr : 'Listed', signature, nftMetadata, askPrice.toFixed(2))
          )
        setIsLoading(false)
        setTimeout(() => handleClose(false), 1000)
      } else {
        handleTxError(nftMetadata.name, '')
      }
    } catch (error) {
      handleTxError(nftMetadata.name, error.message)
    }
  }

  const derivePDAForExecuteSale = async () => {
    const programAsSignerPDA: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(AUCTION_HOUSE_PREFIX), Buffer.from('signer')],
      toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
    )
    const freeTradeStateAgg: [PublicKey, number] = await freeSellerTradeStatePDAAgg(
      isSellingNow ? new PublicKey(highestBid.wallet_key) : wallet?.adapter?.publicKey,
      AUCTION_HOUSE,
      general.token_account,
      general.mint_address
    )
    return {
      freeTradeStateAgg,
      programAsSignerPDA
    }
  }
  const derivePDAsForInstructionSell = async () => {
    const buyerPriceInLamports = orderTotal * LAMPORTS_PER_SOL_NUMBER // bidPrice
    const bidPrice: BN = new BN(buyerPriceInLamports)
    const buyerReceiptTokenAccount: [PublicKey, number] = await PublicKey.findProgramAddress(
      [buyerPublicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), toPublicKey(general.mint_address).toBuffer()],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
    const auctionHouseTreasuryAddress: [PublicKey, number] = await PublicKey.findProgramAddress(
      [
        Buffer.from(AUCTION_HOUSE_PREFIX),
        toPublicKey(isSellingNow ? highestBid?.auction_house_key : AUCTION_HOUSE).toBuffer(),
        Buffer.from(TREASURY_PREFIX)
      ],
      toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
    )

    const metaDataAccount: StringPublicKey = await getMetadata(general.mint_address)
    const escrowPaymentAccount: [PublicKey, number] = await PublicKey.findProgramAddress(
      [
        Buffer.from(AUCTION_HOUSE_PREFIX),
        toPublicKey(isSellingNow ? highestBid?.auction_house_key : AUCTION_HOUSE).toBuffer(),
        buyerPublicKey.toBuffer()
      ],
      toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
    )

    const buyerTradeState: [PublicKey, number] = await tradeStatePDA(
      buyerPublicKey,
      isSellingNow ? highestBid?.auction_house_key : AUCTION_HOUSE,
      general.token_account,
      general.mint_address,
      isSellingNow ? highestBid?.auction_house_treasury_mint_key : TREASURY_MINT,
      bnTo8(bidPrice)
    )
    const sellerTradeState: [PublicKey, number] = await tradeStatePDA(
      wallet?.adapter?.publicKey,
      isSellingNow ? highestBid?.auction_house_key : AUCTION_HOUSE, // try changing this
      general.token_account,
      general.mint_address,
      isSellingNow ? highestBid?.auction_house_treasury_mint_key : TREASURY_MINT,
      bnTo8(bidPrice)
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
      bidPrice,
      sellerTradeState,
      buyerReceiptTokenAccount,
      auctionHouseTreasuryAddress
    }
  }
  const derivePDAsForInstruction = async () => {
    const buyerPriceInLamports = askPrice * LAMPORTS_PER_SOL_NUMBER
    const buyerPrice: BN = new BN(buyerPriceInLamports)

    const metaDataAccount: StringPublicKey = await getMetadata(general.mint_address)
    const tradeState: [PublicKey, number] = await tradeStatePDA(
      wallet?.adapter?.publicKey,
      AUCTION_HOUSE,
      general.token_account,
      general.mint_address,
      TREASURY_MINT,
      bnTo8(buyerPrice)
    )

    const freeTradeState: [PublicKey, number] = await freeSellerTradeStatePDA(wallet?.adapter?.publicKey, general)
    const programAsSignerPDA: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(AUCTION_HOUSE_PREFIX), Buffer.from('signer')],
      toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
    )

    if (!tradeState || !freeTradeState || !programAsSignerPDA || !metaDataAccount) {
      throw Error(`Could not derive values for sell instructions`)
    }

    return {
      metaDataAccount,
      tradeState,
      freeTradeState,
      programAsSignerPDA,
      buyerPrice
    }
  }

  const callDelistInstruction = async (e: any) => {
    e.preventDefault()
    setDelistLoading(true)
    const transaction = new Transaction()
    let removeAskIX: TransactionInstruction | undefined = undefined
    // if ask exists
    if (ask !== null) {
      // make web3 cancel
      removeAskIX = await createRemoveAskIX()
    }

    // adds ixs to tx
    if (ask && removeAskIX) transaction.add(removeAskIX)
    try {
      const signature = await wal.sendTransaction(transaction, connection)
      console.log(signature)
      setPendingTxSig(signature)
      await attemptConfirmTransaction(signature, 'Delisted')
        .then(() => console.log('TX Confirmed'))
        .catch((err) => console.error(err))
      setDelistLoading(false)
    } catch (error) {
      console.log('User exited signing transaction to list fixed price')
      TransactionSignatureErrorNotify(nftMetadata.name)
      setDelistLoading(false)
    }
  }
  const callSellInstruction = async (e: any) => {
    e.preventDefault()
    if (parseFloat(ask?.buyer_price) / LAMPORTS_PER_SOL_NUMBER === askPrice) {
      notify({
        type: 'error',
        message: (
          <TransactionErrorMsg
            title={`Did not modify price!`}
            itemName={nftMetadata.name}
            supportText={`Please make sure the price is changing from current price.`}
          />
        )
      })
      return
    }

    setIsLoading(true)

    const { metaDataAccount, tradeState, freeTradeState, programAsSignerPDA, buyerPrice } =
      await derivePDAsForInstruction()

    const sellInstructionArgs: SellInstructionArgs = {
      tradeStateBump: tradeState[1],
      freeTradeStateBump: freeTradeState[1],
      programAsSignerBump: programAsSignerPDA[1],
      buyerPrice: buyerPrice,
      tokenSize: tokenSize
    }

    const sellInstructionAccounts: SellInstructionAccounts = getSellInstructionAccounts(
      wallet?.adapter?.publicKey,
      general,
      metaDataAccount,
      tradeState[0],
      freeTradeState[0],
      programAsSignerPDA[0]
    )

    const sellIX: TransactionInstruction = createSellInstruction(sellInstructionAccounts, sellInstructionArgs)

    const transaction = new Transaction()

    let removeAskIX: TransactionInstruction | undefined = undefined
    // if ask exists
    if (ask !== null) {
      // make web3 cancel
      removeAskIX = await createRemoveAskIX()
    }

    // adds ixs to tx
    console.log(`Updating ask: ${removeAskIX !== undefined}`)
    if (ask && removeAskIX) transaction.add(removeAskIX)
    transaction.add(sellIX)

    if (isSellingNow) {
      const { programAsSignerPDA } = await derivePDAForExecuteSale()
      const {
        metaDataAccount,
        escrowPaymentAccount,
        buyerTradeState,
        bidPrice,
        buyerReceiptTokenAccount,
        auctionHouseTreasuryAddress,
        sellerTradeState
      } = await derivePDAsForInstructionSell()

      if (!onChainNFTMetadata) {
        couldNotFetchNFTMetaData()
        setIsLoading(false)
        return
      }

      const creatorAccounts: web3.AccountMeta[] = onChainNFTMetadata.data.creators.map((creator) => ({
        pubkey: new PublicKey(creator.address),
        isWritable: true,
        isSigner: false
      }))

      const executeSaleInstructionArgs: ExecuteSaleInstructionArgs = {
        escrowPaymentBump: escrowPaymentAccount[1],
        freeTradeStateBump: freeTradeState[1],
        programAsSignerBump: programAsSignerPDA[1],
        buyerPrice: bidPrice,
        tokenSize: tokenSize
      }
      const executeSaleInstructionAccounts: ExecuteSaleInstructionAccounts = {
        buyer: new PublicKey(highestBid.wallet_key),
        seller: wallet?.adapter?.publicKey,
        tokenAccount: new PublicKey(highestBid?.token_account_key),
        tokenMint: new PublicKey(highestBid?.token_account_mint_key),
        metadata: new PublicKey(metaDataAccount),
        treasuryMint: new PublicKey(isSellingNow ? highestBid?.auction_house_treasury_mint_key : TREASURY_MINT),
        escrowPaymentAccount: escrowPaymentAccount[0],
        sellerPaymentReceiptAccount: wallet?.adapter?.publicKey,
        buyerReceiptTokenAccount: buyerReceiptTokenAccount[0],
        authority: new PublicKey(isSellingNow ? highestBid?.auction_house_authority : AUCTION_HOUSE_AUTHORITY),
        auctionHouse: new PublicKey(isSellingNow ? highestBid?.auction_house_key : AUCTION_HOUSE),
        auctionHouseFeeAccount: new PublicKey(isSellingNow ? highestBid?.auction_house_fee_account : AH_FEE_ACCT),
        auctionHouseTreasury: auctionHouseTreasuryAddress[0],
        buyerTradeState: buyerTradeState[0],
        sellerTradeState: sellerTradeState[0],
        freeTradeState: freeTradeState[0],
        systemProgram: SystemProgram.programId,
        programAsSigner: programAsSignerPDA[0],
        rent: new PublicKey('SysvarRent111111111111111111111111111111111'),
        ataProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
        anchorRemainingAccounts: creatorAccounts
      }

      const executeSaleIX: TransactionInstruction = await createExecuteSaleInstruction(
        executeSaleInstructionAccounts,
        executeSaleInstructionArgs
      )

      transaction.add(executeSaleIX)
    }

    try {
      const signature = await wal.sendTransaction(transaction, connection)
      console.log(signature)
      setPendingTxSig(signature)
      attemptConfirmTransaction(signature)
        .then((res) => console.log('TX Confirmed', res))
        .catch((err) => console.error(err))
    } catch (error) {
      console.log('User exited signing transaction to list fixed price')
      TransactionSignatureErrorNotify(nftMetadata.name)
      setIsLoading(false)
    }
  }

  const createRemoveAskIX = async (): Promise<TransactionInstruction> => {
    const usrAddr: PublicKey = wallet?.adapter?.publicKey
    if (!usrAddr) {
      console.log('no public key connected')
      return
    }

    const curAskingPrice: BN = new BN(parseFloat(ask.buyer_price))
    const tradeState: [PublicKey, number] = await tradeStatePDA(
      usrAddr,
      AUCTION_HOUSE,
      general.token_account,
      general.mint_address,
      TREASURY_MINT,
      bnTo8(curAskingPrice)
    )

    const cancelInstructionArgs: CancelInstructionArgs = {
      buyerPrice: curAskingPrice,
      tokenSize: tokenSize
    }

    const cancelInstructionAccounts: CancelInstructionAccounts = {
      wallet: wallet?.adapter?.publicKey,
      tokenAccount: new PublicKey(general.token_account),
      tokenMint: new PublicKey(general.mint_address),
      authority: new PublicKey(AUCTION_HOUSE_AUTHORITY),
      auctionHouse: new PublicKey(AUCTION_HOUSE),
      auctionHouseFeeAccount: new PublicKey(AH_FEE_ACCT),
      tradeState: tradeState[0]
    }

    const cancelIX: TransactionInstruction = await createCancelInstruction(
      cancelInstructionAccounts,
      cancelInstructionArgs
    )
    return cancelIX
  }

  const updateAskPrice = (e) => {
    if (e.target.value === '') setAskPrice(null)
    else if (parseFloat(e.target.value) < TEN_MILLION) {
      setAskPrice(parseFloat(e.target.value))
    }
  }
  const nftID = general?.nft_name.split('#')[1]
  if (acceptBid)
    return (
      <AcceptBidModal
        visible={visible}
        bidPrice={bidPrice}
        closeTheModal={closeTheModal}
        isLoading={isLoading}
        callSellInstruction={callSellInstruction}
      />
    )
  if (delistNFT)
    return (
      <DelistNFTModal
        visible={visible}
        pendingTxSig={pendingTxSig}
        closeTheModal={closeTheModal}
        isDelistLoading={isDelistLoading}
        callDelistInstruction={callDelistInstruction}
      />
    )

  return (
    <STYLED_POPUP_BUY_MODAL
      height={checkMobile() ? '610px' : '780px'}
      width={checkMobile() ? '100%' : '580px'}
      title={null}
      centered={checkMobile() ? false : true}
      visible={visible}
      onCancel={closeTheModal}
      footer={null}
    >
      <>
        <div>
          {checkMobile() && <img className="nftImgBid" src={general.image_url} alt="" />}

          <div tw="flex flex-col sm:mt-[-135px] sm:items-start items-center">
            <div className="buyTitle">
              You are about to List: <br />
              <GenericTooltip text={general?.nft_name}>
                <strong>{minimizeTheString(general?.nft_name, checkMobile() ? 12 : 16)} </strong>{' '}
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
            {!checkMobile() && <img className="nftImg" src={general.image_url} alt="" />}

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
        </div>
        <div className="maxBid" tw="text-center mt-4 sm:!mt-[100px]">
          Enter Price
        </div>
        <div className="sellInputContainer">
          <input
            className="enterBid"
            placeholder="0.0"
            type="number"
            ref={inputRef}
            value={askPrice}
            onChange={(e) => updateAskPrice(e)}
          />
          <img
            src="/img/crypto/SOL.svg"
            tw="absolute h-[35px] w-[35px] right-[8px] sm:h-[30px] sm:w-[30px] top-[10px] sm:top-[10px] sm:right-2"
          />
        </div>

        <div tw="mt-[90px]">
          <AppraisalValueSmall text={appraisalValueText} label={appraisalValueLabel} width={246} />
        </div>

        {/* <div className="vContainer">
          <input
            className="enterBid"
            placeholder="0.0"
            type="number"
            ref={inputRef}
            value={askPrice}
            onChange={(e) => updateAskPrice(e)}
          />
          <img src="/img/crypto/SOL.svg" tw="absolute right-[12px] top-[17px]" />
        </div> */}

        {pendingTxSig && (
          <div tw="mt-3 text-center">
            <span>
              <img
                style={{ height: '26px', marginRight: '6px' }}
                src={`/img/assets/solscan.png`}
                alt="solscan-icon"
              />
            </span>
            <GFX_LINK
              href={`https://solscan.io/tx/${pendingTxSig}?cluster=${network}`}
              target={'_blank'}
              rel="noreferrer"
            >
              View Transaction
            </GFX_LINK>
          </div>
        )}

        <div className="feesContainer">
          <div className="rowContainer">
            <div className="leftAlign">Price</div>
            <div className="rightAlign">{askPrice >= 0 ? askPrice : 0} SOL</div>
          </div>
          <div className="rowContainer">
            <div className="leftAlign" tw="flex">
              Service Fee
              {/* {TableHeaderTitle('', `Creator Fee (${sellerFeeBasisPoints / 100}%) `, false)}{' '} */}
            </div>
            <div className="rightAlign"> {serviceFee.toFixed(3)} SOL</div>
          </div>
          <div className="rowContainer">
            <div className="leftAlign">Creators Fee</div>
            <div className="rightAlign"> {creatorFee.toFixed(2)} SOL</div>
          </div>
          <div className="rowContainer">
            <div className="leftAlign">Total amount to receive</div>
            <div className="rightAlign"> {totalToReceive.toFixed(2)} SOL</div>
          </div>
        </div>

        {checkMobile() && <BorderBottom />}
        <div className="buyBtnContainer">
          <Button
            disabled={
              askPrice <= 0 ||
              askPrice === null ||
              parseFloat(ask?.buyer_price) / LAMPORTS_PER_SOL_NUMBER === askPrice
            }
            onClick={callSellInstruction}
            className={ask ? `sellButton blueBg` : `sellButton`}
            loading={isLoading}
          >
            <span tw="font-semibold">{ask ? 'Modify Price' : 'List Item'}</span>
          </Button>
        </div>
        <div
          tw="bottom-0 left-[calc(50% - 160px)] sm:left-[calc(50% - 150px)] 
        sm:w-[auto] sm:mb-[75px] absolute sm:right-auto"
        >
          <TermsTextNFT string={ask ? 'List' : 'Modify '} />
        </div>
      </>
    </STYLED_POPUP_BUY_MODAL>
  )
}

export const BorderBottom = (): ReactElement =>
  checkMobile() && <div className="borderBottom" tw="h-0.5 sm:absolute bottom-[80px] w-[100vw] ml-[-24px]"></div>
