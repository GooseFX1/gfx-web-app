import React, { useState, useEffect, FC } from 'react'
import Slider from 'react-slick'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'
import { Row, Card } from 'antd'
import { SkeletonCommon } from '../../Skeleton/SkeletonCommon'
import { useNFTLaunchpad } from '../../../../context/nft_launchpad'
import { GetNftPrice } from './FeaturedLaunch'
import { useUSDCToggle } from '../../../../context/nft_launchpad'

const CAROUSEL_WRAPPER = styled.div`
  position: relative;
  cursor: pointer;
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
  cursor: pointer;
  display: flex;
  justify-content: space-between;
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
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
  }
`
const PRICE_DISPLAY = styled.div`
  display: flex;
`

export const getNftPrice = (item) => (
  <PRICE_DISPLAY>
    {`${item?.price} `}
    <img
      style={{ margin: '0px 10px', width: '25px', height: '25px' }}
      src={`/img/crypto/${item?.currency}.svg`}
      alt="price"
    />
    {` ${item?.currency}`}
  </PRICE_DISPLAY>
)

const UpcomingCollectins: FC = () => {
  const loading = [1, 2, 3, 4]
  const history = useHistory()

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
  const { upcomoingNFTProjects, dataFetched } = useNFTLaunchpad()
  const [upcomingList, setUpcomingList] = useState([])
  const { isUSDC } = useUSDCToggle()
  const [, setIsLoading] = useState(true)

  useEffect(() => {
    setUpcomingList(
      isUSDC
        ? upcomoingNFTProjects.filter((data) => data.currency === 'USDC')
        : upcomoingNFTProjects.filter((data) => data.currency === 'SOL')
    )
    setIsLoading(false)
  }, [upcomoingNFTProjects, isUSDC])

  const getRemaningTime = (item): string => {
    const startsOn = parseFloat(item.startsOn)
    const timeDiffrence = startsOn - Date.now()
    const seconds = Number(timeDiffrence / 1000)
    const d = Math.floor(seconds / (3600 * 24))
    const h = Math.floor((seconds % (3600 * 24)) / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = Math.floor(seconds % 60)

    const dDisplay = d > 0 ? d + (d === 1 ? ' d ' : ' d ') : ''
    const hDisplay = h > 0 ? h + (h === 1 ? ' h ' : ' h ') : ''
    const mDisplay = m > 0 ? m + (m === 1 ? ' m ' : ' m ') : ''
    const sDisplay = s > 0 ? s + (s === 1 ? ' s ' : ' s') : ''
    return d > 1 ? dDisplay + hDisplay + mDisplay : hDisplay + mDisplay + sDisplay
  }

  return (
    <>
      {!dataFetched ? (
        <>
          <FLEX>
            {loading.map((n) => (
              <div className="space" key={n}>
                <SkeletonCommon width="460px" height="460px" borderRadius="15px" />
              </div>
            ))}
          </FLEX>
        </>
      ) : (
        <></>
      )}
      {upcomingList.length > 0 ? (
        <>
          <UPCOMING_TEXT>Upcoming</UPCOMING_TEXT>
          <Row justify="start" align="middle" className="imageRow">
            <CAROUSEL_WRAPPER>
              <Slider {...settings}>
                {upcomingList.map((item, index) => (
                  <SLIDER_ITEM key={index} onClick={() => history.push(`/NFTs/launchpad/${item?.urlName}`)}>
                    <Card
                      cover={
                        <>
                          <img className="nft-img" src={item.coverUrl} alt="NFT" />
                          <NFT_META>
                            <span className="flex">
                              <NFT_TITLE> {item?.collectionName}</NFT_TITLE>
                              <NFT_TITLE> {`Items ${item?.items}`}</NFT_TITLE>
                            </span>
                            <span className="flex">
                              <NFT_INFO> {getRemaningTime(item)}</NFT_INFO>
                              <NFT_INFO>
                                {' '}
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
          </Row>{' '}
        </>
      ) : (
        <></>
      )}
    </>
  )
}

export default UpcomingCollectins
