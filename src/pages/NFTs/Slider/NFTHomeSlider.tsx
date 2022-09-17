import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { MainButton } from '../../../components/MainButton'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { checkMobile } from '../../../utils'
import tw from 'twin.macro'
import { CreatorsLanding } from '../launchpad/pages/CreatorsLanding'

//#region styles
const CAROUSEL_WRAPPER = styled.div`
  ${tw`sm:px-0`}
  position: relative;
  padding-left: ${({ theme }) => theme.margin(4)};

  .fade {
    position: absolute;
    top: 0;
    right: 0;
    height: 99%;
    width: 180px;
    background: ${({ theme }) => theme.fade};
  }
  .slick-prev,
  .slick-next {
    width: 65px;
    height: 65px;
    z-index: 2;

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
    min-width: 630px;

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
  height: 37vh;
  min-height: 350px;
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
    width: 100%;
    text-align: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .home-slider-title {
      font-size: 40px;
      font-weight: 600;
      color: #fff;
      line-height: 48px;
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
  initialSlide: 0,
  arrows: true,
  variableWidth: checkMobile() ? false : true,
  nextArrow: <img src={`${process.env.PUBLIC_URL}/img/assets/home-slider-next.svg`} alt="banner-next" />,
  prevArrow: <img src={`${process.env.PUBLIC_URL}/img/assets/home-slider-next.svg`} alt="banner-previous" />
}

export const NFTHomeSlider = () => {
  const [modal, showModal] = useState(false)

  const handleCreatorApply = () => {
    showModal(true)
  }
  const history = useHistory()
  const goNestQuestSingleListing = () => history.push(`/NFTs/NestQuest`)

  return (
    <>
      <CAROUSEL_WRAPPER>
        {modal && <CreatorsLanding showModal={showModal} />}
        <Slider {...settings}>
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
                height={'40px'}
                status="action"
                width={'141px'}
                onClick={goNestQuestSingleListing}
              >
                <span>Mint Now</span>
              </ORANGE_BTN>
            </div>
          </SLIDER_ITEM>
          <SLIDER_ITEM $url={`${process.env.PUBLIC_URL}/img/assets/become-a-creator.webp`}>
            <div className="home-slider-content">
              <h1 className="home-slider-title">Launch</h1>
              <h1 className="home-slider-title">Your Collection</h1>
              <TERTIERY_BTN
                className="home-slider-button"
                height={'40px'}
                status="action"
                width={'141px'}
                onClick={handleCreatorApply}
              >
                <span>Apply</span>
              </TERTIERY_BTN>
            </div>
          </SLIDER_ITEM>
          <SLIDER_ITEM $url={`${process.env.PUBLIC_URL}/img/assets/upcoming_features.webp`}></SLIDER_ITEM>
        </Slider>
        <div className="fade"></div>
      </CAROUSEL_WRAPPER>
    </>
  )
}
