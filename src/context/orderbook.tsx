/* eslint-disable */
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
import { PublicKey } from '@solana/web3.js'

type OrderBook = {
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
}

const DEFAULT_ORDER_BOOK = { asks: [], bids: [] }

const OrderBookContext = createContext<IOrderBookConfig | null>(null)

export const OrderBookProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { selectedCrypto } = useCrypto()
  const { connection } = useConnectionConfig()
  const [orderBook, setOrderBook] = useState<OrderBook>(DEFAULT_ORDER_BOOK)
  const [openOrders, setOpenOrders] = useState([])
  const [perpsOpenOrders, setPerpsOpenOrders] = useState([])
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
  }, [selectedCrypto.pair, marketProductGroup, selectedCrypto.type])

  useEffect(() => {
    if (traderInfo.traderRiskGroupKey) fetchPerpsOpenOrders()
  }, [traderInfo, orderBook])

  const convertBidsAsks = (bids: IOrderbookType[], asks: IOrderbookType[]) => {
    const bidReturn: [number, number, BN, BN, string][] = bids.map((item) => {
      let size = item.size
      size = size / BigInt(10 ** activeProduct.decimals)
      let price = item.price
      price = BigInt(price) >> BigInt(32)
      price = BigInt(price) / BigInt(activeProduct.tick_size)
      return [Number(price), Number(size), new anchor.BN(Number(price)), new anchor.BN(Number(size)), item.user]
    })
    const askReturn: [number, number, BN, BN, string][] = asks.map((item) => {
      let size = item.size
      size = size / BigInt(10 ** activeProduct.decimals)
      let price = item.price
      price = BigInt(price) >> BigInt(32)
      price = BigInt(price) / BigInt(activeProduct.tick_size)
      return [Number(price), Number(size), new anchor.BN(Number(price)), new anchor.BN(Number(size)), item.user]
    })
    return [bidReturn.reverse(), askReturn]
  }

  const fetchPerpsOrderBook = async () => {
    const bidResponse = await loadBidsSlab(connection, activeProduct.bids)
    const askResponse = await loadBidsSlab(connection, activeProduct.asks)
    const bids: IOrderbookType[] = []
    const asks: IOrderbookType[] = []

    for (const bid of bidResponse.items(false)) {
      const callbackBuffer = bidResponse.getCallBackInfo(bid.callBackInfoPt)
      bids.push({
        price: BigInt(bid.getPrice().toString()),
        size: BigInt(bid.baseQuantity.toString()),
        user: new PublicKey(callbackBuffer.slice(0, 32)).toBase58()
      })
    }
    for (const ask of askResponse.items(false)) {
      const callbackBuffer = askResponse.getCallBackInfo(ask.callBackInfoPt)
      asks.push({
        price: BigInt(ask.getPrice().toString()),
        size: BigInt(ask.baseQuantity.toString()),
        user: new PublicKey(callbackBuffer.slice(0, 32)).toBase58()
      })
    }
    const setBook = convertBidsAsks(bids, asks)
    setOrderBook((prevState) => ({ ...prevState, asks: setBook[1], bids: setBook[0] }))
  }

  const fetchPerpsOpenOrders = async () => {
    const perpsOrders = []
    const user = traderInfo.traderRiskGroupKey.toBase58()
    //console.log('open: ', orderBook.asks)
    for (const ask of orderBook.asks) {
      for (const i of ask) {
        if (i === user) perpsOrders.push({ order: { side: 'sell', price: ask[0], size: ask[1] } })
      }
    }
    for (const bid of orderBook.bids) {
      for (const i of bid) {
        if (i === user) perpsOrders.push({ order: { side: 'buy', price: bid[0], size: bid[1] } })
      }
    }
    setPerpsOpenOrders(perpsOrders)
    //console.log('orders', perpsOrders, traderInfo.traderRiskGroupKey.toBase58())
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

  return {
    orderBook: context.orderBook,
    openOrders: context.openOrders,
    perpsOpenOrders: context.perpsOpenOrders,
    setPerpsOpenOrders: context.setPerpsOpenOrders
  }
}
