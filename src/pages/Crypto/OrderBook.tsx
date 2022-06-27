import React, { FC, ReactNode, useMemo, useState, MouseEvent, useEffect } from 'react'
import { Dropdown, Menu, Skeleton } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import styled from 'styled-components'
import { Expand } from '../../components'
import { MarketSide, useCrypto, useOrder, useOrderBook, useTradeHistory } from '../../context'
import { removeFloatingPointError } from '../../utils'
import tw from "twin.macro"

const SPREADS = [1 / 100, 5 / 100, 1 / 10, 5 / 10, 1];

const HEADER = styled.div`
  ${tw`h-17.5 rounded-b-small w-full py-2.5`}
  padding: 10px 15px;
  background-color: ${({ theme }) => theme.bg15};
  & div {
    ${tw`flex justify-between items-center`}
    color: #e7e7e7;

  span {
    ${tw`inline-block w-1/3 text-tiny`}
  }
  span:nth-child(2) {
    ${tw`text-center`}
  }
  div:nth-child(3) {
    ${tw`text-right w-1/3 justify-end`}
    .spreadDropdown {
      ${tw`justify-end cursor-pointer w-12 text-smaller w-12.5`}
      background: linear-gradient(90.62deg, #f48537 2.36%, #a72ebd 99.71%);
    }
  }
}
div:nth-child(2) {
  color: ${({ theme }) => theme.text23};
  ${tw`mt-3.75`}
  span {
    ${tw`text-smallest`}
  }
  span:nth-child(3) {
    ${tw`text-right`}
  }
}
.buy {
  color: #50bb35;
  font-weight: 700 bold;
}
.sell {
  ${tw`font-bold`}
  color: #f06565;
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
    color: ${({ theme }) => theme.text21};

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

    color: ${({ theme }) => theme.text21};

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
  align-items: baseline;
  justify-content: center;
  padding: 0px 10px;
  span {
    width: 50%;
  }
`

