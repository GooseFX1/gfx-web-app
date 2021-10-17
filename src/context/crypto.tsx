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
import { Market, Orderbook } from '@project-serum/serum'
import { useConnectionConfig } from './settings'
import { notify } from '../utils'
import { pyth, serum } from '../web3'

interface ICrypto {
  decimals: number
  market?: Market
  pair: string
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
  { decimals: 3, pair: 'LINK/USDC', type: 'crypto' as MarketType },
  { decimals: 2, pair: 'gAAPL/gUSD', type: 'synth' as MarketType },
  { decimals: 2, pair: 'gFB/gUSD', type: 'synth' as MarketType },
  { decimals: 2, pair: 'gTSLA/gUSD', type: 'synth' as MarketType }
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
        const products = await pyth.fetchProducts(
          connection,
          markets.map(({ pair }) => pair)
        )
        try {
          const accounts = await pyth.fetchPriceAccounts(connection, products)
          accounts.forEach(({ mint, symbol }) =>
            subscriptions.push(
              connection.onAccountChange(mint, (priceAccount) => {
                const [{ decimals }] = FEATURED_PAIRS_LIST.filter(({ pair }) => pair === symbol)
                const price = pyth.getPriceFromPriceAccount(priceAccount)
                setMarketsData((prevState: ICryptoMarkets) => ({
                  ...prevState,
                  ...{ [symbol]: { change24H: 0, current: Number(price.toFixed(decimals)) } }
                }))
              })
            )
          )
        } catch (e: any) {
          notify({ type: 'error', message: 'Error fetching pyth price accounts', icon: 'rate_error' }, e)
        }
      } catch (e: any) {
        notify({ type: 'error', message: 'Error fetching pyth products', icon: 'rate_error' }, e)
      }
    },
    [connection]
  )

  useEffect(() => {
    let cancelled = false
    const subscriptions: number[] = []

    const cryptoMarkets = FEATURED_PAIRS_LIST.filter(({ type }) => type === 'crypto')
    cryptoMarkets.forEach(async ({ pair }) => {
      if (!cancelled) {
        try {
          const market = await serum.getMarket(connection, pair)
          subscriptions.push(
            await serum.subscribeToOrderBook(connection, market, 'asks', (account, market) => {
              const [[current]] = Orderbook.decode(market, account.data).getL2(1)
              const newPrice = { [pair]: { change24H: 0, current } }
              setMarketsData((prevState: ICryptoMarkets) => ({ ...prevState, ...newPrice }))
            })
          )
        } catch (e: any) {
          notify({ type: 'error', message: 'Error fetching serum markets', icon: 'rate_error' }, e)
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

    selectedCrypto.type === 'crypto' &&
      !cancelled &&
      (async () => {
        try {
          const market = await serum.getMarket(connection, selectedCrypto.pair)
          setSelectedCrypto((prevState) => ({ ...prevState, market }))

          const asks = await serum.getAsks(connection, selectedCrypto.pair)
          setOrderBook((prevState) => ({ ...prevState, asks: asks.getL2(20) }))
          const bids = await serum.getBids(connection, selectedCrypto.pair)
          setOrderBook((prevState) => ({ ...prevState, bids: bids.getL2(20) }))

          const subs = await Promise.all([
            serum.subscribeToOrderBook(connection, market, 'asks', (account, market) => {
              const asks = Orderbook.decode(market, account.data).getL2(20)
              setMarketsData((prevState: ICryptoMarkets) => ({
                ...prevState,
                ...{ [selectedCrypto.pair]: { change24H: 0, current: asks[0][0] } }
              }))
              setOrderBook((prevState) => ({ ...prevState, asks }))
            }),
            serum.subscribeToOrderBook(connection, market, 'bids', (account, market) => {
              const bids = Orderbook.decode(market, account.data).getL2(20)
              setOrderBook((prevState) => ({ ...prevState, bids }))
            })
          ])

          subs.forEach((sub) => subscriptions.push(sub))
        } catch (e: any) {
          notify({ type: 'error', message: 'Error fetching serum order book', icon: 'rate_error' }, e)
        }
      })()

    return () => {
      cancelled = true
      setOrderBook(DEFAULT_ORDER_BOOK)
      subscriptions.forEach((sub) => connection.removeAccountChangeListener(sub))
    }
  }, [connection, handlePythSubscription, selectedCrypto.pair, selectedCrypto.type])

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
