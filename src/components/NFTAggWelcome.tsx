/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { ReactElement, FC, useState } from 'react'
import Slider from 'react-slick'
import { PopupCustom } from '../pages/NFTs/Popup/PopupCustom'
import { Button, Checkbox } from 'antd'
import { checkMobile } from '../utils'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'

const WRAPPER = styled.div`
  ${tw`flex items-center justify-center -mt-14`}
  color: ${({ theme }) => theme.text7};
  .slick-prev {
    ${tw`mt-[260px] pl-4`}
  }
  .slick-prev:before {
    ${tw`text-[15px] font-semibold`}
    font-family: 'Monserrat';
    content: 'Previous';
    color: ${({ theme }) => theme.text1};
  }

  .slick-next:before {
    ${tw`text-[15px] font-semibold`}
    font-family: 'Monserrat';
    content: 'Next';
    color: ${({ theme }) => theme.text1};
  }
  .slick-dots {
    ${tw`w-[65%] ml-[75px]`}
  }
  .slick-next {
    ${tw`mt-[260px] pr-12`}
  }
  .closeBtn {
    ${tw`absolute -top-8 mr-[420px] h-5 w-5 cursor-pointer `}
  }
  .bannerContainer {
    background: ${({ theme }) => theme.bg23};
    ${tw`h-[600px] w-[500px] rounded-3xl flex items-center justify-center pl-2 pr-2 sm:w-[90%] `}
  }
  .sliderContainer {
    ${tw`h-5/6 w-11/12 sm:h-[90%]`}
    img {
      ${tw`w-[285px] sm:w-[265px] h-[283px] m-auto `}
    }
  }
  .flexContainer {
    ${tw`flex items-center justify-center h-[30px]	`}
    img {
      ${tw`w-[30px] h-[30px] mr-3 `}
    }
  }

  .trackNFTImg {
    height: 320px !important;
    width: 420px !important;
    @media (max-width: 500px) {
      height: 246px !important;
      width: 310px !important;
    }
  }
  .slide {
    h3 {
      color: ${({ theme }) => theme.text7};
      ${tw`text-xl font-semibold text-center text-[20px] `}
    }
    .subText {
      ${tw`text-xl font-medium text-center text-[15px] p-1`}
      color: ${({ theme }) => theme.text20};
    }
  }
`

export const GFXApprisalPopup: FC<{ showTerms: boolean; setShowTerms: any }> = ({ showTerms, setShowTerms }) => (
  <STYLED_POPUP
    height={checkMobile() ? '553px' : '630px'}
    width={checkMobile() ? '354px' : '500px'}
    title={null}
    visible={showTerms ? true : false}
    onCancel={() => setShowTerms(false)}
    footer={null}
  >
    <WRAPPER tw="!mt-2">
      <div className="slide">
        <h3>
          <div className="flexContainer">
            <div>
              <img src={'/img/assets/AppracialValueIcon.png'} alt="" />
            </div>
            <div>GFX Appraisal Value</div>
          </div>
        </h3>
        <img className="trackNFTImg" src={'/img/assets/GFXappraisalGraphic.png'} alt="" />
        <h3 tw="mt-8 sm:mt-4">Track NFT collections like never before!</h3>
        <div className="subText">
          Make the best decisions using the GFX Appraisal Value. Our model emphasizes executed sales data, not
          listing prices.
        </div>
      </div>
    </WRAPPER>
  </STYLED_POPUP>
)

