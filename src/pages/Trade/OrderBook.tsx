import React, { FC, useMemo, useState } from 'react'
import styled from 'styled-components'
import { MarketSide, useMarket } from '../../context'

const HEADER = styled.div<{ $side: MarketSide }>`
  padding: ${({ theme }) => theme.margins['1x']} ${({ theme }) => theme.margins['2.5x']} ${({ theme }) => theme.margins['1.5x']};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background-color: ${({ theme, $side }) => theme[$side]};
  
  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    &:last-child span {
      font-size: 11px;
    }
  }
`

const SIDE = styled.div<{ $side: MarketSide }>`
  margin-bottom: ${({ theme }) => theme.margins['2x']};

  span {
    position: relative;
    font-size: 10px;
    cursor: pointer;
    
    &:${({ $side }) => $side === 'bids' ? 'first' : 'last' }-child:after {
      content: '';
      display: block;
      position: absolute;
      bottom: -6px;
      left: -${({ theme }) => theme.margins['0.5x']};
      width: calc(100% + 2 * ${({ theme }) => theme.margins['0.5x']});
      height: 2px;
      background-color: white;
      cursor: initial;
    }
  }
`

const WRAPPER = styled.div`
`

export const OrderBook: FC = () => {
  const { getBidFromSymbol, selectedMarket } = useMarket()
  const [side, setSide] = useState<MarketSide>('bids')

  const a = useMemo(() => getBidFromSymbol(selectedMarket.symbol), [getBidFromSymbol, selectedMarket.symbol])

  return (
    <WRAPPER>
      <HEADER $side={side}>
        <SIDE $side={side}>
          <span onClick={() => setSide('bids')}>Live buy orders</span>
          <span onClick={() => setSide('asks')}>Live sell orders</span>
        </SIDE>
        <div>
          <span>Price ({a})</span>
          <span>Amount</span>
          <span>Whatever</span>
        </div>
      </HEADER>
    </WRAPPER>
  )
}
