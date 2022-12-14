import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'
import BN from 'bn.js'
import { Orderbook } from '@project-serum/serum'
import { useConnectionConfig } from './settings'
import { notify } from '../utils'
import { serum } from '../web3'
import { MarketSide, useCrypto } from './crypto'
import { loadBidsSlab } from '../pages/TradeV3/perps/utils'
import { useTraderConfig } from './trader_risk_group'
import * as anchor from '@project-serum/anchor'

type OrderBook = {
  [x in MarketSide]: [number, number, BN, BN][]
}

interface IOrderBookConfig {
  orderBook: OrderBook
  openOrders: any[]
}

const DEFAULT_ORDER_BOOK = { asks: [], bids: [] }

const OrderBookContext = createContext<IOrderBookConfig | null>(null)

export const OrderBookProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { selectedCrypto } = useCrypto()
  const { connection } = useConnectionConfig()
  const [orderBook, setOrderBook] = useState<OrderBook>(DEFAULT_ORDER_BOOK)
  const [openOrders, setOpenOrders] = useState([])
  const { activeProduct, marketProductGroup, traderInfo } = useTraderConfig()

  useEffect(() => {
    if (selectedCrypto.type === 'crypto') {
      const subscriptions: number[] = []
      fetchOrderBook(subscriptions)
      return () => {
        setOrderBook(DEFAULT_ORDER_BOOK)
        subscriptions.forEach((sub) => connection.removeAccountChangeListener(sub))
      }
    } else if (selectedCrypto.type === 'perps' && marketProductGroup) {
      const refreshOrderbook = async () => {
        await fetchPerpsOrderBook()
      }
      const t = setInterval(refreshOrderbook, 1000)
      return () => clearInterval(t) // clear
    }
  }, [selectedCrypto.pair, marketProductGroup])

  useEffect(() => {
    if (selectedCrypto.type === 'perps' && marketProductGroup && traderInfo.traderRiskGroup) {
      const t = setInterval(fetchOpenOrders, 1000)
      return () => clearInterval(t) // clear
    }
  }, [traderInfo, marketProductGroup])

  const convertBidsAsks = (bids, asks) => {
    const bidReturn = bids.map((item) => {
      let size = item.size
      size = size / 10 ** activeProduct.decimals
      let price = item.price
      price = BigInt(price) >> BigInt(32)
      price = Number(price) * activeProduct.tick_size
      return [price, size, new anchor.BN(price), new anchor.BN(size)]
    })
    const askReturn = asks.map((item) => {
      let size = item.size
      size = size / 10 ** activeProduct.decimals
      let price = item.price
      price = BigInt(price) >> BigInt(32)
      price = Number(price) * activeProduct.tick_size
      return [price, size, new anchor.BN(price), new anchor.BN(size)]
    })
    return [bidReturn.reverse(), askReturn]
  }
  const fetchPerpsOrderBook = async () => {
    const bidResponse = await loadBidsSlab(connection, activeProduct.bids)
    const bidDepth = bidResponse.getL2DepthJS(10, true)
    const askResponse = await loadBidsSlab(connection, activeProduct.asks)
    const askDepth = askResponse.getL2DepthJS(10, true)
    const setBook = convertBidsAsks(bidDepth, askDepth)
    setOrderBook((prevState) => ({ ...prevState, asks: setBook[1], bids: setBook[0] }))

    //convertAOBtoPrice(marketProductGroup, depth[0].price.toString())
  }

  const fetchOpenOrders = async () => {
    const trg = traderInfo.traderRiskGroup
    //const activeIndex = trg.activeProducts
    const openAsk = trg.openOrders.products[0].askQtyInBook
    const openBid = trg.openOrders.products[0].bidQtyInBook
    setOpenOrders([openBid, openAsk])
  }

  const fetchOrderBook = async (subscriptions: number[]) => {
    try {
      const market = selectedCrypto.market ?? (await serum.getMarket(connection, selectedCrypto.pair))
      const asks = await market.loadAsks(connection)
      const bids = await market.loadBids(connection)
      setOrderBook((prevState) => ({ ...prevState, asks: asks.getL2(20), bids: bids.getL2(20) }))

      const subs = await Promise.all([
        serum.subscribeToOrderBook(connection, market, 'asks', (account, market) => {
          const asks = Orderbook.decode(market, account.data).getL2(20)
          setOrderBook((prevState) => ({ ...prevState, asks }))
        }),
        serum.subscribeToOrderBook(connection, market, 'bids', (account, market) => {
          const bids = Orderbook.decode(market, account.data).getL2(20)
          setOrderBook((prevState) => ({ ...prevState, bids }))
        })
      ])

      subs.forEach((sub) => subscriptions.push(sub))
    } catch (e: any) {
      await notify({ type: 'error', message: 'Error fetching serum order book', icon: 'rate_error' }, e)
    }
  }

  return <OrderBookContext.Provider value={{ orderBook, openOrders }}>{children}</OrderBookContext.Provider>
}

export const useOrderBook = (): IOrderBookConfig => {
  const context = useContext(OrderBookContext)
  if (!context) {
    throw new Error('Missing order book context')
  }

  return {
    orderBook: context.orderBook,
    openOrders: context.openOrders
  }
}
