/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { ReactElement, FC, useState, MouseEventHandler, useMemo } from 'react'
import Slider from 'react-slick'
import { PopupCustom } from '../pages/NFTs/Popup/PopupCustom'
import { Button, Checkbox } from 'antd'
import { checkMobile } from '../utils'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useDarkMode } from '../context'

const WRAPPER = styled.div`
  ${tw`flex items-center justify-center`}
  color: ${({ theme }) => theme.text7};
`
const STYLED_POPUP = styled(PopupCustom)`
  .title {
    ${tw`flex text-[20px] mt-1 font-semibold items-center justify-center `}
    color: ${({ theme }) => theme.text11};
  }
  .ant-modal-content {
    ${tw`h-[100%]`}
  }
  .ant-modal-close {
    opacity: 0.6;
    ${tw`sm:h-[16px] sm:w-[16px]`}
  }
  &.ant-modal {
    background: ${({ theme }) => theme.bg25};
  }
  .ant-btn {
    background: ${({ theme }) => theme.bg22};
    border: none;
    border-radius: 50px;
    ${tw`h-[42px] w-[165px]  `}
    span {
      ${tw`font-semibold text-white text-[15px]`}
    }
    :disabled {
      opacity: 0.5;
      span {
        ${tw`text-[#636363]`}
      }
    }
  }
  .welcomeImg {
    ${tw`w-[500px] -ml-6 h-[250px] mt-10`}
  }
  .textContainer {
    ${tw`flex items-center text-[12px] mt-6 `}
    color: ${({ theme }) => theme.text20};
  }
  .agreeText {
    ${tw`ml-2 font-medium`}
  }
  .termsText {
    ${tw`mt-8 h-[155px] p-1 text-[12px] font-medium overflow-y-auto rounded-lg	`}
    border: 1px solid ${({ theme }) => theme.borderBottom};
    ${({ theme }) => theme.customScrollBar('0px')};
    color: ${({ theme }) => theme.text20};
  }
  .slick-prev {
    ${tw`w-auto sm:absolute top-[548px] ml-[-6px] sm:top-[530px]  
      text-[15px] font-semibold leading-normal sm:top-[500px] sm:ml-[25px]`}
    color: ${({ theme }) => theme.text38};
    &:before {
      display: none;
    }
  }

  .slick-next {
    ${tw`w-auto top-[548px]  text-[15px] mr-[-6px] font-semibold
    sm:absolute sm:top-[500px] sm:mr-[20px] leading-normal`}
    color: ${({ theme }) => theme.text38};

    &:before {
      display: none;
    }
  }

  .slick-dots {
    ${tw`w-[65%] ml-[80px] sm:ml-[57px] sm:absolute sm:bottom-[-68px] sm:pt-10`}
  }
  .slick-dots li.slick-active button:before {
    color: ${({ theme }) => theme.text32};
    opacity: 1;
    ${tw`text-[8px]`}
  }
  .slick-dots li button:before {
    color: ${({ theme }) => theme.text1};
    ${tw`text-[6px]`}
  }
  .slick-dots li:last-child {
    display: none;
  }

  .closeBtn {
    ${tw`absolute  -top-8 sm:mr-[-300px] mr-[420px] h-5 w-5 cursor-pointer   z-10 `}
  }
  .bannerContainer {
    ${tw`mt-8 sm:mt-0 rounded-3xl flex items-center justify-center sm:px-0  px-2 sm:w-[100%] `}
  }
  .sliderContainer {
    ${tw`h-5/6 w-11/12 sm:w-[100%] sm:h-[90%]`}

    img {
      ${tw`h-[300px] w-auto sm:h-[280px] m-auto `}
    }
  }
  .flexContainer {
    ${tw`flex items-center justify-center h-[30px]	`}
    img {
      ${tw`w-[30px] h-[30px] mr-3 `}
    }
  }

  .trackNFTImg {
    ${tw`h-[340px] w-[403px] mt-8`}
    @media (max-width: 500px) {
      height: 246px !important;
      width: 310px !important;
    }
  }

  .slide {
    * {
      ${tw`font-semibold text-center`}
      color: ${({ theme }) => theme.text7};
    }

    h2 {
      ${tw`text-[20px]`}
    }
    h3 {
      ${tw`text-[18px] `}
    }
    .subText {
      ${tw`font-medium text-[15px] sm:w-[292px]`}
      color: ${({ theme }) => theme.text20};
    }
  }
