import React, { useState, useEffect } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import styled from 'styled-components'
import { mockSliderData } from './mockData'
import { MainButton } from '../../../components/MainButton'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'

const CAROUSEL_WRAPPER = styled.div`
  padding: 0 ${({ theme }) => theme.margin(4)};
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
    top: calc(50% - 56px);
    left: 25px;
    transform: rotate(180deg);
  }
  .slick-next {
    right: 25px;
  }

  .slick-slide {
    min-width: 630px;
  }
`
const SLIDER_ITEM = styled.div`
  margin-right: ${({ theme }) => theme.margin(4)};
  position: relative;
  width: 40%;
  .home-slider-image {
    border-radius: 10px;
    height: 360px;
    width: auto;
  }
  .home-slider-content {
    width: 58%;
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

const settings = {
  infinite: false,
  speed: 500,
  swipeToSlide: true,
  slidesToScroll: 1,
  snapCenter: true,
  initialSlide: 0,
  arrows: true,
  variableWidth: true,
  nextArrow: <img src={`${process.env.PUBLIC_URL}/img/assets/home-slider-next.svg`} alt="" />,
  prevArrow: <img src={`${process.env.PUBLIC_URL}/img/assets/home-slider-next.svg`} alt="" />
}

export const NFTHomeSlider = () => {
  const [isSlideData, setIsSlideData] = useState(false)
  useEffect(() => {
    setTimeout(() => {
      setIsSlideData(true)
    }, 1000)
  }, [])
  return (
    <CAROUSEL_WRAPPER>
      <Slider {...settings}>
        {!isSlideData
          ? [0, 1, 2].map((item, i) => (
              <SLIDER_ITEM key={i}>
                <SkeletonCommon width="639px" height="360px" borderRadius="10px" />
              </SLIDER_ITEM>
            ))
          : mockSliderData.map((item, i) => (
              <SLIDER_ITEM key={i}>
                <img
                  className="home-slider-image"
                  src={`${process.env.PUBLIC_URL}/img/assets/home-slider-${i % 2 === 0 ? 1 : 2}.png`}
                  alt=""
                />
                <div className="home-slider-content">
                  <h1 className="home-slider-title">{item?.title}</h1>
                  {item?.desc && <div className="home-slider-desc">{item?.desc}</div>}
                  <MainButton className="home-slider-button" height={'40px'} status="action" width={'141px'}>
                    <span>{item?.type}</span>
                  </MainButton>
                </div>
              </SLIDER_ITEM>
            ))}
      </Slider>
    </CAROUSEL_WRAPPER>
  )
}
