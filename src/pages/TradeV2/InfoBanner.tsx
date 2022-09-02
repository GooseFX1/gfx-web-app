import { Skeleton } from 'antd'
import React, { FC, useState, useMemo } from 'react'
import styled from 'styled-components'
import { useCrypto, usePriceFeed } from '../../context'
import { DropdownPairs } from './DropdownPairs'

const INFO_WRAPPER = styled.div`
  padding: 0px 30px;
  display: flex;
  .spot-toggle .perps {
    cursor: not-allowed;
  }
  .spot-toggle .spot {
    cursor: pointer;
  }
  .spot-toggle .selected {
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    color: white !important;
    border: 1px solid black;
  }
  .spot-toggle .toggle {
    border-radius: 36px;
    height: 40px;
    line-height: 40px;
    vertical-align: middle;
    width: 90px;
    display: inline-block;
    text-align: center;
    font-size: 16px;
    color: ${({ theme }) => theme.text16};
    border: none;
  }
`
const INFO_STATS = styled.div`
  margin-left: 30px;
  line-height: 20px;
  div:first-child {
    font-size: 15px;
    font-weight: 500;
    color: ${({ theme }) => theme.text22};
  }
  div:nth-child(2) {
    color: ${({ theme }) => theme.text21};
    font-size: 15px;
    font-weight: 600;
    text-align: center;
    display: flex;
    span:nth-child(2) {
      display: flex;
      align-items: center;
      margin-left: 10px;
      margin-right: 10px;
      .verticalLines {
        height: 12px;
        width: 3px;
        margin-left: 3px;
      }
      .coloured {
        background: linear-gradient(88.42deg, #f7931a 4.59%, #e649ae 98.77%);
      }
      .grey {
        background-color: #2a2a2a;
      }
    }
  }
`

const REFRESH_DATA = styled.div`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: #5855ff;
  text-align: center;
  cursor: pointer;
  img {
    height: 15px;
    width: 15px;
    position: relative;
    top: 6px;
  }
`

const LOCK_LAYOUT = styled.div<{ $isLocked: boolean }>`
  line-height: 40px;
  width: 65px;
  background-color: ${({ theme }) => theme.bg3};
  background: ${({ $isLocked }) =>
    $isLocked ? '' : 'linear-gradient(90deg, rgba(247, 147, 26, 0.3) 12.88%, rgba(220, 31, 255, 0.3) 100%)'};
  margin-left: 20px;
  border-radius: 36px;
  text-align: center;
  cursor: pointer;
  img {
    position: relative;
    bottom: 2px;
  }
`

const FEES_BTN = styled.div`
  margin-left: auto;
  width: 88px;
  height: 40px;
  border: 1px solid pink;
  background: #2a2a2a;
  border-radius: 36px;
  margin-right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

const RESET_LAYOUT_BUTTON = styled.div`
  cursor: pointer;
  background-color: ${({ theme }) => theme.bg9};
  height: 40px;
  padding: 10px 20px;
  margin-left: 20px;
  border-radius: 36px;
  color: ${({ theme }) => theme.text4};
