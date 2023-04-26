/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ReactElement, useState, FC, useMemo, useEffect } from 'react'
import { Col, Row } from 'antd'
import {
  useAccounts,
  useConnectionConfig,
  useNFTCollections,
  useNFTAggregator,
  useNFTDetails,
  useNFTProfile,
  usePriceFeedFarm,
  useWalletModal
} from '../../../context'
import { SuccessfulListingMsg } from '../../../components'

import { checkMobile, formatSOLDisplay, notify, truncateAddress } from '../../../utils'
import { AppraisalValue } from '../../../utils/GenericDegsin'
import { PopupCustom } from '../Popup/PopupCustom'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { PublicKey, TransactionInstruction, Transaction, SystemProgram } from '@solana/web3.js'
import { tradeStatePDA, getBuyInstructionAccounts, tokenSize, freeSellerTradeStatePDAAgg } from '../actions'

import { LAMPORTS_PER_SOL_NUMBER, NFT_MARKET_TRANSACTION_FEE } from '../../../constants'
import { useHistory } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import BN from 'bn.js'
import {
  AUCTION_HOUSE_PREFIX,
  AUCTION_HOUSE_PROGRAM_ID,
  TREASURY_MINT,
  AUCTION_HOUSE_AUTHORITY,
  AUCTION_HOUSE,
  AH_FEE_ACCT,
  WRAPPED_SOL_MINT,
  BuyInstructionArgs,
  getMetadata,
  BuyInstructionAccounts,
  createBuyInstruction,
  createCancelInstruction,
  CancelInstructionArgs,
  CancelInstructionAccounts,
  StringPublicKey,
  toPublicKey,
  bnTo8,
  ExecuteSaleInstructionArgs,
  confirmTransaction,
  ExecuteSaleInstructionAccounts,
  TOKEN_PROGRAM_ID,
  SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID,
  TREASURY_PREFIX,
  createExecuteSaleInstruction
} from '../../../web3'
import { Button } from '../../../components/Button'
import { GFX_LINK } from '../../../styles'
import { web3 } from '@project-serum/anchor'
import { ReviewBidModal } from './AggModals/ReviewBidModal'
import { HoldTight } from './AggModals/HoldTight'
import MissionAccomplishedModal from './AggModals/MissionAcomplishedModal'
import {
  couldNotDeriveValueForBuyInstruction,
  couldNotFetchNFTMetaData,
  couldNotFetchUserData,
  pleaseTryAgain,
  successBidMatchedMessage,
  successfulListingMessage
} from './AggModals/AggNotifications'
import { getNFTMetadata } from '../../../web3/nfts/utils'
const TEN_MILLION = 10000000

