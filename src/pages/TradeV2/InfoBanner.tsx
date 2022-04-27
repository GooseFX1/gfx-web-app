import { Dropdown, Menu, Skeleton, Switch } from 'antd'
import React, { FC, useEffect, useState, useMemo } from 'react'
import styled from 'styled-components'
import { FEATURED_PAIRS_LIST, useCrypto, usePriceFeed } from '../../context'
import { DropdownPairs } from './DropdownPairs'

const INFO_WRAPPER = styled.div`
  padding: 0px 30px;
  display: flex;
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
    cursor: pointer;
  }
`
const INFO_STATS = styled.div`
  margin-left: 20px;
  line-height: 20px;
  div:first-child {
    font-size: 15px;
    font-weight: 500;
    color: ${({ theme }) => theme.text19};
  }
  div:nth-child(2) {
    color: ${({ theme }) => theme.text18};
    font-size: 15px;
    font-weight: 600;
  }
`

const REFRESH_LAYOUT = styled.div`
  height: 40px;
  width: 40px;
  border-radius: 50%;
  background-color: #5855ff;
  margin-left: auto;
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

const FIX_LAYOUT = styled.div``

const Loader: FC = () => {
  return <Skeleton.Button active size="small" style={{ display: 'flex', height: '12px' }} />
}

export const InfoBanner: FC<{ isLocked: boolean; setIsLocked: Function }> = ({ isLocked, setIsLocked }) => {
  const [isSpot, setIsSpot] = useState(true)
  const { selectedCrypto } = useCrypto()
  const { prices } = usePriceFeed()
  const marketData = useMemo(() => prices[selectedCrypto.pair], [prices, selectedCrypto.pair])

  const handleToggle = (e) => {
    if (e === 'spot') setIsSpot(true)
    else setIsSpot(false)
  }

  return (
    <INFO_WRAPPER>
      <div className="spot-toggle">
        <span className={'toggle ' + (isSpot ? 'selected' : '')} key="spot" onClick={() => handleToggle('spot')}>
          Spot
        </span>
        <span className={'toggle ' + (!isSpot ? 'selected' : '')} key="perps" onClick={() => handleToggle('perps')}>
          Perps
        </span>
      </div>
      <DropdownPairs />
      <INFO_STATS>
        {!marketData || !marketData.current ? (
          <Loader />
        ) : (
          <>
            <div>Price</div>
            <div>$ {marketData.current}</div>
          </>
        )}
      </INFO_STATS>
      <REFRESH_LAYOUT>
        <img src={`/img/assets/whiteRefresh.svg`} alt="refresh" />
      </REFRESH_LAYOUT>
      <LOCK_LAYOUT $isLocked={isLocked} onClick={() => setIsLocked(!isLocked)}>
        <img src={isLocked ? `/img/assets/whiteLock.svg` : `/img/assets/whiteUnlock.svg`} alt="lock" />
      </LOCK_LAYOUT>
    </INFO_WRAPPER>
  )
}
