import React, { FC, useMemo, useState } from 'react'
import styled from 'styled-components'
import { MarketSide, useMarket } from '../../context'

const HEADER = styled.div<{ $side: MarketSide }>`
  margin: -${({ theme }) => theme.margins['2x']} -${({ theme }) => theme.margins['2x']} ${({ theme }) => theme.margins['0.5x']};
  padding: ${({ theme }) => theme.margins['1x']} ${({ theme }) => theme.margins['2.5x']} ${({ theme }) => theme.margins['1.5x']};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background-color: ${({ theme, $side }) => theme[$side]};
  transition: background-color ${({ theme }) => theme.mainTransitionTime} ease-in-out;

  > div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
    &:last-child span {
      font-size: 11px;
    }
  }
`

const ORDERS = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`

const ORDER = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: ${({ theme }) => theme.margins['0.5x']} 0;
  
  span {
    font-size: 10px;
  }
`

const SIDE = styled.div<{ $side: MarketSide }>`
  position: relative;
  margin-bottom: ${({ theme }) => theme.margins['2x']};

  &:after {
    content: '';
    display: block;
    position: absolute;
    bottom: -6px;
    left: ${({ $side }) => $side === 'bids' ? '-3' : '63'}%;
    width: 41%;
    height: 2px;
    ${({ theme }) => theme.roundedBorders}
    background-color: white;
    cursor: initial;
    transition: left ${({ theme }) => theme.mainTransitionTime} ease-in-out;
  }

  span {
    font-size: 10px;
    cursor: pointer;
  }
`

const WRAPPER = styled.div`
  flex: 1;
  padding: ${({ theme }) => theme.margins['2x']} ${({ theme }) => theme.margins['2x']} ${({ theme }) => theme.margins['1.5x']};
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg3};
`

export const OrderBook: FC = () => {
  const { getBidFromSymbol, orderBook, selectedMarket } = useMarket()
  const [side, setSide] = useState<MarketSide>('bids')

  const bid = useMemo(() => getBidFromSymbol(selectedMarket.symbol), [getBidFromSymbol, selectedMarket.symbol])

  const orderValue = (price: number, size: number) => (price * size).toFixed(2)

  return (
    <WRAPPER>
      <HEADER $side={side}>
        <SIDE $side={side}>
          <span onClick={() => setSide('bids')}>Live buy orders</span>
          <span onClick={() => setSide('asks')}>Live sell orders</span>
        </SIDE>
        <div>
          <span>Price ({bid})</span>
          <span>Amount</span>
          <span>{(bid)} Value</span>
        </div>
      </HEADER>
      <ORDERS>
        {orderBook[side].slice(0, 17).map(([price, size], index) => (
          <ORDER key={index}>
            <span>{price}</span>
            <span>{size}</span>
            <span>{orderValue(price, size)}</span>
          </ORDER>
        ))}
      </ORDERS>
    </WRAPPER>
  )
}
