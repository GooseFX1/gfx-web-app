import React, { FC, ReactNode, useMemo, useState } from 'react'
import { Skeleton } from 'antd'
import styled from 'styled-components'
import { Expand } from '../../components'
import { MarketSide, useCrypto, useOrder } from '../../context'
import { abbreviateNumber } from '../../utils'
import { SpaceBetweenDiv, TRADE_ORDER_WIDTH } from '../../styles'

const HEADER = styled.div<{ $side: MarketSide }>`
  margin: -${({ theme }) => theme.margins['2x']} -${({ theme }) => theme.margins['2x']};
  ${({ theme }) => theme.margins['1x']};
  padding: ${({ theme }) => theme.margins['1x']} ${({ theme }) => theme.margins['2.5x']};
  ${({ theme }) => theme.margins['1.5x']};
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  background-color: ${({ theme, $side }) => theme[$side]};
  transition: background-color ${({ theme }) => theme.mainTransitionTime} ease-in-out;

  > div:last-child span {
    flex: 1;
    font-size: 11px;
  }
`

const LOADER = styled(Skeleton.Input)`
  width: 100%;

  span {
    height: 10px !important;

    &:first-child {
      margin-top: ${({ theme }) => theme.margins['0.5x']};
    }
  }
`

const ORDERS = styled.div<{ $visible: boolean }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  max-height: ${({ $visible }) => ($visible ? '1000px' : '212px')};
  transition: max-height ${({ theme }) => theme.mainTransitionTime} ease-in-out;
`

const ORDER = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: ${({ theme }) => theme.margins['0.5x']} 0;

  span {
    flex: 1;
    font-size: 10px;

    &:first-child {
      text-align: left;
      cursor: pointer;
    }

    &:last-child {
      text-align: right;
    }
  }
`

const SIDE = styled(SpaceBetweenDiv)<{ $side: MarketSide }>`
  position: relative;
  margin-bottom: ${({ theme }) => theme.margins['2x']};

  &:after {
    content: '';
    display: block;
    position: absolute;
    bottom: -6px;
    left: ${({ $side }) => ($side === 'bids' ? '0' : `calc(${TRADE_ORDER_WIDTH} - 20px - 39%)`)};
    width: ${({ $side }) => ($side === 'bids' ? '33%' : '31%')};
    height: 2px;
    ${({ theme }) => theme.roundedBorders}
    background-color: white;
    cursor: initial;
    transition: all ${({ theme }) => theme.mainTransitionTime} ease-in-out;
  }

  span {
    font-size: 10px;
    cursor: pointer;
  }
`

const SIZE = styled.span<{ $side: MarketSide }>`
  position: absolute;
  right: 0;
  height: 100%;
  background-color: ${({ theme, $side }) => theme[$side]}50;
`

const WRAPPER = styled.div`
  position: relative;
  padding: ${({ theme }) => theme.margins['2x']} ${({ theme }) => theme.margins['2x']};
  ${({ theme }) => theme.margins['1.5x']};
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg3};
  overflow: hidden;
`

const Loader: FC = () => (
  <>
    {[...Array(20).keys()].map((_, index) => (
      <LOADER key={index} active size="small" />
    ))}
  </>
)

export const OrderBook: FC = () => {
  const { getBidSymbolFromPair, orderBook, selectedCrypto } = useCrypto()
  const { order, setOrder } = useOrder()
  const [side, setSide] = useState<MarketSide>('bids')

  const slicedOrderBook = useMemo(
    () => (order.isHidden ? orderBook[side] : orderBook[side].slice(0, 10)),
    [order.isHidden, orderBook, side]
  )
  const symbol = useMemo(() => getBidSymbolFromPair(selectedCrypto.pair), [getBidSymbolFromPair, selectedCrypto.pair])
  const totalOrderBookValue = useMemo(
    () => slicedOrderBook.reduce((acc, [size, price]) => acc + size * price, 0),
    [slicedOrderBook]
  )

  const handleClick = () => setOrder((prevState) => ({ ...prevState, isHidden: !prevState.isHidden }))

  return (
    <WRAPPER>
      <Expand onClick={handleClick} />
      <HEADER $side={side}>
        <SIDE $side={side}>
          <span onClick={() => setSide('bids')}>Live buy orders</span>
          <span onClick={() => setSide('asks')}>Live sell orders</span>
        </SIDE>
        <SpaceBetweenDiv>
          <span>Price ({symbol})</span>
          <span>Amount</span>
          <span>{symbol} Value</span>
        </SpaceBetweenDiv>
      </HEADER>
      <ORDERS $visible={order.isHidden}>
        {!slicedOrderBook.length ? (
          <Loader />
        ) : (
          slicedOrderBook.reduce(
            (acc: { nodes: ReactNode[]; totalValue: number }, [price, size], index) => {
              const value = price * size
              acc.totalValue += value
              acc.nodes.push(
                <ORDER key={index}>
                  <span onClick={() => setOrder((prevState) => ({ ...prevState, price }))}>${price}</span>
                  <span>{String(size).slice(0, 6)}</span>
                  <span>${abbreviateNumber(value, 2)}</span>
                  <SIZE style={{ width: `${(acc.totalValue / totalOrderBookValue) * 100}%` }} $side={side} />
                </ORDER>
              )
              return acc
            },
            { nodes: [], totalValue: 0 }
          ).nodes
        )}
      </ORDERS>
    </WRAPPER>
  )
}
