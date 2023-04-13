/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import { MainButton } from '../../../components/MainButton'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { checkMobile } from '../../../utils'
import styled, { css } from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { CreatorsLanding } from '../launchpad/pages/CreatorsLanding'

//#region styles
const CAROUSEL_WRAPPER = styled.div<{ showBanner: boolean }>`
  ${({ showBanner }) => css`
    ${tw`sm:px-0  ml-1 relative duration-500 pl-[20px] `}
    margin-top: ${showBanner ? '20px' : '0px'};
    height: ${showBanner ? 'fit-cotent' : '0px'};
    visibility: ${showBanner ? 'visible' : 'hidden'};
    opacity: ${showBanner ? 1 : 0};
  `}

  .fade {
    ${tw`absolute w-[180px] top-0 right-0`}
    height: 99%;
    background: ${({ theme }) => theme.fade};
  }
  .slick-prev,
  .slick-next {
    ${tw`w-[30px] h-[30px] z-10`}
    &.slick-disabled {
      opacity: 0;
    }
  }

  .slick-prev {
    ${tw`sm:left-1`}
    top: calc(50% - 25px);
    left: 25px;
    transform: rotate(180deg);
  }
  .slick-next {
    ${tw`sm:right-1`}
    right: 25px;
  }

  .slick-slide {
    margin-right: 40px;
  }
`

const SLIDER_ITEM = styled.div<{ $url: string; $bg?: boolean }>`
  @media (max-width: 500px) {
    background: ${({ $url }) => `url(${$url})`}, center;
    background-size: auto 101%;
    background-position: center;
  }
  ${tw`sm:rounded-average relative flex items-center rounded-[10px]  h-[182px] justify-center`}
  width: 365px !important;
  background: ${({ $url }) => `url(${$url})`}, center;
  background-size: ${({ $bg }) => ($bg ? '' : 'auto 115%')};
  background-position: center;
  background-repeat: no-repeat;

  .home-slider-image {
    border-radius: 10px;
    height: 100%;
    width: auto;
  }

  .logo {
    width: 84px;
    height: 77px;
  }
  .logoCenter {
    ${tw`w-[52px] h-[48px] ml-[40px]`}
  }
  .launchpad {
    ${tw`text-[17px] font-bold text-white mt-2`}
  }

  .home-slider-content {
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .home-slider-title {
      font-size: 20px;
      font-weight: 600;
      color: #fff;
      line-height: 24px;
      margin: 0;
      & + .home-slider-button {
        margin-top: ${({ theme }) => theme.margin(5)};
      }
    }

    .home-slider-desc {
      font-size: 14px;
      font-weight: 600;
      line-height: 17px;
      color: #fff;
      margin-top: ${({ theme }) => theme.margin(2)};
    }

    .home-slider-button {
      margin: ${({ theme }) => theme.margin(2)} auto 0;
    }
  }
`

const ORANGE_BTN = styled(MainButton)`
  background: linear-gradient(270deg, #dc1fff 0%, #f7931a 106.38%);
`

const EXPLORE_BTN = styled(MainButton)`
  background: white;
  span {
    ${tw`text-[15px] font-semibold text-[#00A5A1] `}
  }
`

const TERTIERY_BTN = styled(MainButton)`
  background: ${({ theme }) => theme.primary3} !important;
`
//#endregion

const settings = {
  infinite: false,
  speed: 500,
  swipeToSlide: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  snapCenter: true,
  initialSlide: 0,
  arrows: true,
  variableWidth: checkMobile() ? false : true,
  nextArrow: <img src={`/img/assets/Aggregator/home-slider-next.svg`} alt="banner-next" />,
  prevArrow: <img src={`/img/assets/Aggregator/home-slider-next.svg`} alt="banner-previous" />
}

export const NFTBanners = ({ showBanner }: any) => {
  const [modal, showModal] = useState(false)

  const handleCreatorApply = () => {
    showModal(true)
  }
  const history = useHistory()
  const goNestQuestSingleListing = () => history.push(`/NFTs/NestQuest`)
  return (
    <>
      <CAROUSEL_WRAPPER showBanner={showBanner}>
        {modal && <CreatorsLanding showModal={showModal} />}
        <Slider {...settings}>
          <SLIDER_ITEM $url={`${process.env.PUBLIC_URL}/img/assets/DailySaleCollectionsBanner.png`} />

          <SLIDER_ITEM $url={`${process.env.PUBLIC_URL}/img/assets/NestQuest.png`}>
            <div className="home-slider-content">
              <h1 className="home-slider-title" style={{ visibility: 'hidden' }}>
                NestQuest
              </h1>
              <h1 className="home-slider-title" style={{ visibility: 'hidden' }}>
                Tier #1
              </h1>
              <ORANGE_BTN
                className="home-slider-button"
                height={'30px'}
                status="action"
                width={'140px'}
                onClick={goNestQuestSingleListing}
              >
                <span>Mint</span>
              </ORANGE_BTN>
            </div>
          </SLIDER_ITEM>

          <SLIDER_ITEM $url={`${process.env.PUBLIC_URL}/img/assets/become-a-creator.webp`}>
            <div className="home-slider-content">
              <h1 className="home-slider-title">Launch</h1>
              <h1 className="home-slider-title">Your Collection</h1>
              <TERTIERY_BTN
                className="home-slider-button"
                height={'30px'}
                status="action"
                width={'140px'}
                onClick={handleCreatorApply}
              >
                <span>More info</span>
              </TERTIERY_BTN>
            </div>
          </SLIDER_ITEM>
          <SLIDER_ITEM $bg={true} $url={`${process.env.PUBLIC_URL}/img/assets/multiChainBg.png`}>
            <div className="home-slider-content">
              <h1 className="home-slider-title">
                <div className="logoCenter">
                  <img
                    tw="rounded-[10px]"
                    style={{ width: 52, height: 48 }}
                    src={`${process.env.PUBLIC_URL}/img/assets/multiChainLogo.png`}
                    alt=""
                  />
                </div>
              </h1>
              <div className="launchpad">Launchpad</div>
              {/* <h1 className="home-slider-title">View Live Mints</h1> */}
              <EXPLORE_BTN
                className="home-slider-button"
                height={'40px'}
                status="action"
                width={'140px'}
                onClick={handleCreatorApply}
              >
                <span>Explore</span>
              </EXPLORE_BTN>
            </div>
          </SLIDER_ITEM>
          {/* <SLIDER_ITEM $url={`${process.env.PUBLIC_URL}/img/assets/MultichainBanner.svg`}></SLIDER_ITEM> */}
        </Slider>
        <div className="fade"></div>
      </CAROUSEL_WRAPPER>
    </>
  )
}

export default NFTBanners
