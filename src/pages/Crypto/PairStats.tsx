import React, { FC, useMemo } from 'react'
import { Skeleton } from 'antd'
import styled from 'styled-components'
import { MarketType, useCrypto } from '../../context'
import { CenteredImg } from '../../styles'

const ASSET_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['2x'])}
`

/* const CHANGE_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['1x'])}
` */

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
      color: ${({ theme }) => theme.text1};
    }
  }
`

const PRICE = styled.div`
  display: flex;
  height: ${({ theme }) => theme.margins['3x']};
  padding-top: ${({ theme }) => theme.margins['1x']};

  > span {
    font-size: 12px;
    color: ${({ theme }) => theme.text1};
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
  pair: string
}> = ({ decimals, market, pair }) => {
  const { formatPair, getAskSymbolFromPair, marketsData, selectedCrypto, setSelectedCrypto } = useCrypto()

  const symbol = useMemo(() => getAskSymbolFromPair(pair), [getAskSymbolFromPair, pair])
  const formattedPair = useMemo(() => formatPair(selectedCrypto.pair), [formatPair, selectedCrypto.pair])
  const marketData = useMemo(() => marketsData[pair], [marketsData, pair])
  // const change24HIcon = useMemo(() => `price_${marketData.change24H >= 0 ? 'up' : 'down'}.svg`, [marketData])

  const handleClick = () => {
    if (selectedCrypto.pair !== symbol) {
      setSelectedCrypto({ decimals, market, pair })
    }
  }

  return (
    <STATS>
      <INFO>
        <div onClick={handleClick}>
          <ASSET_ICON>
            <img src={`${process.env.PUBLIC_URL}/img/tokens/${symbol}.svg`} alt="" />
          </ASSET_ICON>
          <span>{formattedPair}</span>
        </div>
        {/* !marketData.change24H ? (
          <Loader />
        ) : (
          <div>
            <CHANGE_ICON>
              <img src={`${process.env.PUBLIC_URL}/img/assets/${change24HIcon}`} alt="" />
            </CHANGE_ICON>
            <span>{marketData.change24H}</span>
          </div>
        ) TODO RESTORE */}
      </INFO>
      <PRICE>{marketData.current ? <span>$ {marketData.current}</span> : <Loader />}</PRICE>
    </STATS>
  )
}