export const STYLED_POPUP_BUY_MODAL = styled(PopupCustom)<{ lockModal: boolean }>`
  ${tw`flex flex-col mt-[-30px] `}
  .ant-modal-content {
    height: 100%;
  }
  .ant-modal-close-x {
    visibility: ${({ lockModal }) => (lockModal ? 'hidden' : 'visible')};
    img {
      ${tw`w-5 h-5 mt-[-5px] ml-2`}
    }
  }
  &.ant-modal {
    ${tw`max-w-full sm:bottom-[-10px] sm:mt-auto sm:absolute sm:h-[600px]`}
    background-color: ${({ theme }) => theme.bg26};
  }
  color: ${({ theme }) => theme.text20};

  .buyTitle {
    ${tw`text-[24px] sm:ml-[140px] sm:mt-1 sm:text-[15px] sm:pt-2 font-medium text-center sm:text-left `}
    color: ${({ theme }) => theme.text20};

    strong {
      ${tw`sm:text-[20px] font-bold sm:mt-[-10px] leading-6`}
      color: ${({ theme }) => theme.text32};
    }
  }
  .verifiedText {
    ${tw`font-semibold text-[16px] text-[#fff] sm:text-[15px] mt-2 mb-1
        sm:text-left sm:ml-[140px] sm:mt-[5px] h-4`}
  }
  .hContainer {
    ${tw`flex flex-col items-center justify-center`}
  }
  .vContainer {
    ${tw`flex items-center justify-center relative`}
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }

    /* Firefox */
    input[type='number'] {
      -moz-appearance: textfield;
    }
  }
  .bidButton {
    ${tw`w-[160px] h-[60px] sm:h-[50px] rounded-[50px] items-center cursor-pointer
    justify-center flex  text-[20px] font-semibold`}
    background: ${({ theme }) => theme.bg22};
  }
  .bidButtonSelected {
    ${tw`w-[160px] h-[60px] sm:h-[50px] rounded-[50px] items-center cursor-pointer bg-[#5858ff] text-[#fff]
    justify-center flex  text-[20px] font-semibold`}
  }
  .verifiedImg {
    ${tw`h-[35px] sm:w-[18px]  sm:h-[18px] w-[35px] mr-2 sm:mt-0 sm:ml-2`}
  }
  .rowContainer {
    ${tw`flex items-center justify-between w-[90%]`}
  }
  .leftAlign {
    ${tw`text-[17px] font-semibold mt-1`}
  }
  .rightAlign {
    ${tw`text-[17px] text-white font-semibold`}
  }

  .nftImg {
    ${tw`w-[165px] h-[165px] sm:mt-[150px] mt-[25px] rounded-[5px] sm:h-[125px] sm:w-[125px] sm:left-0 sm:absolute`}
  }
  .currentBid {
    ${tw`text-[14px] font-semibold ml-4 sm:mt-[10px] text-[#636363] `}
  }
  .maxBid {
    ${tw`text-[25px] sm:text-[20px] font-semibold leading-7 sm:mt-[20px]	`}
    color: ${({ theme }) => theme.text20}
  }
  .enterBid {
    ${tw`h-12 mt-2  w-[220px] bg-none sm:h-[48px]
    sm:mt-0 border-none text-center rounded-[25px] text-[40px]  font-semibold`}
    background: ${({ theme }) => theme.bg26};
    color: ${({ theme }) => theme.text30};
  }
  .nftImgBid {
    ${tw`w-[165px] h-[165px] sm:mt-[150px] rounded-[10px]
     left-0 mt-[25px] sm:mt-2 sm:h-[125px] sm:w-[125px] sm:left-0 `}
  }

  .priceText {
    ${tw`text-[25px] font-semibold mt-2`}
    color: ${({ theme }) => theme.text12};
  }
  .priceValue {
    ${tw`text-xl font-semibold leading-none`}
    color: ${({ theme }) => theme.text7};
  }
  .sellButton {
    ${tw`w-[520px] sm:h-[50px] sm:text-[15px]  bottom-4 cursor-pointer text-[#EEEEEE] rounded-[50px] border-none
     h-[60px] text-white text-[20px] font-semibold flex items-center bg-[#F24244] justify-center`}
    :disabled {
      ${tw`text-[#636363] cursor-not-allowed`}
      background: ${({ theme }) => theme.bg22} !important;
    }
  }
  .semiSellButton {
    ${tw`w-[250px] mr-4 sm:h-[50px] sm:text-[15px]  bottom-4 cursor-pointer text-[#EEEEEE] rounded-[50px] border-none
     h-[60px] text-white text-[20px] font-semibold flex items-center bg-[#F24244] justify-center`}
    :disabled {
      ${tw`text-[#636363] cursor-not-allowed`}
      background: ${({ theme }) => theme.bg22} !important;
    }
  }
  .semiBuyButton {
    ${tw`w-[250px] mr-4 sm:h-[50px] sm:text-[15px]  bottom-4 cursor-pointer text-[#EEEEEE] rounded-[50px] border-none
     h-[60px] text-white text-[20px] font-semibold flex items-center   justify-center`}
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);

    :disabled {
      ${tw`text-[#636363] cursor-not-allowed`}
      background: ${({ theme }) => theme.bg22} !important;
    }
  }

  .buyButton {
    ${tw`w-[520px] sm:h-[50px] sm:text-[15px]  cursor-pointer rounded-[50px] border-none
     h-[60px] text-white text-[20px] font-semibold flex items-center justify-center`}
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    &:disabled {
      ${tw`text-[#636363] cursor-not-allowed`}
      background: ${({ theme }) => theme.bg22};
    }
  }
  .priceNumber {
    ${tw`text-[40px] font-semibold flex items-center mt-[-12px] justify-center `}
    color: ${({ theme }) => theme.text31};
    img {
      ${tw`h-[25px] w-[25px] ml-3`}
    }
  }
  .drawLine {
    background: ${({ theme }) => theme.tokenBorder};
    ${tw`h-[2px] w-[100vw] `}
  }
  .buyBtnContainer {
    ${tw`flex items-center justify-between sm:mt-[20px] absolute bottom-4  `}
  }

  .bm-title {
    padding-top: 12px;
    font-size: 20px;
    font-weight: 500;
    text-align: center;
  }
`
const handleCloseModal = (setGeneral, setModal, isLoading) => {
  if (!isLoading) {
    setGeneral(null)
    setModal(false)
  }
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const BuyNFTModal = (): ReactElement => {
  const { buyNowClicked, setBuyNow } = useNFTAggregator()
  const { ask, setGeneral } = useNFTDetails()
  const { connected } = useWallet()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { setVisible } = useWalletModal()
  const sellerPrice: number = parseFloat(ask?.buyer_price) / LAMPORTS_PER_SOL_NUMBER

  useEffect(() => {
    if (buyNowClicked) {
      if (!connected) {
        setVisible(true)
        setBuyNow(false)
      }
    }
  }, [buyNowClicked])

  return (
    <STYLED_POPUP_BUY_MODAL
      lockModal={isLoading}
      height={checkMobile() ? '655px' : '780px'}
      width={checkMobile() ? '100%' : '580px'}
      title={null}
      visible={buyNowClicked ? true : false}
      onCancel={() => handleCloseModal(setGeneral, setBuyNow, isLoading)}
      footer={null}
    >
      <FinalPlaceBid curBid={sellerPrice} isLoading={isLoading} setIsLoading={setIsLoading} />
    </STYLED_POPUP_BUY_MODAL>
  )
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const BidNFTModal = (): ReactElement => {
  const { ask } = useNFTDetails()
  const { bidNowClicked, setBidNow } = useNFTAggregator()
  const [selectedBtn, setSelectedBtn] = useState<number | undefined>(undefined)
  const [reviewBtnClicked, setReviewClicked] = useState<boolean>(false)
  const purchasePrice = useMemo(() => parseFloat(ask ? ask?.buyer_price : '0') / LAMPORTS_PER_SOL_NUMBER, [ask])
  const [curBid, setCurBid] = useState<number | undefined>(purchasePrice ? purchasePrice : undefined)
  const { connected } = useWallet()
  const { setGeneral } = useNFTDetails()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { setVisible } = useWalletModal()
  const updateBidValue = (e) => {
    if (parseFloat(e.target.value) < TEN_MILLION) setCurBid(e.target.value)
    handleSetCurBid(e.target.value, -1)
  }

  useEffect(() => {
    if (bidNowClicked) {
      if (!connected) {
        setVisible(true)
        setBidNow(false)
      }
    }
  }, [bidNowClicked])
  const handleSetCurBid = (value: number, index: number) => {
    setCurBid(value)
    setSelectedBtn(index)
  }
  const handleModalClose = () => {
    setCurBid(0)
    setSelectedBtn(undefined)
    setReviewClicked(false)
    setBidNow(false)
    setGeneral(null)
  }

  return (
    <STYLED_POPUP_BUY_MODAL
      lockModal={isLoading}
      height={checkMobile() ? '600px' : '780px'}
      width={checkMobile() ? '100%' : '580px'}
      title={null}
      visible={bidNowClicked ? true : false}
      onCancel={() => !isLoading && handleModalClose()}
      footer={null}
    >
      {reviewBtnClicked ? (
        <FinalPlaceBid curBid={curBid} isLoading={isLoading} setIsLoading={setIsLoading} />
      ) : (
        <ReviewBidModal
          curBid={curBid}
          selectedBtn={selectedBtn}
          updateBidValue={updateBidValue}
          handleSetCurBid={handleSetCurBid}
          setReviewClicked={setReviewClicked}
        />
      )}
    </STYLED_POPUP_BUY_MODAL>
  )
}

const FinalPlaceBid: FC<{ curBid: number; isLoading: boolean; setIsLoading: any }> = ({
  curBid,
  isLoading,
  setIsLoading
}) => {
  const { setBidNow } = useNFTAggregator()
  const { singleCollection } = useNFTCollections()
  const { prices } = usePriceFeedFarm()
  const { getUIAmount } = useAccounts()
  const history = useHistory()
  const { sessionUser, fetchSessionUser } = useNFTProfile()
  const { connected, wallet, sendTransaction } = useWallet()
  const { connection, network } = useConnectionConfig()
  const { general, nftMetadata, bidOnSingleNFT, ask, bids } = useNFTDetails()
  const [missionAccomplished, setMissionAccomplished] = useState<boolean>(true)
  const [mode, setMode] = useState<string>(curBid ? 'review' : 'bid')
  const [pendingTxSig, setPendingTxSig] = useState<string | null>(null)

  const publicKey: PublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet])

  const isBuyingNow: boolean = useMemo(
    () => parseFloat(ask?.buyer_price) / LAMPORTS_PER_SOL_NUMBER === curBid,
    [curBid]
  )

  const servicePriceCalc: number = useMemo(
    () => (curBid ? parseFloat(((NFT_MARKET_TRANSACTION_FEE / 100) * curBid).toFixed(3)) : 0),
    [curBid]
  )
  const orderTotal: number = useMemo(() => curBid, [curBid])
  const marketData = useMemo(() => prices['SOL/USDC'], [prices])

  const notEnough: boolean = useMemo(
    () => (orderTotal >= getUIAmount(WRAPPED_SOL_MINT.toBase58()) ? true : false),
    [curBid]
  )

  useEffect(() => {
    setMode('bid')
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (wallet?.adapter?.connected && publicKey) {
      if (!sessionUser || sessionUser.pubkey !== publicKey.toBase58()) {
        fetchUser(publicKey.toBase58())
      }
      setIsLoading(false)
    } else {
      setIsLoading(false)
    }

    return null
  }, [publicKey, wallet?.adapter?.connected])

  const fetchUser = (curPubKey: string) => {
    fetchSessionUser('address', curPubKey, connection).then((res) => {
      if (!res || (res.response && res.response.status !== 200) || res.isAxiosError) {
        couldNotFetchUserData()
      }
    })
  }

  const callCancelInstruction = async () => {
    const { buyerTradeState, buyerPrice } = await derivePDAsForInstruction()

    const cancelInstructionArgs: CancelInstructionArgs = {
      buyerPrice: buyerPrice,
      tokenSize: tokenSize
    }

    const cancelInstructionAccounts: CancelInstructionAccounts = {
      wallet: publicKey,
      tokenAccount: new PublicKey(general.token_account),
      tokenMint: new PublicKey(general.mint_address),
      authority: new PublicKey(AUCTION_HOUSE_AUTHORITY),
      auctionHouse: new PublicKey(AUCTION_HOUSE),
      auctionHouseFeeAccount: new PublicKey(AH_FEE_ACCT),
      tradeState: buyerTradeState[0]
    }

    const cancelIX: TransactionInstruction = await createCancelInstruction(
      cancelInstructionAccounts,
      cancelInstructionArgs
    )

    const transaction = new Transaction().add(cancelIX)
    const signature = await sendTransaction(transaction, connection)
    console.log(signature)
    const confirm = await connection.confirmTransaction(signature, 'finalized')
    console.log(confirm)
  }
  const derivePDAForExecuteSale = async () => {
    const programAsSignerPDA: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(AUCTION_HOUSE_PREFIX), Buffer.from('signer')],
      toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
    )
    const freeTradeStateAgg: [PublicKey, number] = await freeSellerTradeStatePDAAgg(
      new PublicKey(ask?.wallet_key),
      isBuyingNow ? ask?.auction_house_key : AUCTION_HOUSE,
      general.token_account,
      general.mint_address
    )
    return {
      freeTradeStateAgg,
      programAsSignerPDA
    }
  }
  const derivePDAsForInstruction = async () => {
    const buyerPriceInLamports = orderTotal * LAMPORTS_PER_SOL_NUMBER
    const buyerPrice: BN = new BN(buyerPriceInLamports)
    const buyerReceiptTokenAccount: [PublicKey, number] = await PublicKey.findProgramAddress(
      [publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), toPublicKey(general.mint_address).toBuffer()],
      SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
    )
    const auctionHouseTreasuryAddress: [PublicKey, number] = await PublicKey.findProgramAddress(
      [
        Buffer.from(AUCTION_HOUSE_PREFIX),
        toPublicKey(isBuyingNow ? ask?.auction_house_key : AUCTION_HOUSE).toBuffer(),
        Buffer.from(TREASURY_PREFIX)
      ],
      toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
    )

    const metaDataAccount: StringPublicKey = await getMetadata(general.mint_address)
    const escrowPaymentAccount: [PublicKey, number] = await PublicKey.findProgramAddress(
      [
        Buffer.from(AUCTION_HOUSE_PREFIX),
        toPublicKey(isBuyingNow ? ask?.auction_house_key : AUCTION_HOUSE).toBuffer(),
        publicKey.toBuffer()
      ],
      toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
    )

    const buyerTradeState: [PublicKey, number] = await tradeStatePDA(
      publicKey,
      isBuyingNow ? ask?.auction_house_key : AUCTION_HOUSE,
      general.token_account,
      general.mint_address,
      isBuyingNow ? ask?.auction_house_treasury_mint_key : TREASURY_MINT,
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
      treasuryMint: new PublicKey(isBuyingNow ? ask?.auction_house_treasury_mint_key : TREASURY_MINT),
      tokenAccount: new PublicKey(general.token_account),
      metadata: new PublicKey(metaDataAccount),
      escrowPaymentAccount: escrowPaymentAccount[0],
      authority: new PublicKey(isBuyingNow ? ask?.auction_house_authority : AUCTION_HOUSE_AUTHORITY),
      auctionHouse: new PublicKey(isBuyingNow ? ask?.auction_house_key : AUCTION_HOUSE),
      auctionHouseFeeAccount: new PublicKey(isBuyingNow ? ask?.auction_house_fee_account : AH_FEE_ACCT),
      buyerTradeState: buyerTradeState[0]
    }

    const buyIX: TransactionInstruction = await createBuyInstruction(buyInstructionAccounts, buyInstructionArgs)

    const transaction = new Transaction().add(buyIX)
    if (isBuyingNow) {
      const { freeTradeStateAgg, programAsSignerPDA } = await derivePDAForExecuteSale()

      const onChainNFTMetadata = await getNFTMetadata(metaDataAccount, connection)
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
        freeTradeStateBump: freeTradeStateAgg[1],
        programAsSignerBump: programAsSignerPDA[1],
        buyerPrice: buyerPrice,
        tokenSize: tokenSize
      }
      const executeSaleInstructionAccounts: ExecuteSaleInstructionAccounts = {
        buyer: wallet?.adapter?.publicKey,
        seller: new PublicKey(ask?.wallet_key),
        tokenAccount: new PublicKey(ask?.token_account_key),
        tokenMint: new PublicKey(ask?.token_account_mint_key),
        metadata: new PublicKey(metaDataAccount),
        treasuryMint: new PublicKey(isBuyingNow ? ask?.auction_house_treasury_mint_key : TREASURY_MINT),
        escrowPaymentAccount: escrowPaymentAccount[0],
        sellerPaymentReceiptAccount: new PublicKey(ask?.wallet_key),
        buyerReceiptTokenAccount: buyerReceiptTokenAccount[0],
        authority: new PublicKey(isBuyingNow ? ask?.auction_house_authority : AUCTION_HOUSE_AUTHORITY),
        auctionHouse: new PublicKey(isBuyingNow ? ask?.auction_house_key : AUCTION_HOUSE),
        auctionHouseFeeAccount: new PublicKey(isBuyingNow ? ask?.auction_house_fee_account : AH_FEE_ACCT),
        auctionHouseTreasury: auctionHouseTreasuryAddress[0],
        buyerTradeState: buyerTradeState[0],
        sellerTradeState: new PublicKey(ask?.seller_trade_state),
        freeTradeState: freeTradeStateAgg[0],
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
      const signature = await sendTransaction(transaction, connection)

      console.log(signature)
      setPendingTxSig(signature)
      const confirm = await confirmTransaction(connection, signature, 'finalized')
      console.log(confirm, 'confirming')
      setIsLoading(false)
      if (confirm.value.err === null) {
        if (isBuyingNow) {
          setMissionAccomplished(true)
          notify(
            successBidMatchedMessage(
              signature,
              nftMetadata,
              (parseFloat(buyerPrice) / LAMPORTS_PER_SOL_NUMBER).toString()
            )
          )
        } else {
          setBidNow(null)
          notify(successfulListingMessage(signature, nftMetadata, formatSOLDisplay(buyerPrice)))
        }
      }
    } catch (error) {
      setIsLoading(false)
      pleaseTryAgain(isBuyingNow, error?.message)
    }
  }

  if (missionAccomplished) return <MissionAccomplishedModal />
  else if (isLoading && isBuyingNow && pendingTxSig) return <HoldTight />
  else
    return (
      <div>
        <div tw="flex flex-col items-center justify-center">
          <div className="buyTitle">
            You are about to {isBuyingNow ? 'buy' : 'bid for'}: <br />
            <strong>{general?.nft_name} </strong> {checkMobile() && <br />}
            <strong>{general?.collection_name && `by ${general?.collection_name}`}</strong>
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

        <div className="vContainer">
          <img className="nftImg" src={general?.image_url} alt="" />
        </div>

        <div className="vContainer">
          <div className="priceText">Price</div>
        </div>

        <div className="vContainer">
          <div className={'priceValue'}>
            {curBid} <img tw="h-[25px] w-[25px]" src={`/img/crypto/SOL.svg`} />
          </div>
        </div>

        <div tw="mt-4">
          <AppraisalValue
            text={general?.gfx_appraisal_value ? `${general?.gfx_appraisal_value} SOL` : null}
            label={general?.gfx_appraisal_value ? 'Appraisal Value' : 'Appraisal Not Supported'}
            width={360}
          />
        </div>
        {pendingTxSig && (
          <div className="bm-title">
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

        <div className="hContainer" style={{ height: pendingTxSig ? 140 : 185 }}>
          <div className="rowContainer">
            <div className="leftAlign">My Bid</div>
            <div className="rightAlign">{curBid} SOL</div>
          </div>
          <div className="rowContainer">
            <div className="leftAlign">Service Fee</div>
            <div className="rightAlign"> {servicePriceCalc} SOL</div>
          </div>
          <div className="rowContainer">
            <div className="leftAlign">Total Price</div>
            <div className="rightAlign">{orderTotal} SOL</div>
          </div>
        </div>
        <div className="buyBtnContainer">
          <Button
            className="buyButton"
            disabled={notEnough || isLoading}
            onClick={callBuyInstruction}
            loading={isLoading}
          >
            {notEnough ? 'Insufficient SOL' : isBuyingNow ? 'Buy Now' : 'Place Bid'}
          </Button>
        </div>
      </div>
    )
}