const NFTAggWelcome: FC<{ rewardToggle: any }> = ({ rewardToggle }): ReactElement => {
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  }
  return (
    <WRAPPER>
      <img
        className="closeBtn"
        onClick={() => rewardToggle(false)}
        src={'/img/assets/close-gray-icon.svg'}
        alt=""
      />

      <div className="bannerContainer">
        <div className="sliderContainer">
          <Slider {...settings}>
            <div className="slide">
              <h3>
                Welcome to our <br /> NFT Aggregator!{' '}
              </h3>
              <img src={'/img/assets/welcomeGraphic.png'} alt="" />
              <h3></h3>
              <div className="subText">
                Explore, Buy and Compare thousands of NFTs in a single platform or Mint from our exclusive
                launches.
              </div>
            </div>
            <div className="slide">
              <h3>
                <div className="flexContainer">
                  <div>
                    <img src={'/img/assets/AppracialValueIcon.png'} alt="" />
                  </div>
                  <div>GFX Appraisal Value</div>
                </div>
              </h3>
              <img className="trackNFTImg" src={'/img/assets/GFXappraisalGraphic.png'} alt="" />
              <h3>Track NFT collections like never before!</h3>
              <div className="subText">
                Make the best decisions using the GFX Appraisal Value. Our model emphasizes executed sales data,
                not listing prices.
              </div>
            </div>
            {!checkMobile() && (
              <div className="slide">
                <h3>Unique Features!</h3>
                <img src={'/img/assets/uniqueFeaturesGraphic.png'} alt="" />
                <h3>Explore our Unique Features!</h3>
                <div className="subText">
                  Make the best decisions using the GFX Appraisal Value. Our model emphasizes executed sales data,
                  not listing prices.
                </div>
              </div>
            )}
            <div className="slide">
              <h3>GFX Platform Token</h3>
              <img src={'/img/assets/GOFXrewardsGraphic.png'} alt="" />
              <h3>Get Rewarded!</h3>
              <div className="subText">For every sale through our marketplace, you can earn $GOFX</div>
            </div>
          </Slider>
        </div>
      </div>
    </WRAPPER>
  )
}

const STYLED_POPUP = styled(PopupCustom)`
  .title {
    ${tw`flex text-[20px] mt-1 font-semibold items-center justify-center `}
    color: ${({ theme }) => theme.text11};
  }
  .ant-modal-close-x {
    display: none;
    visibility: hidden;
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
`

export const NFTAggTerms = ({ setShowTerms, showTerms, setShowPopup }: any) => {
  const [checboxChecked, setChecbox] = useState<boolean>(false)
  return (
    <STYLED_POPUP
      height={'630px'}
      width={'500px'}
      title={null}
      visible={showTerms ? true : false}
      onCancel={() => setShowTerms(true)}
      footer={null}
    >
      <div className="title">Welcome to GooseFX!</div>
      <img className="welcomeImg" src="/img/assets/Aggregator/termsServiceGraphic.png" />
      <div className="termsText">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Nulla, laudantium similique ullam quam
        dignissimos suscipit nobis a nesciunt cumque voluptate reprehenderit expedita libero atque nam delectus.
        Magnam, soluta laborum. Minus quam incidunt libero provident sed illum dolor doloribus quo veniam non
        voluptate eligendi ea iure, perspiciatis nesciunt quas inventore architecto a eaque molestias sunt ad
        pariatur? Veritatis deleniti quidem autem neque soluta temporibus adipisci, cupiditate magnam deserunt
        aliquam exercitationem accusantium ipsam eligendi. Blanditiis quo sint nisi fugiat quibusdam ducimus vero
        consequuntur explicabo odit sed dicta adipisci distinctio magni nemo, animi velit voluptatibus, provident
        illo inventore ut autem temporibus eaque. Nisi ullam ab officia tenetur error unde itaque quae excepturi
        similique impedit necessitatibus nihil m agnam dicta aut blanditiis praesentium accusamus iure, amet cum
        corporis id n eque. Ipsum ut voluptate dicta culpa, autem sequi laudantium inventore repudi andae illo
        obcaecati consequuntur nostrum nisi? Nesciunt omnis quos veritatis deleniti repellat, quibusdam id beatae
        culpa, sequi impedit officia vitae nobis non tenetur cumque numquam sunt autem nihil reici ipsa ex,
        necessitatibus ab alias id, illo iste aliquid numquam architecto itaque.
      </div>
      <div className="textContainer">
        <Checkbox onChange={() => setChecbox((prev) => !prev)} />
        <div className="agreeText">I agree GooseFX terms and conditions and protocol disclaimer.</div>
        <Button
          className="btn"
          disabled={!checboxChecked}
          onClick={() => {
            setShowTerms(false)
            setShowPopup(true)
          }}
        >
          {' '}
          Continue{' '}
        </Button>
      </div>
    </STYLED_POPUP>
  )
}

export default NFTAggWelcome
