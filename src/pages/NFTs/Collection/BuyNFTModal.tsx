/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button, Modal } from 'antd'
import React, { ReactElement, useState, FC } from 'react'
import { useNFTAggregator, useNFTDetails } from '../../../context'
import { checkMobile } from '../../../utils'
import { AppraisalValue } from '../../../utils/GenericDegsin'
import { PopupCustom } from '../Popup/PopupCustom'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { LAMPORTS_PER_SOL_NUMBER } from '../../../constants'
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
    ${tw`flex items-center justify-center mt-8 sm:mt-[20px] `}
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
      {checkMobile() && <img className="nftImgBid" src={buyNowClicked.image_url} alt="" />}
      <div tw="flex flex-col sm:mt-[-135px] sm:items-start items-center">
        <div className="buyTitle">
          You are about to Bid <br />
          <strong>{buyNowClicked.nft_name} </strong> {checkMobile() ? <br /> : ''}
          <strong> {buyNowClicked?.collection_name}</strong>
        </div>
        <div className="verifiedText">
          {!checkMobile() && <img className="verifiedImg" src={`/img/assets/Aggregator/verifiedNFT.svg`} alt="" />}
          This is a verified {checkMobile() && <br />} Creator
          {checkMobile() && <img className="verifiedImg" src={`/img/assets/Aggregator/verifiedNFT.svg`} alt="" />}
        </div>
      </div>
      <div className="vContainer" tw="flex">
        {!checkMobile() && <img className="nftImgBid" src={buyNowClicked.image_url} alt="" />}
        <div tw="flex flex-col">
          <div className="currentBid">Price</div>
          <div className="priceNumber" tw="ml-4 mt-2 flex items-center">
            {buyerPrice >= 0 ? buyerPrice : 0} <img src={`/img/crypto/SOL.svg`} />
          </div>
        </div>
      </div>

      <div tw="mt-[30px]">
        <AppraisalValue width={360} />
      </div>

      <div className="hContainer" style={{ height: 160 }} tw="sm:mt-[40px] mt-[30px]">
        <div className="rowContainer">
          <div className="leftAlign">Price</div>
          <div className="rightAlign">{buyerPrice} SOL</div>
        </div>
        <div className="rowContainer">
          <div className="leftAlign">Service Fee</div>
          <div className="rightAlign"> {servicePrice} SOL</div>
        </div>
        <div className="rowContainer">
          <div className="leftAlign">Total Price</div>
          <div className="rightAlign"> {buyerPrice + servicePrice} SOL</div>
        </div>
        <div className="rowContainer">
          <div className="leftAlign">Total Price</div>
          <div className="rightAlign"> {buyerPrice + servicePrice} SOL</div>
        </div>
      </div>
      {checkMobile() && <div className="drawLine" />}

      <div className="buyBtnContainer" tw="!mt-16">
        <div className="buyButton">Buy Now</div>
      </div>
    </STYLED_POPUP>
  )
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const BidNFTModal = (): ReactElement => {
  const { selectedNFT, setSelectedNFT, bidNowClicked, setBidNow } = useNFTAggregator()
  const [selectedBtn, setSelectedBtn] = useState<number | undefined>(undefined)
  const { ask } = useNFTDetails()
  const buyerPrice = parseFloat(ask?.buyer_price ? ask?.buyer_price : '0') / LAMPORTS_PER_SOL_NUMBER
  const [bidValue, setBidValue] = useState<number | undefined>(buyerPrice ? buyerPrice : 0)
  const [reviewBtnClicked, setReviewClicked] = useState<boolean>(false)
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
      <div className="buyBtnContainer">
        <Button className="buyButton" disabled={bidValue <= 0} onClick={() => setReviewClicked(true)}>
          Review Offer
        </Button>
      </div>
    </div>
  )
}
const FinalPlaceBid: FC<{ bidValue: number }> = ({ bidValue }) => {
  const { bidNowClicked } = useNFTAggregator()
  const servicePrice = 0.05
  return (
    <>
      <div className="buyTitle">
        You are about to buy <br />
        <strong>#{bidNowClicked.collectionId} </strong> {checkMobile() ? <br /> : 'by'}
        <strong> {bidNowClicked.nft_name}</strong>
      </div>
      <div className="vContainer">
        <img className="nftImg" src={bidNowClicked.image_url} alt="" />
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

      <div className="hContainer" style={{ height: 160 }}>
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
      <div className="buyBtnContainer">
        <div className="buyButton">Place Bid</div>
      </div>
    </>
  )
}
