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
  getPriceFromPythPriceAccount,
  getSerumMarket,
  subscribeToSerumOrderBook
} from '../web3'

interface ICrypto {
  decimals: number
  pair: string
  tickSize?: number
  type: MarketType
}

interface ICryptoData {
  change24H: number
  current: number
}

interface ICryptoMarkets {
  [x: string]: ICryptoData
}

export type MarketSide = 'asks' | 'bids'

type OrderBook = {
  [x in MarketSide]: [number, number, BN, BN][]
}

interface ICryptoConfig {
  formatPair: (x: string) => string
  getAskSymbolFromPair: (x: string) => string
  getBidSymbolFromPair: (x: string) => string
  getSymbolFromPair: (x: string, y: 'buy' | 'sell') => string
  marketsData: ICryptoMarkets
  orderBook: OrderBook
  selectedCrypto: ICrypto
  setMarketsData: Dispatch<SetStateAction<ICryptoMarkets>>
  setOrderBook: Dispatch<SetStateAction<OrderBook>>
  setSelectedCrypto: Dispatch<SetStateAction<ICrypto>>
}

export type MarketType = 'crypto' | 'synth'

export const FEATURED_PAIRS_LIST = [
  { decimals: 1, pair: 'BTC/USDC', type: 'crypto' as MarketType },
  { decimals: 2, pair: 'ETH/USDC', type: 'crypto' as MarketType },
  { decimals: 3, pair: 'SOL/USDC', type: 'crypto' as MarketType },
  { decimals: 2, pair: 'LTC/USD', type: 'synth' as MarketType },
  { decimals: 3, pair: 'LINK/USDC', type: 'crypto' as MarketType },
  { decimals: 2, pair: 'AAPL/USD', type: 'synth' as MarketType },
  { decimals: 2, pair: 'TSLA/USD', type: 'synth' as MarketType }
]

const DEFAULT_MARKETS_DATA = FEATURED_PAIRS_LIST.reduce(
  (acc: ICryptoMarkets, it) => ({ ...acc, ...{ [it.pair]: { change24H: 0, current: 0 } } }),
  {}
)
const DEFAULT_ORDER_BOOK = { asks: [], bids: [] }

const CryptoContext = createContext<ICryptoConfig | null>(null)

export const CryptoProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection } = useConnectionConfig()
  const [marketsData, setMarketsData] = useState<ICryptoMarkets>(DEFAULT_MARKETS_DATA)
  const [orderBook, setOrderBook] = useState<OrderBook>(DEFAULT_ORDER_BOOK)
  const [selectedCrypto, setSelectedCrypto] = useState<ICrypto>(FEATURED_PAIRS_LIST[0])

  const formatPair = (symbol: string) => symbol.replace('/', ' / ')
  const getAskSymbolFromPair = (pair: string): string => pair.slice(0, pair.indexOf('/'))
  const getBidSymbolFromPair = (pair: string): string => pair.slice(pair.indexOf('/') + 1)
  const getSymbolFromPair = (pair: string, side: 'buy' | 'sell'): string => {
    return side === 'buy' ? getBidSymbolFromPair(pair) : getAskSymbolFromPair(pair)
  }

  const handlePythSubscription = useCallback(
    async (markets: ICrypto[], subscriptions: number[]) => {
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
                setMarketsData((prevState: ICryptoMarkets) => ({
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

    const cryptoMarkets = FEATURED_PAIRS_LIST.filter(({ type }) => type === 'crypto')
    cryptoMarkets.forEach(async ({ decimals, pair }) => {
      if (!cancelled) {
        try {
          const market = await getSerumMarket(connection, pair)
          subscriptions.push(
            await subscribeToSerumOrderBook(connection, market, 'asks', (account, market) => {
              const [[price]] = Orderbook.decode(market, account.data).getL2(1)
              const newPrice = { [pair]: { change24H: 0, current: Number(price.toFixed(decimals)) } }
              setMarketsData((prevState: ICryptoMarkets) => ({ ...prevState, ...newPrice }))
            })
          )
        } catch (e: any) {
          notify({ type: 'error', message: 'Error fetching serum markets', icon: 'error', description: e.message })
        }
      }
    })

    const synthMarkets = FEATURED_PAIRS_LIST.filter(({ type }) => type === 'synth')
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
    const { decimals, pair, type } = selectedCrypto

    if (type === 'crypto') {
      !cancelled &&
        (async () => {
          try {
            const market = await getSerumMarket(connection, pair)
            setSelectedCrypto((prevState) => ({ ...prevState, tickSize: market.tickSize }))

            const subs = await Promise.all([
              subscribeToSerumOrderBook(connection, market, 'asks', (account, market) => {
                const orderBook = Orderbook.decode(market, account.data).getL2(20)
                const newPrice = { [pair]: { change24H: 0, current: Number(orderBook[0][0].toFixed(decimals)) } }
                setMarketsData((prevState: ICryptoMarkets) => ({ ...prevState, ...newPrice }))
                setOrderBook((prevState) => ({ ...prevState, asks: [...orderBook] }))
              }),
              subscribeToSerumOrderBook(connection, market, 'bids', (account, market) =>
                setOrderBook((prevState) => ({
                  ...prevState,
                  bids: [...Orderbook.decode(market, account.data).getL2(20)]
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
  }, [connection, handlePythSubscription, selectedCrypto])

  return (
    <CryptoContext.Provider
      value={{
        formatPair,
        getAskSymbolFromPair,
        getBidSymbolFromPair,
        getSymbolFromPair,
        marketsData,
        orderBook,
        selectedCrypto: selectedCrypto,
        setMarketsData,
        setOrderBook,
        setSelectedCrypto
      }}
    >
      {children}
    </CryptoContext.Provider>
  )
}

export const useCrypto = (): ICryptoConfig => {
  const context = useContext(CryptoContext)
  if (!context) {
    throw new Error('Missing crypto context')
  }

  return {
    formatPair: context.formatPair,
    getAskSymbolFromPair: context.getAskSymbolFromPair,
    getBidSymbolFromPair: context.getBidSymbolFromPair,
    getSymbolFromPair: context.getSymbolFromPair,
    marketsData: context.marketsData,
    orderBook: context.orderBook,
    selectedCrypto: context.selectedCrypto,
    setMarketsData: context.setMarketsData,
    setOrderBook: context.setOrderBook,
    setSelectedCrypto: context.setSelectedCrypto
  }
}
