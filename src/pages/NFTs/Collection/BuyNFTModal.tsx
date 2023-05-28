import React, { ReactElement, useState, FC, useMemo, useEffect } from 'react'
import {
  useAccounts,
  useConnectionConfig,
  useNFTCollections,
  useNFTAggregator,
  useNFTDetails,
  useNFTProfile,
  useWalletModal
} from '../../../context'

import { checkMobile, formatSOLDisplay, notify } from '../../../utils'
import { AppraisalValueSmall, GenericTooltip } from '../../../utils/GenericDegsin'
import { PopupCustom } from '../Popup/PopupCustom'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import {
  PublicKey,
  TransactionInstruction,
  Transaction,
  SystemProgram,
  VersionedTransaction
} from '@solana/web3.js'
import { tradeStatePDA, tokenSize, freeSellerTradeStatePDAAgg } from '../actions'

import { LAMPORTS_PER_SOL_NUMBER, NFT_MARKET_TRANSACTION_FEE } from '../../../constants'
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
import { getNFTMetadata, minimizeTheString } from '../../../web3/nfts/utils'
import { BorderBottom } from './SellNFTModal'
import { TermsTextNFT } from './AcceptBidModal'
import { ITensorBuyIX } from '../../../types/nft_details'
import { getTensorBuyInstruction, NFT_MARKETS } from '../../../api/NFTs'
// const TEN_MILLION = 10000000

