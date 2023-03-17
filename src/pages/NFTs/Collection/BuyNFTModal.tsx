/* eslint-disable @typescript-eslint/no-unused-vars */
import { Col, Modal, Row } from 'antd'
import React, { ReactElement, useState, FC, useMemo, useEffect } from 'react'
import {
  useAccounts,
  useConnectionConfig,
  useNFTAggregator,
  useNFTDetails,
  useNFTProfile,
  usePriceFeedFarm
} from '../../../context'
import { MainButton, SuccessfulListingMsg } from '../../../components'

import { checkMobile, notify, truncateAddress } from '../../../utils'
import { AppraisalValue } from '../../../utils/GenericDegsin'
import { PopupCustom } from '../Popup/PopupCustom'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { PublicKey, TransactionInstruction, Transaction } from '@solana/web3.js'
import { tradeStatePDA, getBuyInstructionAccounts, tokenSize } from '../actions'

import { LAMPORTS_PER_SOL, LAMPORTS_PER_SOL_NUMBER, NFT_MARKET_TRANSACTION_FEE } from '../../../constants'
import { useHistory } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import { MESSAGE } from '../NFTDetails/BidModal'
import BN from 'bn.js'
import {
  AUCTION_HOUSE,
  AUCTION_HOUSE_PREFIX,
  AUCTION_HOUSE_AUTHORITY,
  AH_FEE_ACCT,
  AUCTION_HOUSE_PROGRAM_ID,
  TREASURY_MINT,
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
  bnTo8
} from '../../../web3'
import { Button } from '../../../components/Button'
const TEN_MILLION = 10000000
const STYLED_POPUP = styled(PopupCustom)`
  ${tw`flex flex-col `}
  .ant-modal-close-x {
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
    ${tw`text-[25px] sm:ml-[140px] sm:mt-1 sm:text-[15px] sm:pt-2 font-medium text-center sm:text-left `}
    color: ${({ theme }) => theme.text20};
    strong {
      ${tw`sm:text-[20px] font-semibold sm:mt-[-10px] leading-6`}
      color: ${({ theme }) => theme.text28};
    }
  }
  .verifiedText {
    ${tw`font-semibold text-[16px] text-[#fff] sm:text-[15px] mt-4
        sm:text-left sm:ml-[140px] sm:mt-[5px]`}
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
    justify-center flex mr-4 text-[20px] font-semibold`}
    background: ${({ theme }) => theme.bg22};
  }
  .bidButtonSelected {
    ${tw`w-[160px] h-[60px] sm:h-[50px] rounded-[50px] items-center cursor-pointer bg-[#5858ff] text-[#fff]
    justify-center flex mr-4 text-[20px] font-semibold`}
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
    ${tw`w-[165px] h-[165px] sm:mt-[150px] mt-[25px] sm:h-[125px] sm:w-[125px] sm:left-0 sm:absolute`}
  }
  .currentBid {
    ${tw`text-[25px] font-semibold ml-4 sm:mt-[10px] text-[#636363] `}
  }
  .maxBid {
    ${tw`text-[25px] sm:text-[20px] font-semibold leading-7 sm:mt-[20px]	`}
    color: ${({ theme }) => theme.text20}
  }
  .enterBid {
    ${tw`h-12 mt-4  w-[220px] bg-none sm:h-[48px]
    sm:mt-0 border-none text-center rounded-[25px] text-[40px]  font-semibold`}
    background: ${({ theme }) => theme.bg26};
    color: ${({ theme }) => theme.text30};
  }
  .nftImgBid {
    ${tw`w-[165px] h-[165px] sm:mt-[150px] rounded-[10px]
     left-0 mt-[25px] sm:mt-2 sm:h-[125px] sm:w-[125px] sm:left-0 `}
  }

  .priceText {
    ${tw`text-[25px] font-semibold mt-[15px]`}
    color: ${({ theme }) => theme.text12};
  }

  .buyButton {
    ${tw`w-[520px] sm:h-[50px] sm:text-[15px]  cursor-pointer rounded-[50px] border-none
     h-[60px] text-white text-[20px] font-semibold flex items-center justify-center`}
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    :disabled {
      cursor: not-allowed;
      ${tw`text-[#636363]`}
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
  .buyBtnContainer {
    ${tw`flex items-center justify-center mt-0 sm:mt-[20px] `}
  }
`

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const BuyNFTModal = (): ReactElement => {
  const { selectedNFT, setSelectedNFT, buyNowClicked, setBuyNow } = useNFTAggregator()
  const { ask } = useNFTDetails()
  const buyerPrice = parseFloat(ask?.buyer_price) / LAMPORTS_PER_SOL_NUMBER
  const servicePrice = 0.01

  return (
    <STYLED_POPUP
      height={checkMobile() ? '655px' : '780px'}
      width={checkMobile() ? '100%' : '580px'}
      title={null}
      visible={buyNowClicked ? true : false}
      onCancel={() => setBuyNow(undefined)}
      footer={null}
    >
      <FinalPlaceBid bidValue={buyerPrice} />
    </STYLED_POPUP>
  )
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const BidNFTModal = (): ReactElement => {
  const { selectedNFT, setSelectedNFT, bidNowClicked, setBidNow } = useNFTAggregator()
  const [selectedBtn, setSelectedBtn] = useState<number | undefined>(undefined)
  const [reviewBtnClicked, setReviewClicked] = useState<boolean>(false)
  const { ask } = useNFTDetails()
  const purchasePrice = parseFloat(ask?.buyer_price ? ask?.buyer_price : '0') / LAMPORTS_PER_SOL_NUMBER

  const [bidValue, setBidValue] = useState<number | undefined>(purchasePrice ? purchasePrice : 0)

  // first review then place the bid

  const updateBidValue = (e) => {
    console.log(e.target.value, parseFloat(e.target.value) < TEN_MILLION)
    if (parseFloat(e.target.value) < TEN_MILLION) setBidValue(e.target.value)
    handleBtnClicked(e.target.value, -1)
  }
  const handleBtnClicked = (value: number, index: number) => {
    setBidValue(value)
    setSelectedBtn(index)
  }
  return (
    <STYLED_POPUP
      height={checkMobile() ? '600px' : '780px'}
      width={checkMobile() ? '100%' : '580px'}
      title={null}
      visible={bidNowClicked ? true : false}
      onCancel={() => setBidNow(false)}
      footer={null}
    >
      {reviewBtnClicked ? (
        <FinalPlaceBid bidValue={bidValue} />
      ) : (
        <ReviewBid
          bidValue={bidValue}
          selectedBtn={selectedBtn}
          updateBidValue={updateBidValue}
          handleBtnClicked={handleBtnClicked}
          setReviewClicked={setReviewClicked}
        />
      )}
    </STYLED_POPUP>
  )
}

const ReviewBid: FC<{
  bidValue: number
  updateBidValue: any
  handleBtnClicked: any
  selectedBtn: number
  setReviewClicked: any
}> = ({ bidValue, updateBidValue, handleBtnClicked, selectedBtn, setReviewClicked }) => {
  const { bidNowClicked } = useNFTAggregator()
  const { ask } = useNFTDetails()
  const buyerPrice = parseFloat(ask?.buyer_price ? ask?.buyer_price : '0') / LAMPORTS_PER_SOL_NUMBER

  return (
    <div>
      {checkMobile() && <img className="nftImgBid" src={bidNowClicked.image_url} alt="" />}
      <div tw="flex flex-col sm:mt-[-135px] sm:items-start items-center">
        <div className="buyTitle">
          You are about to Bid <br />
          <strong>{bidNowClicked.nft_name} </strong> {checkMobile() ? <br /> : ''}
          <strong> {bidNowClicked?.collection_name}</strong>
        </div>
        <div className="verifiedText">
          {!checkMobile() && <img className="verifiedImg" src={`/img/assets/Aggregator/verifiedNFT.svg`} alt="" />}
          This is a verified {checkMobile() && <br />} Creator
          {checkMobile() && <img className="verifiedImg" src={`/img/assets/Aggregator/verifiedNFT.svg`} alt="" />}
        </div>
      </div>
      <div className="vContainer" tw="flex">
        {!checkMobile() && <img className="nftImgBid" src={bidNowClicked.image_url} alt="" />}
        <div tw="flex flex-col">
          <div className="currentBid">Current Bid</div>
          <div className="priceNumber" tw="ml-4 mt-2 flex items-center">
            {bidValue ? bidValue : 0} <img src={`/img/crypto/SOL.svg`} />
          </div>
        </div>
      </div>

      <div tw="mt-[30px]">
        <AppraisalValue width={360} />
      </div>
      <div className="vContainer">
        <div className="maxBid" tw="mt-4 sm:mt-[20px]">
          Enter Maxium Bid
        </div>
      </div>
      <div className="vContainer">
        <input
          className="enterBid"
          placeholder="0.0"
          type="number"
          value={bidValue}
          onChange={(e) => updateBidValue(e)}
        />
        <img src="/img/crypto/SOL.svg" tw="w-8 h-8 mt-3 ml-[-30px] sm:mt-0 " />
      </div>
      <div className="vContainer" tw="mt-[40px] sm:mt-[30px]">
        <div
          className={selectedBtn === 0 ? 'bidButtonSelected' : 'bidButton'}
          onClick={() => handleBtnClicked(buyerPrice + 10, 0)}
        >
          {buyerPrice + 10}
        </div>
        <div
          className={selectedBtn === 1 ? 'bidButtonSelected' : 'bidButton'}
          onClick={() => handleBtnClicked(buyerPrice + 20, 1)}
        >
          {buyerPrice + 20}
        </div>
        {!checkMobile() && (
          <div
            className={selectedBtn === 2 ? 'bidButtonSelected' : 'bidButton'}
            onClick={() => handleBtnClicked(buyerPrice + 30, 2)}
          >
            {buyerPrice + 30}
          </div>
        )}
      </div>

      <div className="buyBtnContainer" tw="!mt-12">
        <Button className="buyButton" disabled={bidValue <= 0} onClick={() => setReviewClicked(true)}>
          Review Offer
        </Button>
      </div>
    </div>
  )
}
const FinalPlaceBid: FC<{ bidValue: number }> = ({ bidValue }) => {
  const { bidNowClicked, buyNowClicked } = useNFTAggregator()
  const clickedNFT = bidNowClicked ? bidNowClicked : buyNowClicked
  const actionBtnText = bidNowClicked ? 'Place bid' : 'Buy now'
  const servicePrice = 0.05
  const { prices } = usePriceFeedFarm()
  const { getUIAmount } = useAccounts()
  const history = useHistory()
  const { sessionUser, fetchSessionUser } = useNFTProfile()
  const { connected, wallet, sendTransaction } = useWallet()
  const { connection, network } = useConnectionConfig()
  const { general, nftMetadata, bidOnSingleNFT, ask } = useNFTDetails()
  const purchasePrice = parseFloat(ask?.buyer_price ? ask?.buyer_price : '0') / LAMPORTS_PER_SOL_NUMBER

  const [mode, setMode] = useState<string>(purchasePrice ? 'review' : 'bid')
  const [bidPriceInput, setBidPriceInput] = useState<string>(purchasePrice ? `${purchasePrice}` : '')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [pendingTxSig, setPendingTxSig] = useState<string>()

  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet])

  const creator = useMemo(() => {
    if (nftMetadata === undefined) return null
    if (nftMetadata.properties.creators.length > 0) {
      const addr = nftMetadata.properties.creators[0].address
      return truncateAddress(addr)
    } else if (nftMetadata.collection) {
      return Array.isArray(nftMetadata.collection) ? nftMetadata.collection[0].name : nftMetadata.collection.name
    } else {
      return null
    }
  }, [nftMetadata])

  const bidPrice: number | null = useMemo(
    () => (bidPriceInput.length > 0 ? parseFloat(bidPriceInput) : null),
    [bidPriceInput]
  )
  const servicePriceCalc: number = useMemo(
    () => (bidPrice ? parseFloat(((NFT_MARKET_TRANSACTION_FEE / 100) * Number(bidPrice)).toFixed(3)) : 0),
    [bidPrice]
  )

  const marketData = useMemo(() => prices['SOL/USDC'], [prices])

  const fiatCalc: string = useMemo(
    () => `${marketData && bidPrice ? (marketData.current * bidPrice).toFixed(3) : ''}`,
    [marketData, bidPrice]
  )

  const notEnough: boolean = useMemo(
    () => (bidPrice >= getUIAmount(WRAPPED_SOL_MINT.toBase58()) ? true : false),
    [bidPrice]
  )

  useEffect(
    () => () => {
      setMode('bid')
      setBidPriceInput('')
      setIsLoading(false)
    },
    []
  )

  useEffect(() => {
    if (connected && publicKey) {
      if (!sessionUser || sessionUser.pubkey !== publicKey.toBase58()) {
        fetchUser()
      }
      setIsLoading(false)
    } else {
      setIsLoading(false)

      notify({
        type: 'error',
        message: (
          <MESSAGE>
            <div>Couldn't fetch user data, please connect your wallet and refresh this page.</div>
          </MESSAGE>
        )
      })
    }

    return null
  }, [publicKey, connected])

  const fetchUser = () => {
    fetchSessionUser('address', publicKey.toBase58(), connection).then((res) => {
      if (!res || (res.response && res.response.status !== 200) || res.isAxiosError) {
        notify({
          type: 'error',
          message: (
            <MESSAGE>
              <div>Couldn't fetch user data, please refresh this page.</div>
            </MESSAGE>
          )
        })
      }
    })
  }

  const derivePDAsForInstruction = async () => {
    const buyerPriceInLamports = (bidValue + servicePrice) * LAMPORTS_PER_SOL_NUMBER
    const buyerPrice: BN = new BN(buyerPriceInLamports)

    const metaDataAccount: StringPublicKey = await getMetadata(general.mint_address)

    const escrowPaymentAccount: [PublicKey, number] = await PublicKey.findProgramAddress(
      [Buffer.from(AUCTION_HOUSE_PREFIX), toPublicKey(AUCTION_HOUSE).toBuffer(), publicKey.toBuffer()],
      toPublicKey(AUCTION_HOUSE_PROGRAM_ID)
    )

    const buyerTradeState: [PublicKey, number] = await tradeStatePDA(publicKey, general, bnTo8(buyerPrice))

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
      buyerPrice
    }
  }

  const callBuyInstruction = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)

    const { metaDataAccount, escrowPaymentAccount, buyerTradeState, buyerPrice } = await derivePDAsForInstruction()

    if (!metaDataAccount || !escrowPaymentAccount || !buyerTradeState) {
      notify({
        type: 'error',
        message: (
          <MESSAGE>
            <Row justify="space-between" align="middle">
              <Col>Open bid error!</Col>
              <Col>
                <img className="mIcon" src={`/img/assets/close-white-icon.svg`} alt="" />
              </Col>
            </Row>
            <div>Could not derive values for buy instructions</div>
          </MESSAGE>
        )
      })

      // setTimeout(() => setVisible(false), 1000)
      return
    }

    const buyInstructionArgs: BuyInstructionArgs = {
      tradeStateBump: buyerTradeState[1],
      escrowPaymentBump: escrowPaymentAccount[1],
      buyerPrice: buyerPrice,
      tokenSize: tokenSize
    }

    const buyInstructionAccounts: BuyInstructionAccounts = await getBuyInstructionAccounts(
      publicKey,
      general,
      metaDataAccount,
      escrowPaymentAccount[0],
      buyerTradeState[0]
    )

    const buyIX: TransactionInstruction = await createBuyInstruction(buyInstructionAccounts, buyInstructionArgs)
    console.log(buyIX)

    const transaction = new Transaction().add(buyIX)
    try {
      const signature = await sendTransaction(transaction, connection)
      console.log(signature)
      setPendingTxSig(signature)

      const confirm = await connection.confirmTransaction(signature, 'finalized')
      console.log(confirm)

      if (confirm.value.err === null) {
        postBidToAPI(signature, buyerPrice, tokenSize).then((res) => {
          console.log(res)

          notify(successfulListingMessage(signature, nftMetadata, bidPrice.toString()))

          if (res === 'Error') {
            // callCancelInstruction()
            // setVisible(false)
            console.log('error')
          } else if (res.data.bid_matched && res.data.tx_sig) {
            fetchUser()
            notify(successBidMatchedMessage(res.data.tx_sig, nftMetadata, bidPrice.toString()))
            setTimeout(() => history.push(`/NFTs/profile/${publicKey.toBase58()}`), 2000)
          } else {
            //  setVisible(false)
          }
        })
      }
    } catch (error) {
      setIsLoading(false)
      notify({
        type: 'error',
        message: (
          <MESSAGE>
            <Row justify="space-between" align="middle">
              <Col>NFT Biding error!</Col>
              <Col>
                <img className="mIcon" src={`/img/assets/close-white-icon.svg`} alt="" />
              </Col>
            </Row>
            <div>{error.message}</div>
            <div>Please try again, if the error persists please contact support.</div>
          </MESSAGE>
        )
      })
    }
  }

  const postBidToAPI = async (txSig: any, buyerPrice: BN, tokenSize: BN) => {
    const bidObject = {
      clock: Date.now().toString(),
      tx_sig: txSig,
      wallet_key: publicKey.toBase58(),
      auction_house_key: AUCTION_HOUSE,
      token_account_key: general.token_account,
      auction_house_treasury_mint_key: TREASURY_MINT,
      token_account_mint_key: general.mint_address,
      buyer_price: buyerPrice.toString(),
      token_size: tokenSize.toString(),
      non_fungible_id: general.non_fungible_id,
      collection_id: general.collection_id,
      user_id: sessionUser.user_id
    }

    try {
      const res = await bidOnSingleNFT(bidObject)
      if (res.isAxiosError) {
        notify({
          type: 'error',
          message: (
            <MESSAGE>
              <Row justify="space-between" align="middle">
                <Col>NFT Biding error!</Col>
                <Col>
                  <img className="mIcon" src={`/img/assets/close-white-icon.svg`} alt="" />
                </Col>
              </Row>
              <div>Please try again, if the error persists please contact support.</div>
            </MESSAGE>
          )
        })
        return 'Error'
      } else {
        setBidPriceInput('')
        setMode('bid')
        return res
      }
    } catch (error) {
      console.dir(error)
      setIsLoading(false)
      return 'Error'
    }
  }

  const handleBidInput = (e) => {
    if (!isNaN(Number(e.target.value))) {
      setBidPriceInput(e.target.value)
      if (e.target.value.length === 0) {
        setMode('bid')
      }
    }
  }

  const successfulListingMessage = (signature: any, nftMetadata: any, price: string) => ({
    message: (
      <SuccessfulListingMsg
        title={`Successfully placed a bid on ${nftMetadata?.name}!`}
        itemName={nftMetadata.name}
        supportText={`Bid of: ${price}`}
        tx_url={`https://solscan.io/tx/${signature}?cluster=${network}`}
      />
    )
  })

  const successBidMatchedMessage = (signature: any, nftMetadata: any, price: string) => ({
    message: (
      <SuccessfulListingMsg
        title={`Your bid matched!`}
        itemName={nftMetadata.name}
        supportText={`You have just acquired ${nftMetadata.name} for ${price} SOL!`}
        tx_url={`https://solscan.io/tx/${signature}?cluster=${network}`}
      />
    )
  })

  return (
    <>
      <div tw="flex flex-col items-center justify-center">
        <div className="buyTitle">
          You are about to buy <br />
          <strong>#{clickedNFT.collectionId} </strong> {checkMobile() ? <br /> : 'by'}
          <strong> {clickedNFT.nft_name}</strong>
        </div>
        <div className="verifiedText">
          {!checkMobile() && <img className="verifiedImg" src={`/img/assets/Aggregator/verifiedNFT.svg`} alt="" />}
          This is a verified {checkMobile() && <br />} Creator
          {checkMobile() && <img className="verifiedImg" src={`/img/assets/Aggregator/verifiedNFT.svg`} alt="" />}
        </div>
      </div>

      <div className="vContainer">
        <img className="nftImg" src={clickedNFT.image_url} alt="" />
      </div>

      {/* <div className="vContainer">
  <img className="verifiedImg" src={`/img/assets/Aggregator/verifiedNFT.svg`} alt="" />
  <div className="verifiedText">This is a verified {checkMobile() && <br />} Creator</div>
</div> */}

      <div className="vContainer">
        <div className="priceText">Price</div>
      </div>

      <div className="vContainer">
        <div className="priceNumber">
          {bidValue} <img src={`/img/crypto/SOL.svg`} />
        </div>
      </div>
      <div tw="mt-8">
        <AppraisalValue width={360} />
      </div>

      <div className="hContainer" style={{ height: 150 }}>
        <div className="rowContainer">
          <div className="leftAlign">My Bid</div>
          <div className="rightAlign">{bidValue} SOL</div>
        </div>
        <div className="rowContainer">
          <div className="leftAlign">Service Fee</div>
          <div className="rightAlign"> {servicePrice} SOL</div>
        </div>
        <div className="rowContainer">
          <div className="leftAlign">Total Price</div>
          <div className="rightAlign"> {bidValue + servicePrice} SOL</div>
        </div>
      </div>
      <div className="buyBtnContainer" onClick={callBuyInstruction}>
        <Button className="buyButton">{actionBtnText}</Button>
      </div>
    </>
  )
}
