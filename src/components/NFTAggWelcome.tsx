/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { ReactElement, FC } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import Slider from 'react-slick'

const WRAPPER = styled.div`
  ${tw`flex items-center justify-center -mt-14 `}
  color: ${({ theme }) => theme.text7};
  .slick-prev {
    ${tw`mt-[260px] pl-4`}
  }
  .slick-next {
    ${tw`mt-[260px] pr-8`}
  }
  .closeBtn {
    ${tw`absolute -top-8 mr-[420px] h-5 w-5 cursor-pointer `}
  }
  .bannerContainer {
    background: ${({ theme }) => theme.bg23};
    ${tw`h-[600px] w-[500px] rounded-3xl flex items-center justify-center pl-2 pr-2`}
  }
  .sliderContainer {
    ${tw`h-5/6 w-11/12`}
    img {
      ${tw`w-[285px] h-[283px] m-auto mt-10`}
    }
  }
  .slide {
    h3 {
      color: ${({ theme }) => theme.text7};
      ${tw`text-xl font-semibold text-center`}
      img {
        ${tw`w-[30px] h-[30px] absolute mt-0.5 ml-20`}
      }
    }
    .subText {
      ${tw`text-xl font-medium text-center text-[15px] p-1`}
      color: ${({ theme }) => theme.text20};
    }
  }
`

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
                <img src={'/img/assets/AppracialValueIcon.png'} alt="" />
                GFX Appraisal Value
              </h3>
              <img
                style={{ width: '420px', height: '320px' }}
                src={'/img/assets/GFXappraisalGraphic.png'}
                alt=""
              />
              <h3>Track NFT collections like never before!</h3>
              <div className="subText">
                Make the best decisions using the GFX Appraisal Value. Our model emphasizes executed sales data,
                not listing prices.
              </div>
            </div>
            <div className="slide">
              <h3>Unique Features!</h3>
              <img src={'/img/assets/uniqueFeaturesGraphic.png'} alt="" />
              <h3>Explore our Unique Features!</h3>
              <div className="subText">
                Make the best decisions using the GFX Appraisal Value. Our model emphasizes executed sales data,
                not listing prices.
              </div>
            </div>
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

export default NFTAggWelcome
