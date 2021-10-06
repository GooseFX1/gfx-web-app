import React, {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'
import BN from 'bn.js'
import { Orderbook } from '@project-serum/serum'
import { useConnectionConfig } from './settings'
import { notify } from '../utils'
import {
  fetchPythPriceAccounts,
  fetchPythProducts,
  getPriceFromPythPriceAccount, getSerumMarket,
  subscribeToSerumOrderBook
} from '../web3'

interface IMarket {
  decimals: number
  market: MarketType
  pair: string
  tickSize?: number
}

interface IMarketData {
  change24H: number
  current: number
}

interface IMarketsData {
  [x: string]: IMarketData
}

export type MarketSide = 'asks' | 'bids'

type OrderBook = {
  [x in MarketSide]: [number, number, BN, BN][]
}

interface IMarketConfig {
  formatPair: (x: string) => string
  getAskSymbolFromPair: (x: string) => string
  getBidSymbolFromPair: (x: string) => string
  getSymbolFromPair: (x: string, y: 'buy' | 'sell') => string
  marketsData: IMarketsData
  orderBook: OrderBook
  selectedMarket: IMarket
  setMarketsData: Dispatch<SetStateAction<IMarketsData>>
  setOrderBook: Dispatch<SetStateAction<OrderBook>>
  setSelectedMarket: Dispatch<SetStateAction<IMarket>>
}

export type MarketType = 'crypto' | 'synth'

export const FEATURED_PAIRS_LIST = [
  /* { decimals: 1, market: 'crypto' as MarketType, pair: 'BTC/USDC' },
  { decimals: 2, market: 'crypto' as MarketType, pair: 'ETH/USDC' }, */
  { decimals: 3, market: 'crypto' as MarketType, pair: 'SOL/USDC' },
  /* { decimals: 2, market: 'synth' as MarketType, pair: 'LTC/USD' },
  { decimals: 3, market: 'crypto' as MarketType, pair: 'LINK/USDC' },
  { decimals: 2, market: 'synth' as MarketType, pair: 'AAPL/USD' },
  { decimals: 2, market: 'synth' as MarketType, pair: 'TSLA/USD' } */
]

const DEFAULT_MARKETS_DATA = FEATURED_PAIRS_LIST.reduce(
  (acc: IMarketsData, it) => ({ ...acc, ...{ [it.pair]: { change24H: 0, current: 0 } } }),
  {}
)
const DEFAULT_ORDER_BOOK = { asks: [], bids: [] }

const MarketContext = createContext<IMarketConfig | null>(null)

export const MarketProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection } = useConnectionConfig()
  const [marketsData, setMarketsData] = useState<IMarketsData>(DEFAULT_MARKETS_DATA)
  const [orderBook, setOrderBook] = useState<OrderBook>(DEFAULT_ORDER_BOOK)
  const [selectedMarket, setSelectedMarket] = useState<IMarket>(FEATURED_PAIRS_LIST[0])

  const formatPair = (symbol: string) => symbol.replace('/', ' / ')
  const getAskSymbolFromPair = (pair: string): string => pair.slice(0, pair.indexOf('/'))
  const getBidSymbolFromPair = (pair: string): string => pair.slice(pair.indexOf('/') + 1)
  const getSymbolFromPair = (pair: string, side: 'buy' | 'sell'): string => {
    return side === 'buy' ? getBidSymbolFromPair(pair) : getAskSymbolFromPair(pair)
  }

  const handlePythSubscription = useCallback(
    async (markets: IMarket[], subscriptions: number[]) => {
      try {
        const products = await fetchPythProducts(
          connection,
          markets.map(({ pair }) => pair)
        )
        try {
          const accounts = await fetchPythPriceAccounts(connection, products)
          accounts.forEach(({ mint, symbol }) =>
            subscriptions.push(
              connection.onAccountChange(mint, (priceAccount) => {
                const [{ decimals }] = FEATURED_PAIRS_LIST.filter(({ pair }) => pair === symbol)
                const price = getPriceFromPythPriceAccount(priceAccount)
                setMarketsData((prevState: IMarketsData) => ({
                  ...prevState,
                  ...{ [symbol]: { change24H: 0, current: Number(price.toFixed(decimals)) } }
                }))
              })
            )
          )
        } catch (e: any) {
          notify({
            type: 'error',
            message: 'Error fetching pyth price accounts',
            icon: 'error',
            description: e.message
          })
        }
      } catch (e: any) {
        notify({ type: 'error', message: 'Error fetching pyth products', icon: 'error', description: e.message })
      }
    },
    [connection]
  )

  useEffect(() => {
    let cancelled = false
    const subscriptions: number[] = []

    const cryptoMarkets = FEATURED_PAIRS_LIST.filter(({ market }) => market === 'crypto')
    cryptoMarkets.forEach(async ({ decimals, pair }) => {
      if (!cancelled) {
        try {
          const market = await getSerumMarket(connection, pair)
          subscriptions.push(
            await subscribeToSerumOrderBook(connection, market, 'asks', (account, market) => {
              const [[price]] = Orderbook.decode(market, account.data).getL2(1)
              const newPrice = { [pair]: { change24H: 0, current: Number(price.toFixed(decimals)) } }
              setMarketsData((prevState: IMarketsData) => ({ ...prevState, ...newPrice }))
            })
          )
        } catch (e: any) {
          notify({ type: 'error', message: 'Error fetching serum markets', icon: 'error', description: e.message })
        }
      }
    })

    const synthMarkets = FEATURED_PAIRS_LIST.filter(({ market }) => market === 'synth')
    !cancelled && handlePythSubscription(synthMarkets, subscriptions)

    return () => {
      cancelled = true
      setMarketsData(DEFAULT_MARKETS_DATA)
      setOrderBook(DEFAULT_ORDER_BOOK)
      subscriptions.forEach((subscription) => connection.removeAccountChangeListener(subscription))
    }
  }, [connection, handlePythSubscription])

  useEffect(() => {
    let cancelled = false
    const subscriptions: number[] = []
    const { decimals, market, pair } = selectedMarket

    if (market === 'crypto') {
      !cancelled &&
        (async () => {
          try {
            const market = await getSerumMarket(connection, pair)
            setSelectedMarket(prevState => ({ ...prevState, tickSize: market.tickSize }))

            const subs = await Promise.all([
              subscribeToSerumOrderBook(connection, market, 'asks', (account, market) => {
                const orderBook = Orderbook.decode(market, account.data).getL2(22)
                const newPrice = { [pair]: { change24H: 0, current: Number(orderBook[0][0].toFixed(decimals)) } }
                setMarketsData((prevState: IMarketsData) => ({ ...prevState, ...newPrice }))
                setOrderBook((prevState) => ({ ...prevState, asks: [...orderBook] }))
              }),
              subscribeToSerumOrderBook(connection, market, 'bids', (account, market) =>
                setOrderBook((prevState) => ({
                  ...prevState,
                  bids: [...Orderbook.decode(market, account.data).getL2(22)]
                }))
              )
            ])

            subs.forEach((sub) => subscriptions.push(sub))
          } catch (e: any) {
            notify({ type: 'error', message: 'Error fetching serum order book', icon: 'error', description: e.message })
          }
        })()
    }

    return () => {
      cancelled = true
      setOrderBook(DEFAULT_ORDER_BOOK)
      subscriptions.forEach((sub) => connection.removeAccountChangeListener(sub))
    }
  }, [connection, handlePythSubscription, selectedMarket])

  return (
    <MarketContext.Provider
      value={{
        formatPair,
        getAskSymbolFromPair,
        getBidSymbolFromPair,
        getSymbolFromPair,
        marketsData,
        orderBook,
        selectedMarket,
        setMarketsData,
        setOrderBook,
        setSelectedMarket
      }}
    >
      {children}
    </MarketContext.Provider>
  )
}

export const useMarket = (): IMarketConfig => {
  const context = useContext(MarketContext)
  if (!context) {
    throw new Error('Missing market context')
  }

  return {
    formatPair: context.formatPair,
    getAskSymbolFromPair: context.getAskSymbolFromPair,
    getBidSymbolFromPair: context.getBidSymbolFromPair,
    getSymbolFromPair: context.getSymbolFromPair,
    marketsData: context.marketsData,
    orderBook: context.orderBook,
    selectedMarket: context.selectedMarket,
    setMarketsData: context.setMarketsData,
    setOrderBook: context.setOrderBook,
    setSelectedMarket: context.setSelectedMarket
  }
}