`

export const GFXApprisalPopup: FC<{ showTerms: boolean; setShowTerms: any }> = ({ showTerms, setShowTerms }) => {
  const { mode } = useDarkMode()
  return (
    <STYLED_POPUP
      height={checkMobile() ? '553px' : '630px'}
      width={checkMobile() ? '354px' : '500px'}
      title={null}
      centered={true}
      visible={showTerms ? true : false}
      onCancel={() => setShowTerms(false)}
      footer={null}
    >
      <WRAPPER>
        <div className="slide">
          <h3>
            <div>
              Track NFT collections <br /> like never before!
            </div>
          </h3>
          <img className="trackNFTImg" src={`/img/assets/Aggregator/GFXappraisalGraphic${mode}.png`} alt="" />
          <h3 tw="mt-8 sm:mt-4">For individual assets in a collection</h3>
          <div className="subText">
            Make the best decisions using the GFX Appraisal Value. Our model emphasizes executed sales data, not
            listing prices.
          </div>
        </div>
      </WRAPPER>
    </STYLED_POPUP>
  )
}

export const NFTAggWelcome = ({ showTerms, setShowPopup }: any) => {
  const [currentSlide, setCurrentSlide] = useState<number>(0)
  const { mode } = useDarkMode()

  const showNextButton = useMemo(() => (currentSlide === 2 ? 'Start' : 'Next'), [currentSlide])
  const settings = {
    dots: checkMobile() ? true : false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    beforeChange: (current, next) => {
      setCurrentSlide(next)
      if (next === 3) setShowPopup(false)
    },
    nextArrow: <div> {showNextButton}</div>,
    prevArrow: <div> {currentSlide !== 0 && `Previous`}</div>
  }
  return (
    <STYLED_POPUP
      height={checkMobile() ? '553px' : '630px'}
      width={checkMobile() ? '354px' : '500px'}
      title={null}
      centered={true}
      visible={showTerms ? true : false}
      onCancel={() => setShowPopup(false)}
      footer={null}
    >
      <div className="bannerContainer">
        <div className="sliderContainer">
          <Slider {...settings}>
            <div className="slide">
              <h2>
                Welcome to our <br /> NFT Aggregator!
              </h2>
              <img src={'/img/assets/welcomeGraphic.png'} alt="" />
              <div className="subText">
                Explore, Buy and Compare thousands of NFTs in a single platform or Mint from our exclusive
                launches.
              </div>
            </div>
            <div className="slide">
              <h2>
                Track NFT collections
                <br />
                like never before!
              </h2>
              <img className="trackNFTImg" src={`/img/assets/Aggregator/GFXAppraisalGraphic${mode}.png`} alt="" />
              <h3 tw="!text-[15px] font-semibold">*For individual assets in a collection</h3>
              <div className="subText">
                Make the best decisions using the GFX Appraisal Value. Our model emphasizes executed sales data,
                not listing prices.
              </div>
            </div>

            <div className="slide">
              <h2>GFX Platform Token</h2>
              <img src={'/img/assets/GOFXrewardsGraphic.png'} alt="" />
              <h3>Get Rewarded!</h3>
              <div className="subText">For every sale through our marketplace, you can earn $GOFX</div>
            </div>
            {<div className="slide"></div>}
          </Slider>
        </div>
      </div>
    </STYLED_POPUP>
  )
}