`

const Loader: FC = () => {
  return <Skeleton.Button active size="small" style={{ display: 'flex', height: '12px' }} />
}

export const InfoBanner: FC<{
  isLocked: boolean
  setIsLocked: Function
  resetLayout: Function
  setFeesPopup: Function
}> = ({ isLocked, setIsLocked, resetLayout, setFeesPopup }) => {
  const [isSpot, setIsSpot] = useState(true)
  const { selectedCrypto } = useCrypto()
  const { prices, tokenInfo, refreshTokenData } = usePriceFeed()
  const marketData = useMemo(() => prices[selectedCrypto.pair], [prices, selectedCrypto.pair])
  const tokenInfos = useMemo(() => tokenInfo[selectedCrypto.pair], [tokenInfo[selectedCrypto.pair]])
  const formatDisplayVolume = (volume) => {
    if (!volume) return null
    const stringLength = volume.length
    if (stringLength < 6) return volume
    else {
      const [numberBeforeDecimal, numberAfterDecimal] = volume.split('.'),
        reverseNumber = numberBeforeDecimal.split('').reverse().join('')
      let answer = ''
      for (let i = 0; i < reverseNumber.length; i++) {
        answer += reverseNumber.substring(i, i + 1)
        if (i % 3 === 2 && i !== reverseNumber.length - 1) answer = answer + ','
      }
      const reversedResult = answer.split('').reverse().join('')
      return reversedResult + '.' + numberAfterDecimal
    }
  }

  const calculateRangeValue = (range, marketData) => {
    if (!range || !range.min || !range.max || !marketData || !marketData.current) return { bars: 0 }
    const difference = +range.max - +range.min,
      size = difference / 6,
      price = marketData.current
    let bars = 0

    for (let i = 0; i < 6; i++) {
      if (price < +range.min + size * (i + 1)) {
        bars = i
        break
      }
    }
    return bars
  }

  const volume = tokenInfos && tokenInfos.volume
  const displayVolume = useMemo(() => formatDisplayVolume(volume), [selectedCrypto.pair, volume])

  const range = tokenInfos && tokenInfos.range,
    bars = useMemo(() => calculateRangeValue(range, marketData), [selectedCrypto.pair, range])

  const changeValue = tokenInfos ? tokenInfos.change : ' '
  let classNameChange = ''
  if (changeValue && changeValue.substring(0, 1) === '-') classNameChange = 'down24h'
  else if (changeValue && changeValue.substring(0, 1) === '+') classNameChange = 'up24h'

  const handleToggle = (e) => {
    if (e === 'spot') setIsSpot(true)
    //else setIsSpot(false)
    //Disabling perps for now
  }

  return (
    <INFO_WRAPPER>
      <div className="spot-toggle">
        <span className={'spot toggle ' + (isSpot ? 'selected' : '')} key="spot" onClick={() => handleToggle('spot')}>
          Spot
        </span>
        <span
          className={'perps toggle ' + (!isSpot ? 'selected' : '')}
          key="perps"
          onClick={() => handleToggle('perps')}
        >
          Perps
        </span>
      </div>
      <DropdownPairs />
      <INFO_STATS>
        <>
          <div>Price</div>
          {!marketData || !marketData.current ? <Loader /> : <div>$ {marketData.current}</div>}
        </>
      </INFO_STATS>
      <INFO_STATS>
        <>
          <div>24hr Volume</div>
          {!displayVolume ? <Loader /> : <div>$ {displayVolume}</div>}
        </>
      </INFO_STATS>
      <INFO_STATS>
        <>
          <div>24hr Change</div>
          {!changeValue ? <Loader /> : <div className={classNameChange}>{changeValue} %</div>}
        </>
      </INFO_STATS>
      <INFO_STATS>
        <div>Daily Range</div>
        {!range ? (
          <Loader />
        ) : (
          <div>
            <span>$ {range.min}</span>
            <span>
              {[0, 1, 2, 3, 4, 5].map((item, index) => {
                if (item < bars) return <div key={index} className="verticalLines coloured"></div>
                else return <div key={index} className="verticalLines grey"></div>
              })}
            </span>
            <span>$ {range.max}</span>
          </div>
        )}
      </INFO_STATS>
      <FEES_BTN onClick={() => setFeesPopup((prev) => !prev)}>Fees </FEES_BTN>
      {isLocked ? (
        <REFRESH_DATA onClick={() => refreshTokenData(null)}>
          <img src={`/img/assets/whiteRefresh.svg`} alt="refresh" />
        </REFRESH_DATA>
      ) : (
        <RESET_LAYOUT_BUTTON onClick={() => resetLayout()}>Reset Layout</RESET_LAYOUT_BUTTON>
      )}
      <LOCK_LAYOUT $isLocked={isLocked} onClick={() => setIsLocked(!isLocked)}>
        <img src={isLocked ? `/img/assets/whiteLock.svg` : `/img/assets/whiteUnlock.svg`} alt="lock" />
      </LOCK_LAYOUT>
    </INFO_WRAPPER>
  )
}
