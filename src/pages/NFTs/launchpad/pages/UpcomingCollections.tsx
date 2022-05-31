import React, { useState, useEffect, FC } from 'react'
import axios from 'axios'
import Slider from 'react-slick'
import styled, { css } from 'styled-components'
import { Row, Card } from 'antd'
import { theme } from '../../../../theme'
import { SkeletonCommon } from '../../Skeleton/SkeletonCommon'
import { useNFTLaunchpad } from '../../../../context/nft_launchpad'

const CAROUSEL_WRAPPER = styled.div`
  position: relative;
  margin-left: -25px;
  width: 100% !important;
  height: 100%;
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
    width: 45px;
    height: 45px;
    z-index: 2;

    &.slick-disabled {
      opacity: 0;
    }
  }

  .slick-prev {
    top: calc(50% - 38px);
    left: 25px;
    transform: rotate(180deg);
  }
  .slick-next {
    right: 0px;
  }
  .slick-list {
    height: 100%;
    display: flex;
    flex-direction: column;
    border-radius: 15px;
    justify-content: center;
    padding-left: ${({ theme }) => theme.margin(2)};
    padding-right: ${({ theme }) => theme.margin(2)};
  }
  .slick-slider {
    height: 100%;
  }

  .slick-slide {
    margin-right: ${({ theme }) => theme.margin(3)};
  }
`
const NFT_CONTAINER = styled.div`
  opacity: 0.8;
  .slick-slide slick-active {
    border: 12px solid green;
    height: 200px;
  }

  .slick-slide img {
    height: 200px;
  }
`

const UPCOMING_TEXT = styled.div`
  font-weight: 700;
  font-size: 30px;
  margin-top: 100px;
  margin-bottom: 40px;
`

const NFT_TITLE = styled.div`
  font-weight: 600;
  font-size: 22px !important;
`
const NFT_INFO = styled.div`
  font-weight: 600;
  font-size: 18px !important;
`
const SLIDER_ITEM = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
  .sweep-card.failed {
    opacity: 0.5;
  }
  .sweep-card {
    border: none;
    .nft-img {
      border-radius: 15px;
      padding-bottom: 0px;
      width: 460px !important;
      height: 460px;
    }
    .ant-card-body {
      text-align: center;
      height: 50px;
      .sweep-price {
        margin-right: 15px;
      }
    }
  }
`
const FLEX = styled.div`
  display: flex;
  margin: 24px;
  .space {
    margin-right: 24px;
  }
`

const NFT_META = styled.div`
  position: absolute;
  width: 460px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100px;
  padding: ${({ theme }) => theme.margin(3)};
  background: linear-gradient(68.66deg, rgba(255, 255, 255, 0.1) 21.47%, rgba(255, 255, 255, 0.015) 102.44%);
  backdrop-filter: blur(50px);
  border-radius: 15px 10px 10px 15px;
  bottom: 0px;
  .flex {
    display: flex;
    justify-content: space-between;
  }
`

const UpcomingCollectins: FC = () => {
  const loading = [1, 2, 3, 4]

  const settings = {
    infinite: false,
    speed: 500,
    swipeToSlide: true,
    slidesToScroll: 2,
    snapCenter: true,
    initialSlide: 0,
    slidesToShow: 3,
    arrows: true,
    variableWidth: true,
    nextArrow: <img src={`${process.env.PUBLIC_URL}/img/assets/home-slider-next.svg`} alt="banner-next" />,
    prevArrow: <img src={`${process.env.PUBLIC_URL}/img/assets/home-slider-next.svg`} alt="banner-previous" />
  }
  const { upcomoingNFTProjects } = useNFTLaunchpad()
  const [upcomingList, setUpcomingList] = useState([])
  useEffect(() => {
    setUpcomingList(upcomoingNFTProjects)
  }, [upcomoingNFTProjects])

  const getNftPrice = () => {
    return '02 SOL'
  }
  const getRemaningTime = (): string => {
    return '02h 30m 45s'
  }
  return (
    <>
      <UPCOMING_TEXT>Upcoming</UPCOMING_TEXT>
      {upcomingList.length > 0 ? (
        <>
          <Row justify="center" align="middle" className="imageRow">
            <CAROUSEL_WRAPPER>
              <Slider {...settings}>
                {upcomingList.map((item, index) => {
                  return (
                    <SLIDER_ITEM>
                      <Card
                        cover={
                          <>
                            <img className="nft-img" src={item.coverUrl} alt="NFT" />
                            <NFT_META>
                              <span className="flex">
                                <NFT_TITLE> {item.nft_name}</NFT_TITLE>
                                <NFT_TITLE> Items 10,000</NFT_TITLE>
                              </span>
                              <span className="flex">
                                <NFT_INFO> {getRemaningTime()}</NFT_INFO>
                                <NFT_INFO> {getNftPrice()}</NFT_INFO>
                              </span>
                            </NFT_META>
                          </>
                        }
                        className="sweep-card"
                      ></Card>
                    </SLIDER_ITEM>
                  )
                })}
              </Slider>
            </CAROUSEL_WRAPPER>
          </Row>{' '}
        </>
      ) : (
        <>
          <FLEX>
            {loading.map(() => {
              return (
                <div className="space">
                  <SkeletonCommon width="460px" height="460px" borderRadius="15px" />
                </div>
              )
            })}
          </FLEX>
        </>
      )}
    </>
  )
}

export default UpcomingCollectins
