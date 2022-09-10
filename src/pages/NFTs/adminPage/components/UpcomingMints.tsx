import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { fetchAllNFTLaunchpadData } from '../../../../api/NFTLaunchpad'
import { useNavCollapse, useNFTAdmin } from '../../../../context'
import { GradientImageBorder } from './ReviewTable'
import { INFTProjectConfig } from '../../../../types/nft_launchpad'
import { formatTommddyyyy, getDateInArray } from '../../../../web3/nfts/utils'
import Slider from 'react-slick'

const WRAPPER = styled.div<{ $navCollapsed: boolean }>`
  min-height: 800px;
  background: #1f1f1f;
  width: 25vw;
  position: absolute;
  margin-top: calc(${({ $navCollapsed }) => ($navCollapsed ? '0px' : '80px')});
  height: 92vh;
  right: 0;
  top: 0;
  padding-left: 30px;
  .launchCard {
    margin-top: 20px;
    display: flex;
    img {
      width: 170px;
      height: 170px;
    }
    .launchDetails {
      margin-left: 10px;
      display: flex;
      flex-direction: column;
    }
    .launchTitle {
      font-weight: 700;
      font-size: 25px;
    }
    .launchTagline {
      font-weight: 600;
      font-size: 15px;
      color: #b5b5b5;
      width: 12vw;
      line-height: 20px;
    }
    .mintInfo {
      color: #b5b5b5;
    }
    .mintDetails {
      color: #eeeeee;
    }
    .mintRow {
      padding-top: 10px;
      font-weight: 600 !important;
      font-size: 16px;
    }
  }
  .dateSection {
    height: 20vh;
    min-height: 180px;
    padding-top: 10%;
    border-bottom: 2px solid #2d2d2d;
    .slick-slider {
      width: 90%;
    }
    .slick-prev {
      margin-top: -70px;
      margin-left: 75%;
      transform: scale(2);
    }
    .slick-next {
      margin-top: -70px;
      margin-right: 15%;
      transform: scale(2);
    }
    .day {
      margin-bottom: 10px;
    }
    .gradientBg {
      width: 32px;
      height: 32px;
      padding-left: 5px;
      padding-top: 2px;
      background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
      box-shadow: 0px 9px 13px rgba(15, 15, 15, 0.2);
      border-radius: 4px;
      color: white;
    }
    .date-row {
      font-weight: 600;
      font-size: 16px;
      color: #7d7d7d;
      margin-top: 10px;
      cursor: pointer;
    }
    .month-year {
      font-weight: 600;
      font-size: 30px;
    }
  }
  .upcomingTitle {
    display: flex;
    font-weight: 600;
    font-size: 25px;
    text-align: center;
    align-items: center;
    margin-top: 30px;
  }
  .listOfUpcomingMints {
    overflow-y: auto;
    height: 45vh;
    min-height: 400px;
    .rowContainer {
      display: flex;
      height: 100px;
      margin-top: 20px;
      cursor: pointer;
    }
    img {
      width: 80px;
      height: 80px;
      border-radius: 5px;
      margin-right: 20px;
    }

    .mintNamePrimary {
      font-weight: 600;
      font-size: 18px;
    }
    .mintNameSecondary {
      font-weight: 600;
      font-size: 14px;
      color: #b5b5b5;
    }
  }
`
const GRADIENT_TEXT = styled.span`
  background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  width: fit-content;
`
export const GradientText = ({
  text,
  fontSize,
  fontWeight
}: {
  text: string | number
  fontSize: number
  fontWeight: number
}) => (
  <GRADIENT_TEXT
    style={{
      fontSize: fontSize + 'px',
      fontWeight: fontWeight ? fontWeight : 600
    }}
  >
    {text}
  </GRADIENT_TEXT>
)

const settings = {
  dots: true,
  infinite: false,
  speed: 500,
  slidesToShow: 7,
  slidesToScroll: 6
}
const UpcomingMints = () => {
  const { isCollapsed } = useNavCollapse()
  const [upcomingMints, setUpcomingMints] = useState([])
  const [showMints, setShowMints] = useState([])
  const { update } = useNFTAdmin()
  const [selected, setSelected] = useState<INFTProjectConfig | undefined>(undefined)
  const [datesArr, setDatesArr] = useState<string[]>([])
  const [selectIndex, setSelectIndex] = useState<number | undefined>()
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const month = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]

  useEffect(() => {
    setDatesArr(getDateInArray())
    ;(async () => {
      const { data } = await fetchAllNFTLaunchpadData()
      const mints = data.data.filter((mint) => mint.ended === false)
      setUpcomingMints(mints)
      setShowMints(mints)
      setSelected(mints[0])
    })()
  }, [update])

  useEffect(() => {
    setShowMints(
      upcomingMints.filter(
        (mint: INFTProjectConfig) => mint.date === datesArr[selectIndex] && mint.ended === false
      )
    )
  }, [selectIndex])

  if (upcomingMints.length < 1)
    return (
      <WRAPPER $navCollapsed={isCollapsed}>
        <div className="upcomingTitle">
          <GradientText text={'No upcoming Mints'} fontSize={36} fontWeight={600} />
        </div>
      </WRAPPER>
    )
  return (
    <WRAPPER $navCollapsed={isCollapsed}>
      <div className="upcomingTitle">
        <span>
          <GradientText text={upcomingMints?.length + ''} fontSize={60} fontWeight={700} />{' '}
        </span>
        <span style={{ marginLeft: '15px' }}>
          <GradientText text={'Upcoming Mints'} fontSize={35} fontWeight={700} />{' '}
        </span>
      </div>

      <div className="launchCard">
        <GradientImageBorder img={selected?.coverUrl} height={150} width={150} />
        <div className="launchDetails">
          <div className="launchTitle">{selected?.collectionName}</div>
          <div className="launchTagline">{selected?.tagLine}</div>
          <div className="mintRow">
            <span className="mintInfo">Mint hour:</span> <span className="mintDetails">{selected?.time}</span>
          </div>
          <div className="mintRow">
            <span className="mintInfo">Mint price:</span> <span className="mintDetails">{selected?.price}</span>
          </div>
          <div className="mintRow">
            <span className="mintInfo">#items:</span> <span className="mintDetails">{selected?.items}</span>
          </div>
        </div>
      </div>
      <div className="dateSection">
        <div className="month-year">
          {month[new Date(formatTommddyyyy(datesArr[selectIndex ? selectIndex : 0])).getMonth()]}
          {` ` + datesArr[selectIndex ? selectIndex : 0].substring(6)}
        </div>
        <Slider {...settings}>
          {datesArr.map((date: any, index: number) => (
            <div className="date-row" key={index} onClick={() => setSelectIndex(index)}>
              <div className="day">{days[new Date(formatTommddyyyy(date)).getDay()]}</div>
              <div className={index === selectIndex ? 'gradientBg' : 'date'}>{date.substring(0, 2)}</div>
            </div>
          ))}
        </Slider>
      </div>
      <div className="listOfUpcomingMints">
        {showMints.map((mint: INFTProjectConfig, index: number) => (
          <div className="rowContainer" key={index} onClick={() => setSelected(mint)}>
            <img src={mint?.coverUrl} className="" alt="img" />
            <div>
              <div className="mintNamePrimary">{mint?.collectionName}</div>
              <div className="mintNameSecondary">{mint?.collectionName}</div>
              <div className="mintNameSecondary">{mint?.time}</div>
            </div>
          </div>
        ))}
      </div>
    </WRAPPER>
  )
}

export default UpcomingMints
