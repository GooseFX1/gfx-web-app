/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled, { css } from 'styled-components'
import { MainButton } from '../../../components/MainButton'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { checkMobile } from '../../../utils'
import tw from 'twin.macro'
import { CreatorsLanding } from '../launchpad/pages/CreatorsLanding'

//#region styles
const CAROUSEL_WRAPPER = styled.div<{ showBanner: boolean }>`
  ${({ showBanner }) => css`
    ${tw`sm:px-0  ml-1 relative duration-500 pl-8 `}
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
    ${tw`w-[65px] h-[65px] z-10`}
    &.slick-disabled {
      opacity: 0;
    }
  }

  .slick-prev {
    ${tw`sm:left-1`}
    top: calc(50% - 56px);
    left: 25px;
    transform: rotate(180deg);
  }
  .slick-next {
    ${tw`sm:right-1`}
    right: 25px;
  }

  .slick-slide {
    margin-right: ${({ theme }) => theme.margin(2)};
    width: 450px;

    @media (max-width: 500px) {
      min-width: 275px;
      width: 32% !important;
      margin-right: 1%;
    }
  }
`

const SLIDER_ITEM = styled.div<{ $url: string }>`
  @media (max-width: 500px) {
    background: ${({ $url }) => `url(${$url})`}, center;
    background-size: auto 101%;
    background-position: center;
  }
  ${tw`sm:rounded-average`}
  position: relative;
  width: 370px !important ;
  min-height: 190px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${({ $url }) => `url(${$url})`}, center;
  background-size: auto 101%;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 20px;

  .home-slider-image {
    border-radius: 10px;
    height: 100%;
    width: auto;
  }

  .home-slider-content {
    /* width: 100%; */
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

const TERTIERY_BTN = styled(MainButton)`
  background: ${({ theme }) => theme.primary3} !important;
`
//#endregion

const settings = {
  infinite: false,
  speed: 500,
  swipeToSlide: true,
  slidesToScroll: 1,
  snapCenter: true,
  slidesToShow: 3,
  initialSlide: 0,
  arrows: true,
  variableWidth: checkMobile() ? false : true,
  nextArrow: <img src={`${process.env.PUBLIC_URL}/img/assets/home-slider-next.svg`} alt="banner-next" />
  //prevArrow: <img src={`${process.env.PUBLIC_URL}/img/assets/home-slider-next.svg`} alt="banner-previous" />
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
          <SLIDER_ITEM $url={`${process.env.PUBLIC_URL}/img/assets/DailySaleCollectionsBanner.svg`}></SLIDER_ITEM>

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
          <SLIDER_ITEM $url={`${process.env.PUBLIC_URL}/img/assets/MultichainBanner.svg`}></SLIDER_ITEM>
        </Slider>
        <div className="fade"></div>
      </CAROUSEL_WRAPPER>
    </>
  )
}

// const NFTBanners: FC<{ showBanner: boolean }> = ({ showBanner }) => {
//   console.log(showBanner)

//   return (
//     <>
//       <BANNER_CONTAINER className={showBanner ? 'showBanner' : 'closeBanner'} showBanner={showBanner}>
//         <BANNER showBanner={showBanner} >
//           <img src={'/img/assets/Daily sale collections banner.svg'} alt="" />
//         </BANNER>
//         <BANNER showBanner={showBanner} >
//           <img src={'/img/assets/Launch your collection.svg'} alt="" />
//         </BANNER>
//         <BANNER showBanner={showBanner} >
//           <img src={'/img/assets/NestQuest Banner.svg'} alt="" />
//         </BANNER>
//         <BANNER showBanner={showBanner} >
//           <img src={'/img/assets/Multichain banner.svg'} alt="" />
//         </BANNER>

//       </BANNER_CONTAINER>
//     </>
//   )
// }

export default NFTBanners