export const STYLED_POPUP_BUY_MODAL = styled(PopupCustom)<{ lockModal: boolean }>`
  ${tw`flex flex-col mt-[-30px] sm:mt-0  `}
  .ant-modal-content {
    height: 100%;
  }
  .borderBottom {
    background: ${({ theme }) => theme.tokenBorder};
  }
  .ant-modal-close-x {
    visibility: ${({ lockModal }) => (lockModal ? 'hidden' : 'visible')};
    img {
      ${tw`w-5 h-5 mt-[-5px] sm:h-[15px] sm:w-[15px] ml-2 opacity-70`}
    }
  }
  &.ant-modal {
    ${tw`max-w-full sm:bottom-[-8px] sm:mt-auto sm:absolute sm:h-[600px]`}
    background-color: ${({ theme }) => theme.bg26};
    border-radius: 20px;

    @media (max-width: 500px) {
      border-radius: 20px 20px 0 0;
    }
  }
  color: ${({ theme }) => theme.text20};
  .delistText {
    ${tw`text-[20px] sm:mt-1 sm:text-[15px] sm:pt-4 font-medium text-center `}
    color: ${({ theme }) => theme.text20};
    strong {
      ${tw`sm:text-[15px] font-bold sm:mt-[-10px] leading-3`}
      color: ${({ theme }) => theme.text32};
    }
  }
  .buyTitle {
    ${tw`text-[24px] sm:ml-[140px] sm:mt-1 sm:text-[15px] sm:pt-2 font-medium text-center sm:text-left `}
    color: ${({ theme }) => theme.text20};

    strong {
      ${tw`sm:text-[16px] font-bold sm:mt-[-10px] leading-3`}
      color: ${({ theme }) => theme.text32};
    }
  }
  .cancelText {
    ${tw`text-[20px] sm:text-[16px] font-semibold mt-4 text-center cursor-pointer 
    absolute`};
    color: ${({ theme }) => theme.text20};
  }
  .verifiedText {
    ${tw`font-semibold text-[16px]   sm:text-[15px] mt-2 mb-1
        sm:text-left sm:ml-[140px] sm:mt-[5px] h-4`}
    color: ${({ theme }) => theme.text38};
  }
  .hContainer {
    ${tw`flex flex-col items-center justify-center`}
  }
  .vContainer {
    ${tw`flex items-center justify-center relative mt-2`}
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
    ${tw`w-[160px] h-[56px] sm:h-[50px] rounded-[50px] items-center cursor-pointer
    justify-center flex  text-[18px] font-semibold`}
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
    ${tw`flex items-center justify-between w-[100%]`}
  }
  .leftAlign {
    ${tw`text-[18px] font-semibold mt-1 sm:text-[15px]`}
    color: ${({ theme }) => theme.text37} !important;
  }
  .rightAlign {
    color: ${({ theme }) => theme.text32} !important;
    ${tw`text-[18px] text-white font-semibold sm:text-[15px]`}
  }
  .rightAlignFinal {
    color: ${({ theme }) => theme.text7} !important;
    ${tw`text-[18px] text-white font-bold`}
  }

  .nftImg {
    ${tw`w-[165px] h-[165px] sm:mt-[150px] mt-[25px] rounded-[5px] sm:h-[125px] sm:w-[125px] sm:left-0 sm:absolute`}
  }
  .currentBid {
    color: ${({ theme }) => theme.text22};
    ${tw`text-[20px] font-semibold ml-4 sm:mt-[6px]  `};
  }
  .maxBid {
    ${tw`text-[20px] sm:text-[20px] font-semibold leading-[30px] sm:mt-[20px]	`}
    color: ${({ theme }) => theme.text20}
  }
  .enterBid {
    ${tw`h-[55px] px-[24px] w-[360px] bg-none sm:w-[calc(100vw - 48px)]
    border-transparent rounded-circle text-[24px] font-semibold sm:mt-0 sm:h-[50px]`}
    background: ${({ theme }) => theme.bg2};
    color: ${({ theme }) => theme.text32};
    &:focus {
      border: 1px solid ${({ theme }) => theme.text11};
    }
    &:focus-visible {
      outline: 1px solid ${({ theme }) => theme.text11};
    }
  }

  .nftImgBid {
    ${tw`w-[140px] h-[140px] flex items-center overflow-hidden rounded-[15px] sm:mt-[0px] rounded-[10px]
     left-0 sm:h-[125px] sm:w-[125px] sm:left-0 `}

    img {
      height: auto;
      width: 100%;
    }
  }

  .priceText {
    ${tw`text-[25px] font-semibold`}
    color: ${({ theme }) => theme.text12};
  }
  .priceValue {
    ${tw`text-[25px] font-semibold leading-none`}
    color: ${({ theme }) => theme.text7};
  }
  .sellButton {
    ${tw`w-[520px] sm:ml-0 ml-1.5 sm:h-[50px] sm:w-[calc(100vw - 48px)] sm:text-[15px]
    sm:bottom-[0px] cursor-pointer text-[#EEEEEE] rounded-[50px] sm:h-[45px]
     border-none  h-[56px] text-white text-[18px] font-semibold flex items-center bg-red-2 justify-center`}
    :disabled {
      ${tw`text-[#636363] cursor-not-allowed`}
      background: ${({ theme }) => theme.bg22} !important;
    }
  }
  .blueBg {
    ${tw`!bg-blue-1`}
  }
  .semiSellButton {
    ${tw`w-[250px] mr-4 sm:h-[50px]  sm:mr-3 sm:w-[42vw]  sm:text-[15px]   cursor-pointer text-[#EEEEEE]
     rounded-[50px] border-none sm:max-w[180px]
     h-[56px] text-white text-[20px] font-semibold flex items-center bg-red-2 justify-center`}
    :disabled {
      ${tw`text-[#636363] cursor-not-allowed`}
      background: ${({ theme }) => theme.bg22} !important;
    }
  }
  .semiBuyButton {
    ${tw`w-[250px] mr-4 sm:h-[50px] sm:text-[15px]  cursor-pointer text-[#EEEEEE] 
    rounded-[50px] border-none
     h-[60px] text-white text-[20px] font-semibold flex items-center   justify-center`}
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);

    :disabled {
      ${tw`text-[#636363] cursor-not-allowed`}
      background: ${({ theme }) => theme.bg22} !important;
    }
  }
  .termsText {
    ${tw`text-[13px] sm:text-[12px] font-medium`}
    color: ${({ theme }) => theme.text37};
    white-space: nowrap !important;

    strong,
    a {
      ${tw`font-semibold underline cursor-pointer`}
      color: ${({ theme }) => theme.text38};
    }
  }

  .buyButton {
    ${tw`w-[520px] sm:w-[calc(100vw - 56px)] sm:h-[50px] sm:text-[15px]  cursor-pointer rounded-[50px] border-none
     h-[56px] text-white text-[18px] sm:text-[16px] !font-semibold flex items-center justify-center ml-1.5 sm:ml-1`}
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    &:disabled {
      ${tw`text-[#636363] cursor-not-allowed`}
      background: ${({ theme }) => theme.bg22};
    }
  }
  .priceNumber {
    ${tw`text-[40px] font-semibold flex items-center mt-[-12px] justify-center `}
    color: ${({ theme }) => theme.text7};
    img {
      ${tw`h-[25px] w-[25px] ml-3`}
    }
  }
  .drawLine {
    background: ${({ theme }) => theme.tokenBorder};
    ${tw`h-[2px] w-[100vw] `}
  }
  .sellInputContainer {
    position: absolute;
    margin-left: calc(110px - 24px);
    ${tw`sm:ml-0 sm:mt-2.5`}
    margin-top: 10px;
    input:focus {
      border: 1px solid ${({ theme }) => theme.text32};
    }
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
  .feesContainer {
    ${tw`flex items-center flex-col w-[calc(100% - 60px)] sm:w-[calc(100% - 48px )]
    sm:ml-0 ml-1.5 justify-between sm:mt-[10px] absolute bottom-[120px] sm:bottom-[130px]  `}
  }
  .buyBtnContainer {
    ${tw`flex items-center justify-between sm:mt-[20px] absolute bottom-[50px] sm:bottom-4  `}
  }

  .bm-title {
    padding-top: 12px;
    font-size: 20px;
    font-weight: 500;
    text-align: center;
  }
`

export const BuyNFTModal = (): ReactElement => {
  const { sessionUser } = useNFTProfile()
  const { buyNowClicked, setBuyNow, openJustModal, setOpenJustModal } = useNFTAggregator()
  const { ask, setGeneral } = useNFTDetails()
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { setVisible } = useWalletModal()
  const sellerPrice: number = parseFloat(ask?.buyer_price) / LAMPORTS_PER_SOL_NUMBER

  const handleCloseModal = (setGeneral, setModal, isLoading) => {
    if (!isLoading) {
      setBuyNow(false)
      setModal(false)
    }
    openJustModal && setGeneral(null)
    setOpenJustModal(false)
  }

  useEffect(() => {
    if (sessionUser === null && buyNowClicked) {
      setVisible(true)
      setBuyNow(false)
    }
    return () => {
      handleCloseModal(setGeneral, setBuyNow, false)
    }
  }, [sessionUser, buyNowClicked])

  return (
    <STYLED_POPUP_BUY_MODAL
      lockModal={isLoading}
      height={checkMobile() ? '603px' : '780px'}
      width={checkMobile() ? '100%' : '580px'}
      title={null}
      centered={checkMobile() ? false : true}
      visible={buyNowClicked ? true : false}
      onCancel={() => handleCloseModal(setGeneral, setBuyNow, isLoading)}
      footer={null}
    >
      <FinalPlaceBid curBid={sellerPrice} isLoading={isLoading} setIsLoading={setIsLoading} />
    </STYLED_POPUP_BUY_MODAL>
  )
}

const FinalPlaceBid: FC<{ curBid: number; isLoading: boolean; setIsLoading: any }> = ({
  curBid,
  isLoading,
  setIsLoading
}): ReactElement => {
  const { setBidNow } = useNFTAggregator()
  const { singleCollection } = useNFTCollections()
  const { getUIAmount } = useAccounts()
  const { sessionUser, fetchSessionUser } = useNFTProfile()
  const { wallet, sendTransaction } = useWallet()
  const { connection } = useConnectionConfig()
  const { general, nftMetadata, ask, onChainMetadata } = useNFTDetails()
  const [missionAccomplished, setMissionAccomplished] = useState<boolean>(false)
  const [pendingTxSig, setPendingTxSig] = useState<string | null>(null)

  const publicKey: PublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet])
  const isBuyingNow: boolean = useMemo(
    () =>
      parseFloat(ask?.buyer_price) / LAMPORTS_PER_SOL_NUMBER === curBid ||
      ask.marketplace_name === NFT_MARKETS.TENSOR,
    [curBid]
  )

  const servicePriceCalc: number = useMemo(
    () => (curBid ? parseFloat(((NFT_MARKET_TRANSACTION_FEE / 100) * curBid).toFixed(3)) : 0),
    [curBid]
  )
  const royalty = useMemo(
    () => (onChainMetadata ? onChainMetadata.data.sellerFeeBasisPoints / 100 : 0),
    [onChainMetadata]
  )

  const orderTotal: number = useMemo(() => curBid + servicePriceCalc + (curBid * royalty) / 100, [curBid])

  const notEnoughSol: boolean = useMemo(
    () => (orderTotal >= getUIAmount(WRAPPED_SOL_MINT.toBase58()) ? true : false),
    [curBid]
  )

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

  const handleNotifications = async (tx: Transaction | VersionedTransaction, buyerPrice: string, isBuyingNow) => {
    try {
      const signature = await sendTransaction(tx, connection)

      console.log(signature)
      setPendingTxSig(signature)
      const confirm = await confirmTransaction(connection, signature, 'confirmed')
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
      console.log(error)
      pleaseTryAgain(isBuyingNow, error?.message)
    }
  }
  const callTensorAPIs = async (): Promise<void> => {
    try {
      const res: ITensorBuyIX = await getTensorBuyInstruction(
        parseFloat(ask.buyer_price),
        publicKey.toBase58(),
        ask.wallet_key,
        ask.token_account_mint_key,
        process.env.REACT_APP_JWT_SECRET_KEY
      )

      const tx = res.data.legacy_tx
        ? Transaction.from(Buffer.from(res.data.bytes))
        : VersionedTransaction.deserialize(Buffer.from(res.data.bytes))

      await handleNotifications(tx, ask.buyer_price, true)
    } catch (err) {
      console.log(err)
      setIsLoading(false)
      // notify()
    }
  }

  const handleBuyFlow = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    if (ask.marketplace_name === NFT_MARKETS.TENSOR) {
      callTensorAPIs()
      return
    } else callBuyInstruction()
  }
  const callBuyInstruction = async (): Promise<void> => {
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
    await handleNotifications(transaction, buyerPrice, isBuyingNow)
  }

  if (missionAccomplished) return <MissionAccomplishedModal />
  else if (isLoading && isBuyingNow && pendingTxSig) return <HoldTight />
  else
    return (
      <div>
        <div>
          {checkMobile() && <img className="nftImgBid" src={general.image_url} alt="" />}

          <div tw="flex flex-col sm:mt-[-135px] sm:items-start items-center">
            <div className="buyTitle">
              You are about to {isBuyingNow ? 'buy' : 'bid for'}: <br />
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

        <div className="vContainer">
          {!checkMobile() && <img className="nftImg" src={general?.image_url} alt="" />}
        </div>

        <div className="vContainer" tw="flex items-center !mt-2 sm:!mt-8 justify-center">
          <div className="priceText">Price:</div>

          <div className={'priceValue'} tw="flex items-center text-[25px] ml-2">
            <div>{curBid}</div> <img tw="h-[25px] w-[25px] ml-2" src={`/img/crypto/SOL.svg`} />
          </div>
        </div>

        <div tw="mt-4">
          <AppraisalValueSmall text={appraisalValueText} label={appraisalValueLabel} width={246} />
        </div>
        {pendingTxSig && <PendingTransaction pendingTxSig={pendingTxSig} />}

        <div className="feesContainer">
          <div className="rowContainer">
            <div className="leftAlign">Price per item</div>
            <div className="rightAlign">{curBid} SOL</div>
          </div>
          {/* {!checkMobile() && (
            <div className="rowContainer">
              <div className="leftAlign">Quantity</div>
              <div className="rightAlign">1 NFT</div>
            </div>
          )} */}
          <div className="rowContainer">
            <div className="leftAlign">Royalty {royalty}%</div>
            <div className="rightAlign"> {((royalty * curBid) / 100).toFixed(2)} SOL</div>
          </div>
          <div className="rowContainer">
            <div className="leftAlign">Service Fee</div>
            <div className="rightAlign"> {servicePriceCalc} SOL</div>
          </div>
          <div className="rowContainer">
            <div className="leftAlign">Total Price</div>
            <div className="rightAlignFinal">{formatSOLDisplay(orderTotal)} SOL</div>
          </div>
        </div>
        <BorderBottom />
        <div className="buyBtnContainer">
          <Button
            className="buyButton"
            disabled={notEnoughSol || isLoading}
            onClick={handleBuyFlow}
            loading={isLoading}
          >
            {notEnoughSol ? 'Insufficient SOL' : isBuyingNow ? 'Buy Now' : 'Place Bid'}
          </Button>
        </div>
        <div tw="absolute left-[calc(50% - 180px)] w-auto sm:left-[calc(50% - 165px)] bottom-0 sm:bottom-[75px]">
          <TermsTextNFT string="Buy Now" />
        </div>
      </div>
    )
}

export const PendingTransaction: FC<{ pendingTxSig: string }> = ({ pendingTxSig }): ReactElement => (
  <div className="bm-title">
    <span>
      <img style={{ height: '26px', marginRight: '6px' }} src={`/img/assets/solscan.png`} alt="solscan-icon" />
    </span>
    <GFX_LINK href={`https://solscan.io/tx/${pendingTxSig}`} target={'_blank'} rel="noreferrer">
      View Transaction
    </GFX_LINK>
  </div>
)
