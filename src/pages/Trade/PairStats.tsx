import React, { FC, useEffect, useMemo } from 'react'
import { Spin } from 'antd'
import styled from 'styled-components'
import { useConnectionConfig, useMarket } from '../../context'
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
  width: 220px !important;
  padding: ${({ theme }) => theme.margins['1.5x']} ${({ theme }) => theme.margins['2x']};
  ${({ theme }) => theme.smallBorderRadius}
  background-color: ${({ theme }) => theme.bg3};
`

export const PairStats: FC<{ decimals: number; market: string; symbol: string }> = ({ decimals, market, symbol }) => {
  const { connection } = useConnectionConfig()
  const { featuredPrices, formatSymbol, getAssetFromSymbol, setFeaturedList } = useMarket()

  const asset = useMemo(() => getAssetFromSymbol(symbol), [getAssetFromSymbol, symbol])
  const formattedSymbol = useMemo(() => formatSymbol(symbol), [formatSymbol, symbol])
  const past24HChange = '+245%'
  const past24HChangeIcon = `price_${past24HChange[0] === '+' ? 'up' : 'down'}.svg`
  const price = useMemo(() => featuredPrices[symbol], [featuredPrices, symbol])

  useEffect(() => {
    setFeaturedList((prevState) => [...prevState, { decimals, market, symbol }])

    return () => setFeaturedList((prevState) => prevState.filter(({ symbol: x }) => x !== symbol))
  }, [connection, decimals, market, setFeaturedList, symbol])

  return (
    <STATS>
      <INFO>
        <div>
          <ASSET_ICON>
            <img src={`${process.env.PUBLIC_URL}/img/tokens/${asset}.svg`} alt="" />
          </ASSET_ICON>
          <span>{formattedSymbol}</span>
        </div>
        <div>
          <CHANGE_ICON>
            <img src={`${process.env.PUBLIC_URL}/img/assets/${past24HChangeIcon}`} alt="" />
          </CHANGE_ICON>
          <span>{past24HChange}</span>
        </div>
      </INFO>
      <PRICE>{price ? <span>$ {price}</span> : <Spin size="small" />}</PRICE>
    </STATS>
  )
}
