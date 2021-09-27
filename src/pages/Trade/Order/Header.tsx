import React, { Dispatch, FC, SetStateAction, useMemo } from 'react'
import styled from 'styled-components'
import { useMarket } from '../../../context'
import { CenteredImg, MainText } from '../../../styles'

export type Side = 'buy' | 'sell'

const CHANGE = styled(CenteredImg)`
  display: flex;
  margin-left: ${({ theme }) => theme.margins['1.5x']};

  > div {
    ${({ theme }) => theme.measurements(theme.margins['1.5x'])}
    margin-right: ${({ theme }) => theme.margins['1x']};
  }

  span {
    font-size: 10px;
    font-weight: bold;
  }
`

const ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['4x'])}
  margin-right: ${({ theme }) => theme.margins['1.5x']};
`

const INFO = styled.div`
  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
`

const PRICE = MainText(styled.span`
  display: block;
  margin: ${({ theme }) => theme.margins['0.5x']} 0 ${({ theme }) => theme.margins['1.5x']};
  font-size: 10px;
  font-weight: bold;
  text-align: left;
`)

const SIDE = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const TICKER = MainText(styled.span`
  font-size: 12px;
  font-weight: bold;
`)

const WRAPPER = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.margins['2x']} ${({ theme }) => theme.margins['6x']}
    ${({ theme }) => theme.margins['0.5x']} ${({ theme }) => theme.margins['1x']};
  border: solid 2.5px #9f9f9f;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`

export const Header: FC<{ setSide: Dispatch<SetStateAction<Side>>; side: Side }> = ({ setSide, side }) => {
  const { formatSymbol, getAssetFromSymbol, marketsData, selectedMarket } = useMarket()

  const asset = useMemo(() => getAssetFromSymbol(selectedMarket.symbol), [getAssetFromSymbol, selectedMarket])
  const marketData = useMemo(() => marketsData[selectedMarket.symbol], [marketsData, selectedMarket.symbol])
  const change24HIcon = useMemo(() => `price_${marketData.change24H >= 0 ? 'up' : 'down'}.svg`, [marketData])
  const formattedSymbol = useMemo(() => formatSymbol(selectedMarket.symbol), [formatSymbol, selectedMarket])

  return (
    <WRAPPER>
      <ICON>
        <img src={`${process.env.PUBLIC_URL}/img/tokens/${asset}.svg`} alt="" />
      </ICON>
      <INFO>
        <div>
          <TICKER>{formattedSymbol}</TICKER>
          <CHANGE>
            <CenteredImg>
              <img src={`${process.env.PUBLIC_URL}/img/assets/${change24HIcon}`} alt="" />
            </CenteredImg>
            <span>{marketData.change24H}</span>
          </CHANGE>
        </div>
        <PRICE>Price: $ {marketData.current}</PRICE>
        <SIDE>
          <span>Buy</span>
          <span>Sell</span>
        </SIDE>
      </INFO>
    </WRAPPER>
  )
}
