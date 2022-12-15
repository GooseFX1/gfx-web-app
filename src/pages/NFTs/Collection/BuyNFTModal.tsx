/* eslint-disable @typescript-eslint/no-unused-vars */
import { Modal } from 'antd'
import React, { ReactElement } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { useNFTAggregator } from '../../../context'
import { PopupCustom } from '../Popup/PopupCustom'

const STYLED_POPUP = styled(PopupCustom)`
  ${tw`flex flex-col`}
  color: ${({ theme }) => theme.text20};
  .buyTitle {
    ${tw`text-[25px] font-medium text-center`}
    color: ${({ theme }) => theme.text20};
    strong {
      color: ${({ theme }) => theme.text28};
    }
  }
  .verifiedText {
    ${tw`font-semibold text-[16px] mt-[15px]`}
  }
  .hContainer {
    ${tw`flex flex-col items-center justify-center`}
  }
  .vContainer {
    ${tw`flex items-center justify-center relative`}
  }
  .verifiedImg {
    ${tw`h-[35px] w-[35px] mr-2 mt-[15px]`}
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
    ${tw`w-[165px] h-[165px] mt-[25px]`}
  }
  .appraisalResult {
    color: ${({ theme }) => theme.text7};
    ${tw`text-[18px] font-semibold`}
  }
  .appraisal {
    ${tw`text-[18px] font-semibold`}
    color: ${({ theme }) => theme.text12};
  }
  .priceText {
    ${tw`text-[25px] font-semibold mt-[15px]`}
    color: ${({ theme }) => theme.text12};
  }

  .buyButton {
    ${tw`w-[520px]  cursor-pointer 
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
  .outerCover {
    ${tw`w-[360px] h-[68px] rounded-xl flex items-center justify-center mt-[30px]`}
    background: linear-gradient(96.79deg, #5855FF 4.25%, #DC1FFF 97.61%);
  }
  .buyBtnContainer {
    ${tw`flex items-center justify-center`}
  }
  .innerCover {
    ${tw`p-1 rounded-xl w-[357px] h-[65px] flex items-center justify-between`}
    background-color: ${({ theme }) => theme.bg3};
    img {
      ${tw`w-[34px] h-[34px] m-2`}
    }
  }
`

export const BuyNFTModal = (): ReactElement => {
  const { selectedNFT, setSelectedNFT } = useNFTAggregator()
  return (
    <STYLED_POPUP
      height={'780px'}
      width={'580px'}
      title={null}
      visible={selectedNFT ? true : false}
      onCancel={() => setSelectedNFT(undefined)}
      footer={null}
    >
      <div className="buyTitle">
        you are about to buy <br />
        <strong>#{selectedNFT.collectionId} </strong> by <strong> {'De Gods'}</strong>
      </div>

      <div className="vContainer">
        <img className="verifiedImg" src={`/img/assets/Aggregator/verifiedNFT.svg`} alt="" />
        <div className="verifiedText">This is a verified Creator</div>
      </div>

      <div className="vContainer">
        <img className="nftImg" src={selectedNFT.nft_url} alt="" />
      </div>

      <div className="vContainer">
        <div className="priceText">Price</div>
      </div>

      <div className="vContainer">
        <div className="priceNumber">
          {selectedNFT.nftPrice * 212} <img src={`/img/crypto/${selectedNFT.currency}.svg`} />
        </div>
      </div>
      <div className="vContainer">
        <div className="outerCover">
          <div className="innerCover">
            <div>
              <img src={'/img/assets/Aggregator/gooseLogo.svg'} />
            </div>
            <div className="hContainer">
              <div className="appraisal">Apprasial Value</div>
              <div className="appraisalResult">8000 SOL</div>
            </div>
            <div>
              <img src={'/img/assets/info.svg'} alt="" style={{ height: 30 }} />
            </div>
          </div>
        </div>
      </div>

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
