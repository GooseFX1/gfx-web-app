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
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'

interface ICrypto {
  decimals: number
  market?: Market
  pair: string
  type: MarketType
}

interface IPrices {
  [x: string]: {
    change24H?: number
    current: number
  }
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
  orderBook: OrderBook
  prices: IPrices
  selectedCrypto: ICrypto
  setOrderBook: Dispatch<SetStateAction<OrderBook>>
  setSelectedCrypto: Dispatch<SetStateAction<ICrypto>>
}

export type MarketType = 'crypto' | 'synth'

export const FEATURED_PAIRS_LIST = [
  { decimals: 1, pair: 'BTC/USDC', type: 'crypto' as MarketType },
  { decimals: 2, pair: 'ETH/USDC', type: 'crypto' as MarketType },
  { decimals: 3, pair: 'SOL/USDC', type: 'crypto' as MarketType },
  { decimals: 3, pair: 'LINK/USDC', type: 'crypto' as MarketType },
  { decimals: 2, pair: 'AAPL/USD', type: 'synth' as MarketType },
  { decimals: 2, pair: 'AMZN/USD', type: 'synth' as MarketType },
  { decimals: 2, pair: 'TSLA/USD', type: 'synth' as MarketType }
]

const DEFAULT_ORDER_BOOK = { asks: [], bids: [] }
const REFRESH_INTERVAL = 1000

const CryptoContext = createContext<ICryptoConfig | null>(null)

export const CryptoProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection, network } = useConnectionConfig()
  const [orderBook, setOrderBook] = useState<OrderBook>(DEFAULT_ORDER_BOOK)
  const [prices, setPrices] = useState<IPrices>({})
  const [selectedCrypto, setSelectedCrypto] = useState<ICrypto>(FEATURED_PAIRS_LIST[0])

  const formatPair = (symbol: string) => symbol.replace('/', ' / ')
  const getAskSymbolFromPair = (pair: string): string => pair.slice(0, pair.indexOf('/'))
  const getBidSymbolFromPair = (pair: string): string => pair.slice(pair.indexOf('/') + 1)
  const getSymbolFromPair = (pair: string, side: 'buy' | 'sell'): string => {
    return side === 'buy' ? getBidSymbolFromPair(pair) : getAskSymbolFromPair(pair)
  }

  const fetchPrices = useCallback(async () => {
    let cancelled = false
    const newPrices: IPrices = {}

    const cryptoMarkets = FEATURED_PAIRS_LIST.filter(({ type }) => type === 'crypto')
    if (network === WalletAdapterNetwork.Mainnet) {
      for (const { pair } of cryptoMarkets) {
        if (!cancelled) {
          try {
            const current = await serum.getLatestBid(connection, pair)
            newPrices[pair] = { current }
          } catch (e: any) {
            await notify({ type: 'error', message: 'Error fetching serum markets', icon: 'rate_error' }, e)
          }
        }
      }
    }

    try {
      const synths = FEATURED_PAIRS_LIST.filter(({ type }) => type === 'synth').map(({ pair }) => pair)
      const products = await pyth.fetchProducts(connection, network, synths)
      try {
        const accounts = await pyth.fetchPriceAccounts(connection, products)
        for (const { price, symbol } of accounts) {
          newPrices[symbol] = { current: price }
        }
      } catch (e: any) {
        await notify({ type: 'error', message: 'Error fetching pyth price accounts', icon: 'rate_error' }, e)
      }
    } catch (e: any) {
      await notify({ type: 'error', message: 'Error fetching pyth products', icon: 'rate_error' }, e)
    }

    setPrices((prevState) => ({ ...prevState, ...newPrices }))
  }, [connection, network])

  useEffect(() => {
    const intervals: NodeJS.Timer[] = []
    fetchPrices().then(() => intervals.push(setInterval(() => fetchPrices(), REFRESH_INTERVAL)))

    return () => {
      intervals.forEach((interval) => clearInterval(interval))
    }
  }, [connection, fetchPrices, network])

  useEffect(() => {
    let cancelled = false
    const subscriptions: number[] = []

    network === WalletAdapterNetwork.Mainnet &&
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
      })()

    return () => {
      cancelled = true
      setOrderBook(DEFAULT_ORDER_BOOK)
      subscriptions.forEach((sub) => connection.removeAccountChangeListener(sub))
    }
  }, [connection, network, selectedCrypto.pair, selectedCrypto.type])

  return (
    <CryptoContext.Provider
      value={{
        formatPair,
        getAskSymbolFromPair,
        getBidSymbolFromPair,
        getSymbolFromPair,
        orderBook,
        prices,
        selectedCrypto,
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
    orderBook: context.orderBook,
    prices: context.prices,
    selectedCrypto: context.selectedCrypto,
    setOrderBook: context.setOrderBook,
    setSelectedCrypto: context.setSelectedCrypto
  }
}
