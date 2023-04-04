/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, ReactNode, useMemo, useState, useEffect, useRef } from 'react'
import { Dropdown, Menu, Skeleton } from 'antd'
import { DownOutlined } from '@ant-design/icons'
import { MarketSide, useCrypto, useOrder, useOrderBook, useTradeHistory } from '../../context'
import { removeFloatingPointError } from '../../utils'
import tw, { styled } from 'twin.macro'

const SPREADS = [1 / 100, 5 / 100, 1 / 10, 5 / 10, 1]

const HEADER = styled.div`
  ${tw`h-[31px] w-full p-0 text-xs h-7`}
  border-bottom: 1px solid ${({ theme }) => theme.tokenBorder};
  & div {
    ${tw`flex justify-between items-center h-full px-2 dark:text-[#B5B5B5] text-[#636363]`}

    span {
      ${tw`inline-block w-1/3 text-xs font-medium`}
    }
    span:nth-child(2) {
      ${tw`text-center`}
    }
    span:nth-child(3) {
      ${tw`text-right`}
    }
    div:nth-child(3) {
      ${tw`text-right w-1/3 justify-end`}
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
      color: ${({ theme }) => theme.bidColor};
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
      color: ${({ theme }) => theme.askColor};
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

const SIZE_BUY = styled.span`
  ${tw`dark:bg-[#58ce3b] bg-[#71c25d]`}
  position: absolute;
  right: 0;
  height: 100%;
`
const SIZE_SELL = styled.span`
  ${tw`dark:bg-[#f24244] bg-[#f06565]`}
  position: absolute;
  left: 0;
  height: 100%;
`
const WRAPPER = styled.div`
  position: relative;
  width: 100%;
  padding: 0px 0px 0px 0px;
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
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  position: absolute;
  padding-left: 5px;
  padding-right: 5px;
  bottom: 0px;
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
  ${tw`h-8 border-t-[1px] border-solid dark:border-[#3c3c3c] border-[#CACACA] w-full`}
  border-bottom: none;
  border-left: none;
  border-right: none;
`

const Loader: FC = () => (
  <>
    {[...Array(10).keys()].map((_, index) => (
      <LOADER key={index} active size="small" />
    ))}
  </>
)

function usePrevious(value) {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export const OrderBook: FC = () => {
  const { getAskSymbolFromPair, getBidSymbolFromPair, selectedCrypto } = useCrypto()
  const { order, setFocused, setOrder } = useOrder()
  const { orderBook } = useOrderBook()
  const [bids] = useState<MarketSide>('bids')
  const [asks] = useState<MarketSide>('asks')
  const bid = useMemo(() => getBidSymbolFromPair(selectedCrypto.pair), [getBidSymbolFromPair, selectedCrypto.pair])
  const ask = useMemo(() => getAskSymbolFromPair(selectedCrypto.pair), [getAskSymbolFromPair, selectedCrypto.pair])
  const { tradeHistory } = useTradeHistory()
  const [spreadIndex, setSpreadIndex] = useState<number>(0)
  const prevOrderBook: any = usePrevious(orderBook)
  const [neworders, setNewOrders] = useState<{ bids: number[]; asks: number[] }>({
    bids: [],
    asks: []
  })
  const lastTradedPrice = {
    price: tradeHistory[0] && tradeHistory[0].price,
    side: tradeHistory[0] && tradeHistory[0].side
  }

  const [bidOrderBookDisplay, setBidOrderBookDisplay] = useState([])
  const [askOrderBookDisplay, setAskOrderBookDisplay] = useState([])

  const isModulo = (num1, num2) => {
    const result = (num1 + 0.00001) % num2
    if (result < 0.0001) return true
    return false
  }

  const editOrderBookBid = () => {
    function getBucketValue(bidAmount, spread) {
      const value = +(bidAmount / spread).toFixed(2)
      if (isModulo(bidAmount, spread)) return { decimal: false, value: bidAmount }
      else return { decimal: true, value: Math.floor(value) * spread }
    }
    const completeOrderBookBids = orderBook[bids],
      selectedSpread = SPREADS[spreadIndex],
      buckets = [],
      firstBucket = getBucketValue(completeOrderBookBids[0][0], selectedSpread).value
    let lastBucket = firstBucket,
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
      if (i === completeOrderBookBids.length - 1) buckets.push([lastBucket, currentBucketSum])
    }
    setBidOrderBookDisplay(buckets)
  }
  const editOrderBookAsk = () => {
    function getBucketValue(askAmount, spread) {
      const value = +(askAmount / spread).toFixed(2)
      if (isModulo(askAmount, spread)) return { decimal: false, value: askAmount }
      else return { decimal: true, value: (Math.floor(value) + 1) * spread }
    }
    const completeOrderBookBids = orderBook[asks],
      selectedSpread = SPREADS[spreadIndex],
      buckets = [],
      firstBucket = getBucketValue(completeOrderBookBids[0][0], selectedSpread).value

    let lastBucket = firstBucket,
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
      if (i === completeOrderBookBids.length - 1) buckets.push([lastBucket, currentBucketSum])
    }
    setAskOrderBookDisplay(buckets)
  }

  useEffect(() => {
    if (orderBook[bids].length > 0) {
      editOrderBookBid()
    } else setBidOrderBookDisplay([])
    if (orderBook[asks].length > 0) {
      editOrderBookAsk()
    } else setAskOrderBookDisplay([])
  }, [orderBook, spreadIndex, selectedCrypto.pair])

  useEffect(() => {
    if (prevOrderBook) {
      const newBids = [],
        newAsks = []
      if (prevOrderBook.bids.length) {
        for (let i = 0; i < orderBook.bids.length; i++) {
          if (prevOrderBook.bids.length < i + 1) {
            newBids.push(i)
          } else if (
            prevOrderBook.bids[i][0] !== orderBook.bids[i][0] ||
            prevOrderBook.bids[i][1] !== orderBook.bids[i][1]
          ) {
            newBids.push(i)
          }
        }
      }
      if (prevOrderBook.asks.length) {
        for (let i = 0; i < orderBook.asks.length; i++) {
          if (prevOrderBook.asks.length < i + 1) {
            newAsks.push(i)
          } else if (
            prevOrderBook.asks[i][0] !== orderBook.asks[i][0] ||
            prevOrderBook.asks[i][1] !== orderBook.asks[i][1]
          ) {
            newAsks.push(i)
          }
        }
      }
      setNewOrders({ bids: newBids, asks: newAsks })
    }
  }, [orderBook])

  function timeout(delay: number) {
    return new Promise((res) => setTimeout(res, delay))
  }

  const setDefaultIndex = async () => {
    if (neworders.bids.length || neworders.asks.length) {
      await timeout(1000)
      setNewOrders({ bids: [], asks: [] })
    }
  }

  useEffect(() => {
    setDefaultIndex()
  }, [neworders])

  const slicedOrderBookBids = useMemo(
    () => (bidOrderBookDisplay.length > 14 ? bidOrderBookDisplay.slice(0, 14) : bidOrderBookDisplay),
    [bidOrderBookDisplay]
  )

  const totalOrderBookValueBids = useMemo(
    () => slicedOrderBookBids.reduce((acc, [size, price]) => acc + size * price, 0),
    [slicedOrderBookBids]
  )

  const slicedOrderBookAsks = useMemo(
    () => (askOrderBookDisplay.length > 14 ? askOrderBookDisplay.slice(0, 14) : askOrderBookDisplay),
    [askOrderBookDisplay]
  )
  const totalOrderBookValueAsks = useMemo(
    () => slicedOrderBookAsks.reduce((acc, [size, price]) => acc + size * price, 0),
    [slicedOrderBookAsks]
  )

  const spreadAbsolute = useMemo(() => {
    if (!slicedOrderBookAsks.length || !slicedOrderBookBids.length) return [0, 0]
    const midValue = +((slicedOrderBookAsks[0][0] + slicedOrderBookBids[0][0]) / 2).toFixed(2),
      absolute = +(slicedOrderBookAsks[0][0] - slicedOrderBookBids[0][0]).toFixed(2)
    return [absolute, ((absolute / midValue) * 100).toFixed(2)]
  }, [slicedOrderBookBids, slicedOrderBookAsks])

  //const handleExpandToggle = () => setOrder((prevState) => ({ ...prevState, isHidden: !prevState.isHidden }))

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
        <Menu.Item key={index} onClick={() => setSpreadIndex(index)}>
          {item}
        </Menu.Item>
      ))}
    </Menu>
  )

  return (
    <WRAPPER>
      <HEADER>
        <div>
          <span>Size ({ask})</span>
          <span> Price ({bid})</span>
          <span>Size ({ask})</span>
        </div>
      </HEADER>
      <ORDERS $visible={order.isHidden || (!orderBook.bids.length && !orderBook.asks.length)}>
        {!orderBook.bids.length && !orderBook.asks.length ? (
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
                        <span onClick={() => handleSetSize(size)}>{removeFloatingPointError(size)}</span>
                        <span onClick={() => handleSetPrice(price)}>${removeFloatingPointError(price)}</span>

                        <SIZE_BUY
                          style={{
                            width: `${(acc.totalValue / totalOrderBookValueBids) * 100}%`,
                            opacity: neworders.bids.includes(index) ? '1' : '0.3'
                          }}
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
                        <span onClick={() => handleSetPrice(price)}>${removeFloatingPointError(price)}</span>
                        <span onClick={() => handleSetSize(size)}>{removeFloatingPointError(size)}</span>
                        <SIZE_SELL
                          style={{
                            width: `${(acc.totalValue / totalOrderBookValueAsks) * 100}%`,
                            opacity: neworders.asks.includes(index) ? '1' : '0.3'
                          }}
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
        <div>{'Spread'}</div>
        <div>{spreadAbsolute[1]}%</div>
        <div>
          {
            <Dropdown overlay={SPREAD_DROPDOWN} trigger={['click']}>
              <div className="spreadDropdown">
                {SPREADS[spreadIndex]}
                <DownOutlined />
              </div>
            </Dropdown>
          }
        </div>
      </SPREAD_FOOTER>
    </WRAPPER>
  )
}
