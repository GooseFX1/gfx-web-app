import React, { FC, ReactNode, useMemo, useState } from 'react'
import { Skeleton } from 'antd'
import styled from 'styled-components'
import { MarketSide, useMarket } from '../../context'
import { abbreviateNumber } from '../../utils'

const HEADER = styled.div<{ $side: MarketSide }>`
  margin: -${({ theme }) => theme.margins['2x']} -${({ theme }) => theme.margins['2x']} ${({ theme }) => theme.margins['1.5x']};
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
      flex: 1;
      font-size: 11px;
    }
  }
`

const LOADER = styled(Skeleton.Input)`
  width: 100%;
  
  span {
    height: 12px !important;
  }
`

const ORDERS = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  height: 39vh;
  overflow-y: scroll;
`

const ORDER = styled.div<{ $orderBookRatio: number, $side: MarketSide }>`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: ${({ theme }) => theme.margins['0.5x']} 0;
  
  &:after {
    content: '';
    position: absolute;
    right: 0;
    width: ${({ $orderBookRatio }) => $orderBookRatio}%;
    height: 100%;
    background-color: ${({ theme, $side }) => theme[$side]}50;
  }
  
  span {
    flex: 1;
    font-size: 10px;
    
    &:first-child {
      text-align: left;
    }

    &:last-child {
      text-align: right;
    }
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
  padding: ${({ theme }) => theme.margins['2x']} ${({ theme }) => theme.margins['2x']} ${({ theme }) => theme.margins['1.5x']};
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg3};
`

const Loader: FC = () => <>{[...Array(15).keys()].map(() => <LOADER active size="small" />)}</>

export const OrderBook: FC = () => {
  const { getBidFromSymbol, orderBook, selectedMarket } = useMarket()
  const [side, setSide] = useState<MarketSide>('bids')

  const bid = useMemo(() => getBidFromSymbol(selectedMarket.symbol), [getBidFromSymbol, selectedMarket.symbol])
  const totalOrderBookValue = useMemo(() => orderBook[side].reduce((acc, [size, price]) => acc + size * price, 0), [orderBook, side])

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
        {!orderBook[side].length
          ? <Loader />
          : orderBook[side].reduce((acc: { nodes: ReactNode[], totalValue: number }, [price, size], index) => {
          const value = price * size
          acc.totalValue += value
          acc.nodes.push(
            <ORDER key={index} $orderBookRatio={acc.totalValue / totalOrderBookValue * 100} $side={side}>
              <span>${price}</span>
              <span>{String(size).slice(0, 6)}</span>
              <span>${abbreviateNumber(value, 2)}</span>
            </ORDER>
          )
          return acc
        }, { nodes: [], totalValue: 0 }).nodes}
      </ORDERS>
    </WRAPPER>
  )
}
