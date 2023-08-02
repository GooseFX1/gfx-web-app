/* eslint-disable */
import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'
import BN from 'bn.js'
import { Orderbook, Market } from 'openbook-ts/serum'
import { useConnectionConfig } from './settings'
import { notify } from '../utils'
import { serum } from '../web3'
import { MarketSide, useCrypto } from './crypto'
import { loadBidsSlab } from '../pages/TradeV3/perps/utils'
import { useTraderConfig } from './trader_risk_group'
import * as anchor from '@project-serum/anchor'
import { PublicKey } from '@solana/web3.js'
import { httpClient } from '../api'
import { GET_OPEN_ORDERS, GET_ORDERBOOK } from '../pages/TradeV3/perps/perpsConstants'
import { useWallet } from '@solana/wallet-adapter-react'

export type OrderBook = {
  [x in MarketSide]: [number, number, BN, BN, string?][]
}
// type perpsOpenOrder = {
//   [x in MarketSide]: [number, number][]
// }
interface IOrderBookConfig {
  orderBook: OrderBook
  openOrders: any[]
  perpsOpenOrders: any[]
  setPerpsOpenOrders: any
}

interface IOrderbookType {
  price: bigint
  size: bigint
  user: string
  orderId: string
}

export const DEFAULT_ORDER_BOOK = { asks: [], bids: [] }

const OrderBookContext = createContext<IOrderBookConfig | null>(null)

export const OrderBookProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { selectedCrypto, isDevnet } = useCrypto()
  const { connection } = useConnectionConfig()
  const [orderBook, setOrderBook] = useState<OrderBook>(DEFAULT_ORDER_BOOK)
  const [openOrders, setOpenOrders] = useState([])
  const [perpsOpenOrders, setPerpsOpenOrders] = useState([])
  const wallet = useWallet()
  const { activeProduct, marketProductGroup, traderInfo, setOrderBook: setOrderBookCopy } = useTraderConfig()

  useEffect(() => {
    const refreshOrderbook = async () => {
      await fetchPerpsOrderBook()
      if (wallet.connected && traderInfo.traderRiskGroupKey) {
        await fetchPerpsOpenOrders()
      } else {
        setPerpsOpenOrders([])
      }
    }
    const t2 = setInterval(refreshOrderbook, 500)
    return () => clearInterval(t2) // clear
  }, [selectedCrypto.pair, isDevnet, selectedCrypto.type, traderInfo, wallet.connected])

  const convertBidsAsks = (bids: IOrderbookType[], asks: IOrderbookType[]) => {
    const bidReturn: [number, number, BN, BN, string, string][] = bids.map((item) => {
      let size = item.size
      size = size / BigInt(10 ** activeProduct.decimals)
      let price = item.price
      price = BigInt(price) >> BigInt(32)
      return [
        Number(price) / activeProduct.tick_size,
        Number(size),
        new anchor.BN(Number(price)),
        new anchor.BN(Number(size)),
        item.user,
        item.orderId
      ]
    })
    const askReturn: [number, number, BN, BN, string, string][] = asks.map((item) => {
      let size = item.size
      size = size / BigInt(10 ** activeProduct.decimals)
      let price = item.price
      price = BigInt(price) >> BigInt(32)
      return [
        Number(price) / activeProduct.tick_size,
        Number(size),
        new anchor.BN(Number(price)),
        new anchor.BN(Number(size)),
        item.user,
        item.orderId
      ]
    })
    return [bidReturn.reverse(), askReturn]
  }

  const convertBidsAsksOld = (bids, asks) => {
    const bidReturn = bids.map((item) => {
      let size = item.size
      size = size / 10 ** activeProduct.decimals
      let price = item.price
      price = BigInt(price) >> BigInt(32)
      price = Number(price) / activeProduct.tick_size
      return [
        //new anchor.BN(Number(price)), new anchor.BN(Number(size)),
        price,
        size
      ]
    })
    const askReturn = asks.map((item) => {
      let size = item.size
      size = size / 10 ** activeProduct.decimals
      let price = item.price
      price = BigInt(price) >> BigInt(32)
      price = Number(price) / activeProduct.tick_size
      return [
        //new anchor.BN(Number(price)), new anchor.BN(Number(size)),
        price,
        size
      ]
    })
    return [bidReturn.reverse(), askReturn]
  }

  const fetchPerpsOrderBook = async () => {
    const res = await httpClient('api-services').post(`${GET_ORDERBOOK}`, {
      API_KEY: 'zxMTJr3MHk7GbFUCmcFyFV4WjiDAufDp',
      pairName: activeProduct.pairName,
      devnet: isDevnet
    })
    const orderbookBids = res.data?.bids.map((item) => [item.price, item.size])
    const orderbookAsks = res.data?.asks.map((item) => [item.price, item.size])
    setOrderBook((prevState) => ({ ...prevState, asks: orderbookAsks, bids: orderbookBids }))
    setOrderBookCopy((prevState) => ({ ...prevState, asks: orderbookAsks, bids: orderbookBids }))
  }

  const fetchPerpsOpenOrders = async () => {
    const res = await httpClient('api-services').post(`${GET_OPEN_ORDERS}`, {
      API_KEY: 'zxMTJr3MHk7GbFUCmcFyFV4WjiDAufDp',
      pairName: activeProduct.pairName,
      devnet: isDevnet
    })

    const perpsOrders = []
    const user = traderInfo.traderRiskGroupKey.toBase58()
    for (const ask of res.data.asks) {
      if (ask.user === user)
        perpsOrders.push({ order: { side: 'sell', price: ask.price, size: ask.size, orderId: ask.orderId } })
    }
    for (const bid of res.data.bids) {
      if (bid.user === user)
        perpsOrders.push({ order: { side: 'buy', price: bid.price, size: bid.size, orderId: bid.orderId } })
    }
    setPerpsOpenOrders(perpsOrders)
    //console.log('orders', perpsOrders, traderInfo.traderRiskGroupKey.toBase58())
  }

  return (
    <OrderBookContext.Provider value={{ orderBook, openOrders, perpsOpenOrders, setPerpsOpenOrders }}>
      {children}
    </OrderBookContext.Provider>
  )
}

export const useOrderBook = (): IOrderBookConfig => {
  const context = useContext(OrderBookContext)
  if (!context) {
    throw new Error('Missing order book context')
  }

  return context
}
