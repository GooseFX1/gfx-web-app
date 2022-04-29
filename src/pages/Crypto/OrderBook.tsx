import React, { FC, ReactNode, useMemo, useState, MouseEvent } from 'react'
import { Skeleton } from 'antd'
import styled from 'styled-components'
import { Expand } from '../../components'
import { MarketSide, useCrypto, useOrder, useOrderBook } from '../../context'
import { removeFloatingPointError } from '../../utils'

const HEADER = styled.div`
  height: 70px;
  width: 100%;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg12};
  padding: 10px 15px;
  div {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #e7e7e7;

    span {
      display: inline-block;
      width: 33%;
      font-size: 15px;
    }
    span:nth-child(2) {
      text-align: center;
    }
    span:nth-child(3) {
      text-align: right;
    }
  }
  div:nth-child(2) {
    margin-top: 15px;
    color: ${({ theme }) => theme.text20};
    span {
      font-size: 11px;
    }
  }
`

const LOADER = styled(Skeleton.Input)`
  width: 100%;
  max-height: 328px;
  height: 20px;
  .ant-skeleton-input {
    width: 100%;
  }
  span {
    height: 10px !important;

    &:first-child {
      margin-top: ${({ theme }) => theme.margin(0.5)};
    }
  }
`

const ORDERS = styled.div<{ $visible: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  justify-content: space-between;
  align-items: center;
  max-height: ${({ $visible }) => ($visible ? '328px' : 'auto')};
  padding-right: 2px;
  overflow-y: scroll;
  ${({ theme }) => theme.customScrollBar('4px')};
  transition: max-height ${({ theme }) => theme.mainTransitionTime} ease-in-out;
`

const ORDER_BUY = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: ${({ theme }) => theme.margin(0.5)} 0;
  height: 20px;
  span {
    flex: 1;
    font-size: 13px;
    font-weight: 500;
    color: ${({ theme }) => theme.text18};

    &:not(:last-child) {
      z-index: 2;
    }

    &:first-child {
      text-align: left;
      cursor: pointer;

      &:hover {
        font-weight: bold;
      }
    }

    &:nth-child(2) {
      cursor: pointer;
      text-align: right;
      padding-right: 10px;
      color: #50bb35;
      &:hover {
        font-weight: bold;
      }
    }

    &:nth-child(3) {
      text-align: right;
      cursor: auto;
    }
  }
`
const ORDER_SELL = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 20px;
  margin: ${({ theme }) => theme.margin(0.5)} 0;

  span {
    flex: 1;
    font-size: 13px;
    font-weight: 500;

    color: ${({ theme }) => theme.text18};

    &:not(:last-child) {
      z-index: 2;
    }

    &:first-child {
      text-align: left;
      cursor: pointer;
      padding-left: 10px;
      color: #f06565;
      &:hover {
        font-weight: bold;
      }
    }

    &:nth-child(2) {
      cursor: pointer;
      text-align: right;

      &:hover {
        font-weight: bold;
      }
    }

    &:nth-child(3) {
      text-align: right;
      cursor: auto;
    }
  }
`

const SIZE_BUY = styled.span<{ $side: MarketSide }>`
  position: absolute;
  right: 0;
  height: 100%;
  background-color: ${({ theme, $side }) => theme[$side]}50;
`
const SIZE_SELL = styled.span<{ $side: MarketSide }>`
  position: absolute;
  left: 0;
  height: 100%;
  background-color: ${({ theme, $side }) => theme[$side]}50;
`
const WRAPPER = styled.div`
  position: relative;
  padding: 0px 0px 20px 0px;

  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg3};
  overflow: hidden;
`

const ORDERBOOK_CONTAINER = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0px 10px;
  span {
    width: 50%;
  }
`

const Loader: FC = () => (
  <>
    {[...Array(10).keys()].map((_, index) => (
      <LOADER key={index} active size="small" />
    ))}
  </>
)

