/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactElement, useState, FC, useMemo, useEffect, useRef, useCallback } from 'react'
import {
  // useAccounts,
  useConnectionConfig,
  useNFTAggregator,
  useNFTCollections,
  useNFTDetails
} from '../../../context'
import { Metaplex, walletAdapterIdentity } from '@metaplex-foundation/js'
import { Button, TransactionErrorMsg } from '../../../components'
import { checkMobile, formatSOLNumber, notify } from '../../../utils'
import { AppraisalValueSmall, GenericTooltip } from '../../../utils/GenericDegsin'
import {
  PublicKey,
  TransactionInstruction,
  Transaction,
  SystemProgram,
  AccountMeta,
  Keypair,
  ComputeBudgetProgram
} from '@solana/web3.js'
import { tradeStatePDA, tokenSize, freeSellerTradeStatePDA, freeSellerTradeStatePDAAgg } from '../actions'
import { LAMPORTS_PER_SOL_NUMBER, NFT_MARKET_TRANSACTION_FEE } from '../../../constants'
// import { useHistory } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import BN from 'bn.js'
import {
  AH_FEE_ACCT,
  AUCTION_HOUSE_PREFIX,
  AUCTION_HOUSE,
  AUCTION_HOUSE_PROGRAM_ID,
  AUCTION_HOUSE_AUTHORITY,
  TREASURY_MINT,
  toPublicKey,
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

import { STYLED_POPUP_BUY_MODAL } from './BuyNFTModal'
import {
  couldNotFetchNFTMetaData,
  didNotModifyPrice,
  successfulListingMsg,
  TransactionSignatureErrorNotify
} from './AggModals/AggNotifications'
import { getNFTMetadata, minimizeTheString } from '../../../web3/nfts/utils'
import { web3 } from '@project-serum/anchor'
import DelistNFTModal from './DelistNFTModal'
import AcceptBidModal, { TermsTextNFT } from './AcceptBidModal'
import { saveNftTx } from '../../../api/NFTs'
import { constructListInstruction, derivePNFTAccounts } from '../../../web3/auction-house-sdk/list'
import { createRemoveAskIX } from '../../../web3/auction-house-sdk/cancelListing'
import bs58 from 'bs58'

export const SellNFTModal: FC<{
  visible: boolean
  handleClose: any
  delistNFT?: boolean
  acceptBid?: boolean
}> = ({ visible, handleClose, delistNFT, acceptBid }): ReactElement => {
  const { connection, network } = useConnectionConfig()
  const { general, ask, nftMetadata, bids } = useNFTDetails()
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
  const { setSellNFT, setOpenJustModal, appraisalIsEnabled } = useNFTAggregator()
  const wal = useWallet()
  const { wallet } = wal
  const [askPrice, setAskPrice] = useState<number | null>(0)
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
  const isPnft = useMemo(() => onChainNFTMetadata?.tokenStandard === 4, [onChainNFTMetadata])

  const isAcceptingBid = useMemo(() => bidPrice === askPrice, [askPrice])

  const closeTheModal = () => {
    setOpenJustModal(false)
    handleClose()
  }

  useEffect(() => {
    if (highestBid) {
      setAskPrice((prev) => (prev ? prev : formatSOLNumber(highestBid ? highestBid?.buyer_price : 0)))
    }
  }, [highestBid])
  const serviceFee = useMemo(
    () => (askPrice ? (askPrice * NFT_MARKET_TRANSACTION_FEE) / 100 : 0),
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

  const auctionHouseClient = useMemo(
    () => new Metaplex(connection).use(walletAdapterIdentity(wal)).auctionHouse(),
    [connection, wallet]
  )

  const sendNftTransactionLog = useCallback(
    (txType, signature, isModified) => {
      saveNftTx(
        'GooseFX',
        askPrice,
        general?.mint_address,
        general?.collection_name,
        txType,
        signature,
        general?.uuid,
        wallet?.adapter?.publicKey?.toString()
      )
    },
    [general, ask, askPrice]
  )

  useEffect(
    () => () => {
      setSellNFT(false)
    },
    []
  )

  const attemptConfirmTransaction = async (
    signature: any,
    notifyStr?: string,
    isModified?: boolean,
    signatureStatus?: string,
    dontNotify?: boolean
  ): Promise<void> => {
    try {
      const confirm = await confirmTransaction(
        connection,
        signature,
        signatureStatus ? signatureStatus : 'confirmed'
      )
      // successfully list nft
      if (confirm.value.err === null) {
        if (isAcceptingBid)
          notify(successfulListingMsg('accepted bid of', signature, nftMetadata, askPrice.toFixed(2)))
        else
          notify(
            successfulListingMsg(notifyStr ? notifyStr : 'Listed', signature, nftMetadata, askPrice.toFixed(2))
          )
        setIsLoading(false)
        sendNftTransactionLog(notifyStr, signature, isModified)

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
      isAcceptingBid ? new PublicKey(highestBid.wallet_key) : wallet?.adapter?.publicKey,
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
        toPublicKey(isAcceptingBid ? highestBid?.auction_house_key : AUCTION_HOUSE).toBuffer(),
        Buffer.from(TREASURY_PREFIX)
      ],
      toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
    )

    const metaDataAccount: StringPublicKey = await getMetadata(general.mint_address)
    const escrowPaymentAccount: [PublicKey, number] = await PublicKey.findProgramAddress(
      [
        Buffer.from(AUCTION_HOUSE_PREFIX),
        toPublicKey(isAcceptingBid ? highestBid?.auction_house_key : AUCTION_HOUSE).toBuffer(),
        buyerPublicKey.toBuffer()
      ],
      toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
    )

    const buyerTradeState: [PublicKey, number] = await tradeStatePDA(
      buyerPublicKey,
      isAcceptingBid ? highestBid?.auction_house_key : AUCTION_HOUSE,
      general.token_account,
      general.mint_address,
      isAcceptingBid ? highestBid?.auction_house_treasury_mint_key : TREASURY_MINT,
      bnTo8(bidPrice)
    )
    const sellerTradeState: [PublicKey, number] = await tradeStatePDA(
      wallet?.adapter?.publicKey,
      isAcceptingBid ? highestBid?.auction_house_key : AUCTION_HOUSE, // try changing this
      general.token_account,
      general.mint_address,
      isAcceptingBid ? highestBid?.auction_house_treasury_mint_key : TREASURY_MINT,
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
    try {
      if (ask !== null) {
        // make web3 cancel
        removeAskIX = await createRemoveAskIX(connection, wal, ask, general, isPnft)
      }
      // adds ixs to tx
      if (ask && removeAskIX) {
        transaction.add(removeAskIX)
      }
      const signature = await wal.sendTransaction(transaction, connection)
      console.log(signature)
      setPendingTxSig(signature)
      await attemptConfirmTransaction(signature, 'CANCEL_LIST', removeAskIX !== undefined, 'confirmed')
        .then(() => console.log('TX Confirmed'))
        .catch((err) => console.error(err))
      setDelistLoading(false)
    } catch (error) {
      console.log('User exited signing transaction to list fixed price')
      TransactionSignatureErrorNotify(nftMetadata.name, 'User exited signing transaction to list fixed price')
      setDelistLoading(false)
    }
  }

  const callSellInstruction = async (e: any) => {
    e.preventDefault()
    if (parseFloat(ask?.buyer_price) / LAMPORTS_PER_SOL_NUMBER === askPrice) {
      didNotModifyPrice('Please make sure the price is changing from current price.')
      return
    }
    setIsLoading(true)
    let transaction: Transaction
    let removeAskIX: TransactionInstruction | undefined = undefined

    try {
      transaction = new Transaction()

      if (ask !== null) {
        // make web3 cancel
        removeAskIX = await createRemoveAskIX(connection, wal, ask, general, isPnft)
      }
      // adds ixs to tx
      if (ask && removeAskIX) {
        transaction.add(removeAskIX)
      }
      const instructions = await constructListInstruction(
        connection,
        wal,
        toPublicKey(general?.mint_address),
        toPublicKey(general?.token_account),
        askPrice,
        true,
        isPnft
      )
      for (const ix of instructions) transaction.add(ix)
    } catch (error) {
      console.log(error)
      TransactionSignatureErrorNotify(nftMetadata.name, 'Failed to build instructions for Listing NFT')
      setIsLoading(false)
      return
    }

    const { metaDataAccount, tradeState, freeTradeState, programAsSignerPDA, buyerPrice } =
      await derivePDAsForInstruction()

    let executePnftAcceptBid: Transaction
    if (isAcceptingBid) {
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
      const metaplex: Metaplex = new Metaplex(connection).use(walletAdapterIdentity(wal))
      const programAsSigner = metaplex.auctionHouse().pdas().programAsSigner()

      const pnftAccounts = await derivePNFTAccounts(
        connection,
        toPublicKey(highestBid?.wallet_key),
        programAsSigner,
        toPublicKey(highestBid?.token_account_mint_key),
        wallet?.adapter?.publicKey
      )
      const executeSaleAnchorRemainingAccounts: AccountMeta[] = [
        pnftAccounts.metadataProgram,
        pnftAccounts.edition,
        pnftAccounts.sellerTokenRecord,
        pnftAccounts.tokenRecord,
        pnftAccounts.authRulesProgram,
        pnftAccounts.authRules,
        pnftAccounts.sysvarInstructions
      ]

      let remainingAccounts: AccountMeta[] = []

      remainingAccounts = remainingAccounts.concat(...creatorAccounts)
      if (isPnft) remainingAccounts = remainingAccounts.concat(...executeSaleAnchorRemainingAccounts)

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
        treasuryMint: new PublicKey(isAcceptingBid ? highestBid?.auction_house_treasury_mint_key : TREASURY_MINT),
        escrowPaymentAccount: escrowPaymentAccount[0],
        sellerPaymentReceiptAccount: wallet?.adapter?.publicKey,
        buyerReceiptTokenAccount: buyerReceiptTokenAccount[0],
        authority: new PublicKey(isAcceptingBid ? highestBid?.auction_house_authority : AUCTION_HOUSE_AUTHORITY),
        auctionHouse: new PublicKey(isAcceptingBid ? highestBid?.auction_house_key : AUCTION_HOUSE),
        auctionHouseFeeAccount: new PublicKey(
          isAcceptingBid ? highestBid?.auction_house_fee_account : AH_FEE_ACCT
        ),
        auctionHouseTreasury: auctionHouseTreasuryAddress[0],
        buyerTradeState: buyerTradeState[0],
        sellerTradeState: sellerTradeState[0],
        freeTradeState: freeTradeState[0],
        systemProgram: SystemProgram.programId,
        programAsSigner: programAsSignerPDA[0],
        rent: new PublicKey('SysvarRent111111111111111111111111111111111'),
        ataProgram: SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
        anchorRemainingAccounts: remainingAccounts
      }

      const executeSaleIX: TransactionInstruction = await createExecuteSaleInstruction(
        executeSaleInstructionAccounts,
        executeSaleInstructionArgs
      )
      if (isPnft) {
        executeSaleIX.keys.at(4).isWritable = true
        executeSaleIX.keys.at(9).isSigner = true
        executeSaleIX.keys.at(9).isWritable = true
      }
      const additionalComputeBudgetInstruction = ComputeBudgetProgram.setComputeUnitLimit({ units: 400000 })
      if (isPnft) {
        executePnftAcceptBid = new Transaction()
        executePnftAcceptBid.add(additionalComputeBudgetInstruction)
        executePnftAcceptBid.add(executeSaleIX)
      } else {
        transaction.add(executeSaleIX)
      }
    }

    try {
      const signature = await wal.sendTransaction(transaction, connection)
      setPendingTxSig(signature)
      attemptConfirmTransaction(
        signature,
        !isPnft && acceptBid ? 'ACCEPT_BID' : 'LIST',
        removeAskIX ? true : false,
        isPnft ? 'finalized' : 'confirmed',
        isPnft
      )
        .then(async (res) => {
          // for pnft accept bid facing too long issue, so sending it separately, this is temp fix,find better solution
          if (isPnft) {
            const authority = process.env.REACT_APP_AUCTION_HOUSE_PRIVATE_KEY
            const treasuryWallet = Keypair.fromSecretKey(bs58.decode(authority))

            const pnftExecuteSaleSig = await wal.sendTransaction(executePnftAcceptBid, connection, {
              signers: [treasuryWallet],
              skipPreflight: true
            })

            attemptConfirmTransaction(
              pnftExecuteSaleSig,
              acceptBid ? 'ACCEPT_BID' : 'LIST',
              removeAskIX ? true : false
            )
              .then((res) => console.log('Accepted bid', res))
              .catch((err) => {
                setIsLoading(false)
                setPendingTxSig(null)
                console.log(err)
              })

            console.log('Pnft tx confirmed', res)
          }
          console.log('NFT tx confirmed', res)
        })

        .catch((err) => console.error(err))
    } catch (error) {
      console.error('User exited signing transaction to list fixed price')
      TransactionSignatureErrorNotify(nftMetadata.name)
      setIsLoading(false)
    }
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
            {!checkMobile() && (
              <div className="nftImg">
                <img src={general.image_url} alt="nft-image" />
              </div>
            )}

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
          {appraisalIsEnabled && (
            <AppraisalValueSmall text={appraisalValueText} label={appraisalValueLabel} width={246} />
          )}
        </div>

        {pendingTxSig && (
          <div tw="absolute sm:relative flex ml-[calc(50% - 100px)] sm:ml-[calc(50% - 85px)]">
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

        <div className="feesContainer">
          <div className="rowContainer">
            <div className="leftAlign">Price</div>
            <div className="rightAlign">{askPrice >= 0 ? askPrice : 0} SOL</div>
          </div>
          <div className="rowContainer">
            <div className="leftAlign" tw="flex">
              Service Fee ({NFT_MARKET_TRANSACTION_FEE}%)
            </div>
            <div className="rightAlign"> {serviceFee.toFixed(totalToReceive > 9 ? 2 : 3)} SOL</div>
          </div>
          <div className="rowContainer">
            <div className="leftAlign">Royalty ({sellerFeeBasisPoints / 100}%)</div>
            <div className="rightAlign"> {creatorFee.toFixed(totalToReceive > 9 ? 2 : 3)} SOL</div>
          </div>
          <div className="rowContainer">
            <div className="leftAlign">Total amount to receive</div>
            <div className="rightAlign">{totalToReceive.toFixed(totalToReceive > 9 ? 2 : 3)} SOL</div>
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
        <div tw="bottom-0 left-[calc(50% - 160px)] sm:absolute sm:w-[auto] absolute sm:right-auto">
          <TermsTextNFT string={ask ? 'List' : 'Modify '} bottom={true} />
        </div>
      </>
    </STYLED_POPUP_BUY_MODAL>
  )
}

export const BorderBottom = (): ReactElement =>
  checkMobile() && <div className="borderBottom" tw="h-[1px] sm:absolute bottom-[80px] w-[100vw] ml-[-24px]"></div>
