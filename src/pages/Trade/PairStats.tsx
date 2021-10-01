import React, { FC, useMemo } from 'react'
import { Skeleton } from 'antd'
import styled from 'styled-components'
import { MarketType, useMarket } from '../../context'
import { CenteredImg } from '../../styles'

const ASSET_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['2x'])}
`

const CHANGE_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['1x'])}
`

const INFO = styled.div`
  display: flex;
  justify-content: space-between;

  > div {
    ${({ theme }) => theme.flexCenter}

    &:first-child {
      cursor: pointer;
    }

    span {
      margin-left: ${({ theme }) => theme.margins['1x']};
      font-size: 10px;
      font-weight: bold;
    }
  }
`

const PRICE = styled.div`
  display: flex;
  height: ${({ theme }) => theme.margins['3x']};
  padding-top: ${({ theme }) => theme.margins['1x']};

  > span {
    ${({ theme }) => theme.mainText}
    font-size: 12px;
  }
`

const STATS = styled.div`
  min-width: 160px;
  padding: ${({ theme }) => theme.margins['1.5x']} ${({ theme }) => theme.margins['2x']};
  ${({ theme }) => theme.smallBorderRadius}
  background-color: ${({ theme }) => theme.bg3};
`

const Loader: FC = () => {
  return <Skeleton.Button active size="small" style={{ display: 'flex', height: '12px' }} />
}

export const PairStats: FC<{
  decimals: number
  market: MarketType
  symbol: string
}> = ({ decimals, market, symbol }) => {
  const { formatSymbol, getAskFromSymbol, marketsData, selectedMarket, setSelectedMarket } = useMarket()

  const asset = useMemo(() => getAskFromSymbol(symbol), [getAskFromSymbol, symbol])
  const marketData = useMemo(() => marketsData[symbol], [marketsData, symbol])
  const change24HIcon = useMemo(() => `price_${marketData.change24H >= 0 ? 'up' : 'down'}.svg`, [marketData])
  const formattedSymbol = useMemo(() => formatSymbol(symbol), [formatSymbol, symbol])

  const handleClick = () => {
    if (selectedMarket.symbol !== symbol) {
      setSelectedMarket({ decimals, market, symbol })
    }
  }

  return (
    <STATS>
      <INFO>
        <div onClick={handleClick}>
          <ASSET_ICON>
            <img src={`${process.env.PUBLIC_URL}/img/tokens/${asset}.svg`} alt="" />
          </ASSET_ICON>
          <span>{formattedSymbol}</span>
        </div>
        {!marketData.change24H ? (
          <Loader />
        ) : (
          <div>
            <CHANGE_ICON>
              <img src={`${process.env.PUBLIC_URL}/img/assets/${change24HIcon}`} alt="" />
            </CHANGE_ICON>
            <span>{marketData.change24H}</span>
          </div>
        )}
      </INFO>
      <PRICE>{marketData.current ? <span>$ {marketData.current}</span> : <Loader />}</PRICE>
    </STATS>
  )
}