export const OrderBook: FC = () => {
  const { getAskSymbolFromPair, getBidSymbolFromPair, selectedCrypto } = useCrypto()
  const { order, setFocused, setOrder } = useOrder()
  const { orderBook } = useOrderBook()
  const [bids, setBids] = useState<MarketSide>('bids')
  const [asks, setAsks] = useState<MarketSide>('asks')
  const bid = useMemo(() => getBidSymbolFromPair(selectedCrypto.pair), [getBidSymbolFromPair, selectedCrypto.pair])
  const ask = useMemo(() => getAskSymbolFromPair(selectedCrypto.pair), [getAskSymbolFromPair, selectedCrypto.pair])

  const slicedOrderBookBids = useMemo(
    () => (order.isHidden ? orderBook[bids] : orderBook[bids].slice(0, 8)),
    [order.isHidden, orderBook, bids]
  )
  const totalOrderBookValueBids = useMemo(
    () => slicedOrderBookBids.reduce((acc, [size, price]) => acc + size * price, 0),
    [slicedOrderBookBids]
  )

  const slicedOrderBookAsks = useMemo(
    () => (order.isHidden ? orderBook[asks] : orderBook[asks].slice(0, 8)),
    [order.isHidden, orderBook, asks]
  )
  const totalOrderBookValueAsks = useMemo(
    () => slicedOrderBookAsks.reduce((acc, [size, price]) => acc + size * price, 0),
    [slicedOrderBookAsks]
  )

  const symbol = useMemo(() => getBidSymbolFromPair(selectedCrypto.pair), [getBidSymbolFromPair, selectedCrypto.pair])

  const handleExpandToggle = () => setOrder((prevState) => ({ ...prevState, isHidden: !prevState.isHidden }))

  const handleSetPrice = (price: number) => {
    setOrder((prevState) => ({ ...prevState, price }))
    setFocused('price')
  }

  const handleSetSize = (size: number) => {
    setOrder((prevState) => ({ ...prevState, size }))
    setFocused('size')
  }

  return (
    <WRAPPER>
      <Expand onClick={handleExpandToggle} />
      <HEADER>
        <div>
          <span>Orderbook</span>
          <span> 38,867.6</span>
          <span>0.5</span>
        </div>
        <div>
          <span>Size({ask})</span>
          <span> Price({bid})</span>
          <span>Size({ask})</span>
        </div>
      </HEADER>
      <ORDERS $visible={order.isHidden || !slicedOrderBookBids.length}>
        {!slicedOrderBookBids.length ? (
          <Loader />
        ) : (
          <ORDERBOOK_CONTAINER>
            <span>
              {
                slicedOrderBookBids.reduce(
                  (acc: { nodes: ReactNode[]; totalValue: number }, [price, size], index) => {
                    const value = price * size
                    acc.totalValue += value
                    acc.nodes.push(
                      <ORDER_BUY key={index}>
                        <span onClick={(e: MouseEvent<HTMLSpanElement>) => handleSetSize(size)}>
                          {removeFloatingPointError(size)}
                        </span>
                        <span onClick={(e: MouseEvent<HTMLSpanElement>) => handleSetPrice(price)}>
                          ${removeFloatingPointError(price)}
                        </span>

                        <SIZE_BUY
                          style={{ width: `${(acc.totalValue / totalOrderBookValueBids) * 100}%` }}
                          $side={bids}
                        />
                      </ORDER_BUY>
                    )
                    return acc
                  },
                  { nodes: [], totalValue: 0 }
                ).nodes
              }
            </span>
            <span>
              {
                slicedOrderBookAsks.reduce(
                  (acc: { nodes: ReactNode[]; totalValue: number }, [price, size], index) => {
                    const value = price * size
                    acc.totalValue += value
                    acc.nodes.push(
                      <ORDER_SELL key={index}>
                        <span onClick={(e: MouseEvent<HTMLSpanElement>) => handleSetPrice(price)}>
                          ${removeFloatingPointError(price)}
                        </span>
                        <span onClick={(e: MouseEvent<HTMLSpanElement>) => handleSetSize(size)}>
                          {removeFloatingPointError(size)}
                        </span>
                        <SIZE_SELL
                          style={{ width: `${(acc.totalValue / totalOrderBookValueAsks) * 100}%` }}
                          $side={asks}
                        />
                      </ORDER_SELL>
                    )
                    return acc
                  },
                  { nodes: [], totalValue: 0 }
                ).nodes
              }
            </span>
          </ORDERBOOK_CONTAINER>
        )}
      </ORDERS>
    </WRAPPER>
  )
}
