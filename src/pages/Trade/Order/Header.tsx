import React, { Dispatch, FC, SetStateAction, useMemo } from 'react'
import styled from 'styled-components'
import { useMarket } from '../../../context'
import { CenteredImg, MainText, SVGToWhite } from '../../../styles'

export type Side = 'buy' | 'sell'

const ARROW = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['2x'])};
`

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
`

const INFO = styled.div`
  width: 100%;
  margin: 0 ${({ theme }) => theme.margins['1.5x']};

  > div {
    display: flex;
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

const SIDE = styled.div<{ $side: Side }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  span {
    cursor: pointer;
    color: ${({ theme }) => theme.grey4};
    font-size: 12px;
    font-weight: bold;
    
    &:hover {
      color: white;
    }
    
    &:${({ $side }) => $side === 'buy' ? 'first' : 'last'}-child {
      position: relative;
      transition: none;
      color: white;
      
      &:after {
        content: '';
        display: block;
        position: absolute;
        bottom: calc(-1 * (2px + ${({ theme }) => theme.margins['1.5x']}));
        left: calc(-1 * ${({ theme }) => theme.margins['2.5x']});
        width: calc(100% + 2 * ${({ theme }) => theme.margins['2.5x']});
        height: 2.5px;
        background-color: ${({ theme }) => theme.secondary2};
      }
    }
  }
`

const TICKER = MainText(styled.span`
  font-size: 12px;
  font-weight: bold;
`)

const WRAPPER = styled.div`
  display: flex;
  padding: ${({ theme }) => theme.margins['2x']} ${({ theme }) => theme.margins['1.5x']} ${({ theme }) => theme.margins['1.5x']};
  border: solid 2.5px #9f9f9f;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background-color: ${({ theme }) => theme.bg4};
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
        <SIDE $side={side}>
          <span onClick={() => setSide('buy')}>Buy</span>
          <span onClick={() => setSide('sell')}>Sell</span>
        </SIDE>
      </INFO>
      <ARROW>
        <SVGToWhite src={`${process.env.PUBLIC_URL}/img/assets/arrow.svg`} alt="" />
      </ARROW>
    </WRAPPER>
  )
}
