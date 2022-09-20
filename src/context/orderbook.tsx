import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'
import BN from 'bn.js'
import { Orderbook } from '@project-serum/serum'
import { useConnectionConfig } from './settings'
import { notify } from '../utils'
import { serum } from '../web3'
import { MarketSide, useCrypto } from './crypto'

type OrderBook = {
  [x in MarketSide]: [number, number, BN, BN][]
}

interface IOrderBookConfig {
  orderBook: OrderBook
}

const DEFAULT_ORDER_BOOK = { asks: [], bids: [] }

const OrderBookContext = createContext<IOrderBookConfig | null>(null)

export const OrderBookProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { selectedCrypto } = useCrypto()
  const { connection } = useConnectionConfig()
  const [orderBook, setOrderBook] = useState<OrderBook>(DEFAULT_ORDER_BOOK)

  useEffect(() => {
    const subscriptions: number[] = []
    fetchOrderBook(subscriptions)
    return () => {
      setOrderBook(DEFAULT_ORDER_BOOK)
      subscriptions.forEach((sub) => connection.removeAccountChangeListener(sub))
    }
  }, [selectedCrypto.pair])

  const fetchOrderBook = async (subscriptions: number[]) => {
    try {
      const market = await serum.getMarket(connection, selectedCrypto.pair)
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

  return <OrderBookContext.Provider value={{ orderBook }}>{children}</OrderBookContext.Provider>
}

export const useOrderBook = (): IOrderBookConfig => {
  const context = useContext(OrderBookContext)
  if (!context) {
    throw new Error('Missing order book context')
  }

  return {
    orderBook: context.orderBook
  }
}
