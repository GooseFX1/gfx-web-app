import React, { useState, useEffect, FC } from 'react'
import Slider from 'react-slick'
import styled from 'styled-components'
import { Row, Card } from 'antd'
import { useHistory } from 'react-router-dom'
import { SkeletonCommon } from '../../Skeleton/SkeletonCommon'
import { useNFTLaunchpad } from '../../../../context/nft_launchpad'
import { GetNftPrice } from './FeaturedLaunch'
import { useUSDCToggle } from '../../../../context/nft_launchpad'

const CAROUSEL_WRAPPER = styled.div`
  position: relative;
  width: 100% !important;
  height: 100%;
  margin-left: -40px;
  margin-bottom: 40px;
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
    .sold-out {
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

  .slick-track {
    width: 100% !important;
  }

  .slick-slide {
    margin-right: ${({ theme }) => theme.margin(3)};
  }
`

const ENDED_TEXT = styled.div`
  margin-top: 150px;
  font-weight: 700;
  font-size: 30px;
  color: ${({ theme }) => theme.text7};
  margin-bottom: 40px;
`

const NFT_INFO = styled.div`
  font-weight: 600;
  line-height: 22px;
  font-size: 18px !important;
  margin-bottom: 10px;
`
const SLIDER_ITEM = styled.div`
  position: relative;
  display: flex;
  cursor: pointer;
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
      opacity: 0.4;
      width: 300px !important;
      height: 300px;
    }
    .ant-card-body {
      text-align: center;
      height: 50px;
      .sweep-price {
        margin-right: 15px;
      }
      .sweeper-solana-logo {
        height: 10px;
        width: 10px;
        display: inline-block;
        position: absolute;
        right: 15px;
      }
    }
  }
  .sweep-nft-name {
    text-align: center;
    font-size: 15px;
    font-weight: 600;
    margin-top: 15px;
    color: ${({ theme }) => theme.text7};
  }
  .nft-sweep-success {
    display: flex;
    justify-content: center;
    margin-top: 10px;
    .successIcon {
      width: 35px;
      height: 35px;
    }
  }
  .nft-sweep-fail {
    color: red;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
  }
`

export const NFT_SOLD = styled.div`
  position: absolute;
  width: 300px;
  height: 100%;
  padding-top: 45%;
  align-items: center;
  display: flex;
  flex-direction: column;
  bottom: 0px;

  .collection-name {
    font-weight: 600;
    font-size: 25px;
    line-height: 30px;
  }
  .sold-text {
    font-weight: 700;
    margin-top: 10px;
    font-size: 20px;
    line-height: 24px;
    text-align: center;
  }
`
const NFT_META = styled.div`
  position: absolute;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 87px;
  background: linear-gradient(68.66deg, rgba(255, 255, 255, 0.1) 21.47%, rgba(255, 255, 255, 0.015) 102.44%);
  backdrop-filter: blur(60px);
  border-radius: 15px 10px 10px 15px;
  bottom: 0px;
  .column {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 12px;
  }
`

const EndedCollections: FC = () => {
  const settings = {
    infinite: false,
    speed: 500,
    swipeToSlide: true,
    slidesToScroll: 2,
    snapCenter: true,
    initialSlide: 0,
    slidesToShow: 3,
    arrows: false,
    variableWidth: true,
    nextArrow: <img src={`${process.env.PUBLIC_URL}/img/assets/home-slider-next.svg`} alt="banner-next" />,
    prevArrow: <img src={`${process.env.PUBLIC_URL}/img/assets/home-slider-next.svg`} alt="banner-previous" />
  }
  const loading = [1, 2, 3, 4, 5]
  const [endedList, setEndedList] = useState([])
  const { endedNFTProjects, dataFetched } = useNFTLaunchpad()
  const history = useHistory()
  const { isUSDC } = useUSDCToggle()
  useEffect(() => {
    setEndedList(
      isUSDC
        ? endedNFTProjects.filter((data) => data.currency === 'USDC')
        : endedNFTProjects.filter((data) => data.currency === 'SOL')
    )
  }, [endedNFTProjects, isUSDC])
  const FLEX = styled.div`
    display: flex;
    margin: 24px;
    .space {
      margin-right: 24px;
    }
  `
  return (
    <>
      {!dataFetched ? (
        <>
          <FLEX>
            {loading.map((_, key) => (
              <div className="space" key={key}>
                <SkeletonCommon width="460px" height="460px" borderRadius="15px" />
              </div>
            ))}
          </FLEX>
        </>
      ) : (
        <></>
      )}
      {endedList && endedList.length > 0 ? (
        <>
          <ENDED_TEXT>Ended</ENDED_TEXT>
          {endedList.length > 0 ? (
            <>
              <Row justify="center" align="middle" className="imageRow">
                <CAROUSEL_WRAPPER>
                  <Slider {...settings}>
                    {endedList.map((item, index) => (
                      <SLIDER_ITEM key={index} onClick={() => history.push(`/NFTs/launchpad/${item?.urlName}`)}>
                        <Card
                          cover={
                            <>
                              <img className="nft-img" src={item.coverUrl} alt="NFT" />
                              <NFT_SOLD>
                                <div className="collection-name">{item?.collectionName}</div>
                                <div className="sold-text">SOLD OUT</div>
                              </NFT_SOLD>
                              <NFT_META>
                                <span className="column">
                                  <NFT_INFO> Items {item?.items} </NFT_INFO>
                                  <NFT_INFO>
                                    <GetNftPrice item={item} />
                                  </NFT_INFO>
                                </span>
                              </NFT_META>
                            </>
                          }
                          className="sweep-card"
                        ></Card>
                      </SLIDER_ITEM>
                    ))}
                  </Slider>
                </CAROUSEL_WRAPPER>
              </Row>
            </>
          ) : (
            <FLEX>
              {loading.map((_, key) => (
                <div className="space" key={key}>
                  <SkeletonCommon width="300px" height="300px" borderRadius="15px" />
                </div>
              ))}
            </FLEX>
          )}
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default EndedCollections
