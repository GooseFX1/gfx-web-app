import React, { ReactElement, useState, FC, useMemo, useEffect, useCallback } from 'react'

import {
  useAccounts,
  useConnectionConfig,
  useNFTCollections,
  useNFTAggregator,
  useNFTDetails,
  useNFTProfile,
  useWalletModal
} from '../../../context'

import { checkMobile, formatSOLDisplay, formatSOLNumber, notify } from '../../../utils'
import { AppraisalValueSmall, GenericTooltip } from '../../../utils/GenericDegsin'
import { PopupCustom } from '../Popup/PopupCustom'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { Keypair, PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js'

import { LAMPORTS_PER_SOL_NUMBER, NFT_MARKET_PLACE_FEES, NFT_MARKET_TRANSACTION_FEE } from '../../../constants'
import { useWallet } from '@solana/wallet-adapter-react'
import { WRAPPED_SOL_MINT, confirmTransaction, AH_NAME, handleRedirect, getMetadata } from '../../../web3'
import { Button } from '../../../components'
import { GFX_LINK } from '../../../styles'
import { logData } from '../../../api/analytics'
import { HoldTight } from './AggModals/HoldTight'
import MissionAccomplishedModal from './AggModals/MissionAcomplishedModal'
import {
  couldNotFetchUserData,
  pleaseTryAgain,
  successBidMatchedMessage,
  successfulListingMessage
} from './AggModals/AggNotifications'
import { getNFTMetadata, handleMarketplaceFormat, minimizeTheString } from '../../../web3/nfts/utils'
import { TermsTextNFT } from './AcceptBidModal'
import {
  getMagicEdenBuyInstruction,
  getMagicEdenListing,
  getTensorBuyInstruction,
  NFT_MARKETS,
  saveNftTx
} from '../../../api/NFTs'
import { callExecuteSaleInstruction } from '../../../web3/auction-house-sdk/executeSale'
import { getMagicEdenTokenAccount } from '../../../web3/auction-house-sdk/pda'
import bs58 from 'bs58'

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
    background-color: ${({ theme }) => theme.bg20};
    border-radius: 20px;

    @media (max-width: 500px) {
      border-radius: 20px 20px 0 0;
    }
  }
  color: ${({ theme }) => theme.text20};
  .delistText {
    ${tw`text-[20px] sm:mt-1 sm:text-[15px] sm:pt-0 font-medium text-center `}
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
    ${tw`font-semibold text-[16px] sm:text-[15px] mt-1 mb-1
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
    ${tw`flex items-center w-[165px] min-h-[164px] max-h-[184px] overflow-hidden mt-[25px] rounded-[5px] 
      sm:mt-[150px] sm:h-[125px] sm:w-[125px] sm:left-0 sm:absolute`}
    img {
      height: auto;
      width: 100%;
    }
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
      height={checkMobile() ? '524px' : '715px'}
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
  const { setBidNow, setOperatingNFT, appraisalIsEnabled } = useNFTAggregator()
  const { singleCollection } = useNFTCollections()
  const { getUIAmount } = useAccounts()
  const { sessionUser, fetchSessionUser } = useNFTProfile()
  const wal = useWallet()
  const { wallet, sendTransaction } = wal
  const { connection } = useConnectionConfig()
  const { general, nftMetadata, ask, onChainMetadata } = useNFTDetails()
  const [missionAccomplished, setMissionAccomplished] = useState<boolean>(false)
  const [pendingTxSig, setPendingTxSig] = useState<string | null>(null)
  const [onChainNFTMetadata, setOnChainNFTMetadata] = useState<any>()

  useEffect(() => {
    ;(async () => {
      const metadata = await getNFTMetadata(await getMetadata(general.mint_address), connection)
      setOnChainNFTMetadata(metadata)
    })()
  }, [])

  const publicKey: PublicKey = useMemo(
    () => wallet?.adapter?.publicKey,
    [wallet?.adapter, wallet?.adapter?.publicKey]
  )
  const isBuyingNow: boolean = useMemo(() => formatSOLNumber(ask?.buyer_price) === curBid, [curBid])
  const marketplaceName = useMemo(
    () =>
      ask?.marketplace_name ? handleMarketplaceFormat(ask?.marketplace_name) : AH_NAME(ask?.auction_house_key),
    [ask]
  )

  const serviceFee = useMemo(
    () => (ask?.marketplace_name ? NFT_MARKET_PLACE_FEES[ask?.marketplace_name] : NFT_MARKET_TRANSACTION_FEE),
    [ask]
  )
  const servicePriceCalc: number = useMemo(
    () => (curBid ? parseFloat((((serviceFee ? serviceFee : 1) / 100) * curBid).toFixed(3)) : 0),
    [curBid, ask]
  )
  const royalty = useMemo(
    () => (onChainMetadata ? onChainMetadata.data.sellerFeeBasisPoints / 100 : 0),
    [onChainMetadata]
  )

  const isPnft = useMemo(() => onChainNFTMetadata?.tokenStandard === 4, [onChainNFTMetadata])

  const orderTotal: number = useMemo(() => curBid, [curBid])

  const notEnoughSol: boolean = useMemo(
    () => (orderTotal >= getUIAmount(WRAPPED_SOL_MINT.toBase58()) ? true : false),
    [curBid]
  )

  const appraisalValueAsFloat = appraisalIsEnabled
    ? useMemo(
        () => (general?.gfx_appraisal_value ? parseFloat(general?.gfx_appraisal_value) : null),
        [general?.gfx_appraisal_value]
      )
    : null

  const appraisalValueText = appraisalIsEnabled
    ? useMemo(
        () => (appraisalValueAsFloat && appraisalValueAsFloat > 0 ? `${general?.gfx_appraisal_value}` : null),
        [appraisalValueAsFloat, general?.gfx_appraisal_value]
      )
    : null

  const appraisalValueLabel = appraisalIsEnabled
    ? useMemo(
        () => (appraisalValueAsFloat && appraisalValueAsFloat > 0 ? 'Appraisal Value' : 'Appraisal Not Supported'),
        [appraisalValueAsFloat]
      )
    : null

  const sendNftTransactionLog = useCallback(
    (txType, signature) => {
      saveNftTx(
        marketplaceName,
        parseFloat(ask?.buyer_price) / LAMPORTS_PER_SOL_NUMBER,
        general?.mint_address,
        general?.collection_name,
        txType,
        signature,
        general?.uuid,
        publicKey.toString()
      )
    },
    [marketplaceName, general, ask]
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

  const handleNotifications = async (
    tx: Transaction | VersionedTransaction,
    buyerPrice: string,
    isBuyingNow: boolean,
    marketPlace: string
  ) => {
    try {
      // setting this as operating nft , for loading buttons
      if (isBuyingNow) setOperatingNFT((prevSet) => new Set([...Array.from(prevSet), general?.mint_address]))
      let signature
      if (isBuyingNow) {
        const authority = process.env.REACT_APP_AUCTION_HOUSE_PRIVATE_KEY
        console.log(authority, 'authority', typeof authority)

        const treasuryWallet = Keypair.fromSecretKey(bs58.decode(authority))
        if (isPnft || marketPlace === NFT_MARKETS.GOOSE) {
          signature = await sendTransaction(tx, connection, {
            signers: [treasuryWallet],
            skipPreflight: true
          })
        } else {
          signature = await sendTransaction(tx, connection)
        }
        setPendingTxSig(signature)
      }
      const confirm = await confirmTransaction(connection, signature, 'confirmed')
      if (confirm.value.err === null) {
        sendNftTransactionLog(isBuyingNow ? 'BUY' : 'BID', signature)
        setIsLoading(false)

        if (isBuyingNow) {
          setMissionAccomplished(true)
          notify(successBidMatchedMessage(signature, nftMetadata, formatSOLDisplay(buyerPrice)))
        } else {
          setBidNow(false)
          notify(successfulListingMessage(signature, nftMetadata, formatSOLDisplay(buyerPrice)))
        }
      }
    } catch (error) {
      // deleting this from list of operating nft, for loading buttons
      setOperatingNFT((prevSet) => {
        const newSet = new Set(prevSet)
        newSet.delete(general?.mint_address)
        return newSet
      })
      setIsLoading(false)
      console.log(error)
      pleaseTryAgain(isBuyingNow, error?.message)
    }
  }

  const callMagicEdenAPIs = async (): Promise<void> => {
    const tokenAccount = await getMagicEdenTokenAccount({ ...ask, ...general })
    try {
      const listing_res = await getMagicEdenListing(general?.mint_address, process.env.REACT_APP_JWT_SECRET_KEY)
      const res = await getMagicEdenBuyInstruction(
        parseFloat(ask.buyer_price) / LAMPORTS_PER_SOL_NUMBER,
        publicKey.toBase58(),
        ask.wallet_key,
        ask.token_account_mint_key,
        listing_res.data?.[0].tokenAddress ? listing_res.data?.[0].tokenAddress : tokenAccount[0].toString(),
        process.env.REACT_APP_JWT_SECRET_KEY,
        listing_res.data?.[0].expiry ? listing_res?.data[0].expiry.toString() : '-1'
      )

      const tx = VersionedTransaction.deserialize(Buffer.from(res.data.v0.txSigned.data))
      await handleNotifications(tx, ask.buyer_price, true, ask?.marketplace_name)
    } catch (err) {
      console.log(err)
      setIsLoading(false)
    }
  }

  const callTensorAPIs = async (): Promise<void> => {
    try {
      const res: any = await getTensorBuyInstruction(
        parseFloat(ask.buyer_price),
        publicKey.toBase58(),
        ask.wallet_key,
        ask.token_account_mint_key,
        process.env.REACT_APP_JWT_SECRET_KEY
      )
      const tx = res.data?.txV0
        ? VersionedTransaction.deserialize(Buffer.from(res.data.tx.data))
        : Transaction.from(Buffer.from(res.data.txV0.data))

      await handleNotifications(tx, ask.buyer_price, true, ask?.marketplace_name)
    } catch (err) {
      console.log(err)
      setIsLoading(false)
    }
  }

  const handleBuyFlow = async (e: any) => {
    e.preventDefault()
    if (ask?.marketplace_name === NFT_MARKETS.HYPERSPACE) {
      handleRedirect(ask?.marketplace_name, ask?.token_account_mint_key)
      return
    }
    setIsLoading(true)
    logData(`attempt_buy_now_${ask?.marketplace_name?.toLowerCase()}`)
    if (ask?.marketplace_name === NFT_MARKETS.TENSOR) {
      callTensorAPIs()
      return
    }
    if (ask?.marketplace_name === NFT_MARKETS.MAGIC_EDEN) {
      callMagicEdenAPIs()
      return
    } else handleOtherBuyOptions()
  }
  const handleOtherBuyOptions = async () => {
    try {
      const tx = await callExecuteSaleInstruction(ask, general, publicKey, isBuyingNow, connection, wal, isPnft)
      await handleNotifications(tx, formatSOLDisplay(ask.buyer_price), isBuyingNow, ask?.marketplace_name)
    } catch (err) {
      setIsLoading(false)
      pleaseTryAgain(isBuyingNow, 'Failed to load data needed')
    }
  }

  if (missionAccomplished) return <MissionAccomplishedModal price={ask?.buyer_price} />
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
                <div tw="flex items-center ">
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
          {!checkMobile() && (
            <div className="nftImg">
              <img src={general.image_url} alt="nft-image" />
            </div>
          )}
        </div>

        <div className="vContainer" tw="flex items-center !mt-2 sm:!mt-[70px] justify-center">
          <div className="priceText">Price:</div>

          <div className={'priceValue'} tw="flex items-center text-[25px] ml-2">
            <div>{curBid}</div> <img tw="h-[25px] w-[25px] ml-2" src={`/img/crypto/SOL.svg`} />
          </div>
        </div>

        {appraisalIsEnabled && (
          <div tw="mt-4">
            <AppraisalValueSmall text={appraisalValueText} label={appraisalValueLabel} width={246} />
          </div>
        )}

        <div tw="ml-[180px] sm:ml-[calc(50% - 85px)]">
          {pendingTxSig && <PendingTransaction pendingTxSig={pendingTxSig} />}
        </div>

        <div className="feesContainer">
          <div className="rowContainer">
            <div className="leftAlign">Price per item</div>
            <div className="rightAlign">{curBid} SOL</div>
          </div>

          <div className="rowContainer">
            <div className="leftAlign">Royalty ({royalty}%)</div>
            <div className="rightAlign"> {((royalty * curBid) / 100).toFixed(curBid > 9 ? 2 : 3)} SOL</div>
          </div>
          <div className="rowContainer">
            <div className="leftAlign">Taker Fee ({serviceFee}%)</div>
            <div className="rightAlign"> {formatSOLDisplay(servicePriceCalc, true, 3)} SOL</div>
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
            onClick={(e) => handleBuyFlow(e)}
            loading={isLoading}
          >
            {notEnoughSol ? 'Insufficient SOL' : isBuyingNow ? 'Buy Now' : 'Place Bid'}
          </Button>
        </div>
        <div tw="absolute left-[calc(50% - 180px)] w-auto sm:left-[calc(50% - 165px)] bottom-0 sm:bottom-[-25px]">
          <TermsTextNFT string="Buy Now" />
        </div>
      </div>
    )
}

export const PendingTransaction: FC<{ pendingTxSig: string }> = ({ pendingTxSig }): ReactElement => (
  <div className="bm-title" tw="flex items-center">
    <div>
      <img style={{ height: '26px', marginRight: '6px' }} src={`/img/assets/solscan.png`} alt="solscan-icon" />
    </div>
    <GFX_LINK href={`https://solscan.io/tx/${pendingTxSig}`} target={'_blank'} rel="noreferrer">
      View Transaction
    </GFX_LINK>
  </div>
)

const BorderBottom = () =>
  checkMobile() && <div tw="h-[1px] w-[100%] absolute left-0 dark:bg-black-4 bg-grey-4 bottom-20"></div>