const SPREAD_FOOTER = styled.div`
  display: flex;
  justify-content: center;
  position: relative;
  top: 8px;
  //background-color: ${({ theme }) => theme.bg13};
  div {
    color: ${({ theme }) => theme.text1};

    span {
      background-color: ${({ theme }) => theme.bg15};
      padding: 5px;
      border-radius: 5px;
      margin-left: 10px;
    }
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
  const { tradeHistory } = useTradeHistory()
  const [spreadIndex, setSpreadIndex] = useState<number>(0)
  let lastTradedPrice = {
    price: tradeHistory[0] && tradeHistory[0].price,
    side: tradeHistory[0] && tradeHistory[0].side
  }

  const [bidOrderBookDisplay, setBidOrderBookDisplay] = useState([])
  const [askOrderBookDisplay, setAskOrderBookDisplay] = useState([])

  const isModulo = (num1, num2) => {
    let result = (num1 + 0.00001) % num2
    if (result < 0.0001) return true
    return false
  }

  const editOrderBookBid = () => {
    function getBucketValue(bidAmount, spread) {
      let value = +(bidAmount / spread).toFixed(2)
      if (isModulo(bidAmount, spread)) return { decimal: false, value: bidAmount }
      else return { decimal: true, value: Math.floor(value) * spread }
    }
    let completeOrderBookBids = orderBook[bids],
      selectedSpread = SPREADS[spreadIndex],
      buckets = [],
      firstBucket = getBucketValue(completeOrderBookBids[0][0], selectedSpread).value,
      lastBucket = firstBucket,
      currentBucketSum = 0
    for (let i = 0; i < 100 && i < completeOrderBookBids.length; i++) {
      if (completeOrderBookBids[i][0] >= lastBucket) {
        currentBucketSum += completeOrderBookBids[i][1]
      } else {
        buckets.push([lastBucket, currentBucketSum])
        currentBucketSum = 0
        lastBucket = getBucketValue(completeOrderBookBids[i][0], selectedSpread).value
        currentBucketSum += completeOrderBookBids[i][1]
      }
    }
    setBidOrderBookDisplay(buckets)
  }
  const editOrderBookAsk = () => {
    function getBucketValue(askAmount, spread) {
      let value = +(askAmount / spread).toFixed(2)
      if (isModulo(askAmount, spread)) return { decimal: false, value: askAmount }
      else return { decimal: true, value: (Math.floor(value) + 1) * spread }
    }
    let completeOrderBookBids = orderBook[asks],
      selectedSpread = SPREADS[spreadIndex],
      buckets = [],
      firstBucket = getBucketValue(completeOrderBookBids[0][0], selectedSpread).value,
      lastBucket = firstBucket,
      currentBucketSum = 0
    for (let i = 0; i < 100 && i < completeOrderBookBids.length; i++) {
      if (completeOrderBookBids[i][0] <= lastBucket) {
        currentBucketSum += completeOrderBookBids[i][1]
      } else {
        buckets.push([lastBucket, currentBucketSum])
        currentBucketSum = 0
        lastBucket = getBucketValue(completeOrderBookBids[i][0], selectedSpread).value
        currentBucketSum += completeOrderBookBids[i][1]
      }
    }
    setAskOrderBookDisplay(buckets)
  }

  useEffect(() => {
    if (orderBook[bids].length > 0) {
      editOrderBookBid()
      editOrderBookAsk()
    } else {
      setBidOrderBookDisplay([])
      setAskOrderBookDisplay([])
    }
  }, [orderBook, spreadIndex, selectedCrypto.pair])

  const slicedOrderBookBids = useMemo(
    () => (bidOrderBookDisplay.length > 8 ? bidOrderBookDisplay.slice(0, 8) : bidOrderBookDisplay),
    [bidOrderBookDisplay]
  )

  const totalOrderBookValueBids = useMemo(
    () => slicedOrderBookBids.reduce((acc, [size, price]) => acc + size * price, 0),
    [slicedOrderBookBids]
  )

  const slicedOrderBookAsks = useMemo(
    () => (askOrderBookDisplay.length > 8 ? askOrderBookDisplay.slice(0, 8) : askOrderBookDisplay),
    [askOrderBookDisplay]
  )
  const totalOrderBookValueAsks = useMemo(
    () => slicedOrderBookAsks.reduce((acc, [size, price]) => acc + size * price, 0),
    [slicedOrderBookAsks]
  )

  const spreadAbsolute = useMemo(() => {
    if (!slicedOrderBookAsks.length || !slicedOrderBookBids.length) return [0, 0]
    let midValue = +((slicedOrderBookAsks[0][0] + slicedOrderBookBids[0][0]) / 2).toFixed(2),
      absolute = +(slicedOrderBookAsks[0][0] - slicedOrderBookBids[0][0]).toFixed(2)
    return [absolute, ((absolute / midValue) * 100).toFixed(2)]
  }, [slicedOrderBookBids, slicedOrderBookAsks])

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

  const SPREAD_DROPDOWN = (
    <Menu>
      {SPREADS.map((item, index) => (
        <Menu.Item onClick={() => setSpreadIndex(index)}>{item}</Menu.Item>
      ))}
    </Menu>
  )

  return (
    <WRAPPER>
      <Expand onClick={handleExpandToggle} />
      <HEADER>
        <div>
          <span>Orderbook</span>
          <span className={lastTradedPrice.side ? lastTradedPrice.side : ''}>
            {lastTradedPrice.price ? lastTradedPrice.price : ''}
          </span>
          <div>
            <Dropdown overlay={SPREAD_DROPDOWN} trigger={['click']}>
              <div className="spreadDropdown">
                {SPREADS[spreadIndex]}
                <DownOutlined />
              </div>
            </Dropdown>
          </div>
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
      <SPREAD_FOOTER>
        <div>
          Spread
          <span>
            {spreadAbsolute[0]}, {spreadAbsolute[1]}%
          </span>
        </div>
      </SPREAD_FOOTER>
    </WRAPPER>
  )
}
