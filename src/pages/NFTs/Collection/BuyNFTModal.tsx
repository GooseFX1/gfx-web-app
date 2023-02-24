/* eslint-disable @typescript-eslint/no-unused-vars */
import { Modal } from 'antd'
import React, { ReactElement } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { useNFTAggregator } from '../../../context'
import { checkMobile } from '../../../utils'
import { AppraisalValue } from '../../../utils/GenericDegsin'
import { PopupCustom } from '../Popup/PopupCustom'

const STYLED_POPUP = styled(PopupCustom)`
  ${tw`flex flex-col `}
  &.ant-modal {
    ${tw`max-w-full sm:bottom-[-10px] sm:mt-auto sm:absolute sm:h-[600px]`}
    background-color: ${({ theme }) => theme.bg26};
  }
  color: ${({ theme }) => theme.text20};
  .buyTitle {
    ${tw`text-[25px] sm:ml-[140px] sm:mt-1 sm:text-[14px] sm:absolute sm:pt-2 font-medium text-center sm:text-left `}
    color: ${({ theme }) => theme.text20};
    strong {
      ${tw`sm:text-[25px] sm:mt-[-10px] leading-6`}
      color: ${({ theme }) => theme.text28};
    }
  }
  .verifiedText {
    ${tw`font-semibold text-[16px] mt-[15px] sm:text-left sm:ml-[80px] sm:mt-[95px]`}
  }
  .hContainer {
    ${tw`flex flex-col items-center justify-center`}
  }
  .vContainer {
    ${tw`flex items-center justify-center relative`}
  }
  .verifiedImg {
    ${tw`h-[35px] sm:w-[18px] sm:absolute sm:mt-[115px] sm:ml-[115px] sm:h-[18px] w-[35px] mr-2 mt-[15px]`}
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
  .nftImgBid {
    border: 1px solid;
    ${tw`w-[165px] h-[165px] sm:mt-[150px] left-0 mt-[25px] sm:h-[125px] sm:w-[125px] sm:left-0 sm:absolute`}
  }

  .priceText {
    ${tw`text-[25px] font-semibold mt-[15px]`}
    color: ${({ theme }) => theme.text12};
  }

  .buyButton {
    ${tw`w-[520px] sm:h-[50px] sm:text-[15px]  cursor-pointer 
     h-[60px] text-white text-[20px] font-semibold flex items-center justify-center`}
    border-radius: 50px;
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  }
  .priceNumber {
    ${tw`text-[40px] font-semibold flex items-center mt-[-12px] `}
    color: ${({ theme }) => theme.text7};
    img {
      ${tw`h-[25px] w-[25px] ml-3`}
    }
  }

  .buyBtnContainer {
    ${tw`flex items-center justify-center`}
  }
`

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const BuyNFTModal = (): ReactElement => {
  const { selectedNFT, setSelectedNFT, buyNowClicked, setBuyNow } = useNFTAggregator()
  return (
    <STYLED_POPUP
      height={checkMobile() ? '600px' : '780px'}
      width={checkMobile() ? '100%' : '580px'}
      title={null}
      visible={buyNowClicked ? true : false}
      onCancel={() => setBuyNow(undefined)}
      footer={null}
    >
      <div className="buyTitle">
        You are about to buy <br />
        <strong>#{buyNowClicked.collectionId} </strong> {checkMobile() ? <br /> : 'by'}
        <strong> {buyNowClicked.nft_name}</strong>
      </div>
      <div className="vContainer">
        <img className="nftImg" src={buyNowClicked.image_url} alt="" />
      </div>

      <div className="vContainer">
        <img className="verifiedImg" src={`/img/assets/Aggregator/verifiedNFT.svg`} alt="" />
        <div className="verifiedText">This is a verified {checkMobile() && <br />} Creator</div>
      </div>

      <div className="vContainer">
        <div className="priceText">Price</div>
      </div>

      <div className="vContainer">
        <div className="priceNumber">
          {buyNowClicked.nftPrice} <img src={`/img/crypto/${buyNowClicked.currency}.svg`} />
        </div>
      </div>
      <AppraisalValue width={360} />

      <div className="hContainer" style={{ height: 160 }}>
        <div className="rowContainer">
          <div className="leftAlign">Price</div>
          <div className="rightAlign">1000 SOL</div>
        </div>
        <div className="rowContainer">
          <div className="leftAlign">Service Fee</div>
          <div className="rightAlign">0.01 SOL</div>
        </div>
        <div className="rowContainer">
          <div className="leftAlign">Total Price</div>
          <div className="rightAlign"> 1000.01 SOL</div>
        </div>
        <div className="rowContainer">
          <div className="leftAlign">Total Price</div>
          <div className="rightAlign"> 1000.01 SOL</div>
        </div>
      </div>
      <div className="buyBtnContainer">
        <div className="buyButton">Buy Now</div>
      </div>
    </STYLED_POPUP>
  )
}
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const BidNFTModal = (): ReactElement => {
  const { selectedNFT, setSelectedNFT, bidNowClicked, setBidNow } = useNFTAggregator()
  console.log(selectedNFT)

  return (
    <STYLED_POPUP
      height={checkMobile() ? '600px' : '780px'}
      width={checkMobile() ? '100%' : '580px'}
      title={null}
      visible={bidNowClicked ? true : false}
      onCancel={() => setBidNow(false)}
      footer={null}
    >
      <div className="buyTitle">
        You are about to Bid <br />
        <strong>#{bidNowClicked.collectionId} </strong> {checkMobile() ? <br /> : 'by'}
        <strong> {selectedNFT?.collection_name}</strong>
      </div>
      <div className="vContainer">
        <img className="nftImgBid" src={bidNowClicked.nft_url} alt="" />
        <div className="currentBid">Current Bid</div>
      </div>

      <div className="vContainer">
        <img className="verifiedImg" src={`/img/assets/Aggregator/verifiedNFT.svg`} alt="" />
        <div className="verifiedText">This is a verified {checkMobile() && <br />} Creator</div>
      </div>

      <div className="vContainer">
        <div className="priceText">Price</div>
      </div>

      <div className="vContainer">
        <div className="priceNumber">
          {bidNowClicked.nftPrice} <img src={`/img/crypto/${bidNowClicked.currency}.svg`} />
        </div>
      </div>
      <AppraisalValue width={360} />

      <div className="buyBtnContainer">
        <div className="buyButton">Buy Now</div>
      </div>
    </STYLED_POPUP>
  )
}
