import React, {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { Market, Orderbook } from '@project-serum/serum'
import { ENDPOINTS } from './settings'
import { notify } from '../utils'
import { pyth, serum } from '../web3'
import { Connection } from '@solana/web3.js'
import { parsePriceData } from '@pythnetwork/client'

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

interface ICryptoConfig {
  formatPair: (x: string) => string
  getAskSymbolFromPair: (x: string) => string
  getBidSymbolFromPair: (x: string) => string
  getSymbolFromPair: (x: string, y: 'buy' | 'sell') => string
  prices: IPrices
  selectedCrypto: ICrypto
  setSelectedCrypto: Dispatch<SetStateAction<ICrypto>>
}

export type MarketType = 'crypto' | 'synth'

export const FEATURED_PAIRS_LIST = [
  { decimals: 3, pair: 'GOFX/USDC', type: 'crypto' as MarketType },
  { decimals: 1, pair: 'BTC/USDC', type: 'crypto' as MarketType },
  { decimals: 2, pair: 'ETH/USDC', type: 'crypto' as MarketType },
  { decimals: 3, pair: 'SOL/USDC', type: 'crypto' as MarketType },
  { decimals: 3, pair: 'LINK/USDC', type: 'crypto' as MarketType },
  { decimals: 2, pair: 'AAPL/USD', type: 'synth' as MarketType },
  { decimals: 2, pair: 'AMZN/USD', type: 'synth' as MarketType },
  { decimals: 2, pair: 'TSLA/USD', type: 'synth' as MarketType }
]

const CryptoContext = createContext<ICryptoConfig | null>(null)

export const CryptoProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<IPrices>({})
  const [selectedCrypto, setSelectedCrypto] = useState<ICrypto>(FEATURED_PAIRS_LIST[0])

  const formatPair = (symbol: string) => symbol.replace('/', ' / ')
  const getAskSymbolFromPair = (pair: string): string => pair.slice(0, pair.indexOf('/'))
  const getBidSymbolFromPair = (pair: string): string => pair.slice(pair.indexOf('/') + 1)
  const getSymbolFromPair = (pair: string, side: 'buy' | 'sell'): string => {
    return side === 'buy' ? getBidSymbolFromPair(pair) : getAskSymbolFromPair(pair)
  }

  const connection = useMemo(() => new Connection(ENDPOINTS[2].endpoint, 'recent'), [])

  useEffect(() => {
    ;(async () => {
      try {
        const market = await serum.getMarket(connection, selectedCrypto.pair)
        setSelectedCrypto((prevState) => ({ ...prevState, market }))
      } catch (e) {}
    })()
  }, [connection, selectedCrypto.pair])

  useEffect(() => {
    let cancelled = false
    const subscriptions: number[] = []

    !cancelled &&
      (async () => {
        const cryptoMarkets = FEATURED_PAIRS_LIST.filter(({ type }) => type === 'crypto')
        for (const { pair } of cryptoMarkets) {
          if (!cancelled) {
            try {
              const market = await serum.getMarket(connection, pair)
              const current = await serum.getLatestBid(connection, pair)
              setPrices((prevState) => ({ ...prevState, [pair]: { current } }))
              subscriptions.push(
                await serum.subscribeToOrderBook(connection, market, 'bids', (account, market) => {
                  const [[current]] = Orderbook.decode(market, account.data).getL2(20)
                  setPrices((prevState) => ({ ...prevState, [pair]: { current } }))
                })
              )
            } catch (e: any) {
              await notify({ type: 'error', message: 'Error fetching serum markets', icon: 'rate_error' }, e)
            }
          }
        }

        try {
          const synths = FEATURED_PAIRS_LIST.filter(({ type }) => type === 'synth').map(({ pair }) => pair)
          const products = await pyth.fetchProducts(connection, synths)
          try {
            const accounts = await pyth.fetchPriceAccounts(connection, products)
            for (const { price, priceAccountKey, symbol } of accounts) {
              setPrices((prevState) => ({ ...prevState, [symbol]: { current: parseFloat(price.toFixed(2)) } }))
              subscriptions.push(
                connection.onAccountChange(priceAccountKey, ({ data }) => {
                  const { price } = parsePriceData(data)
                  setPrices((prevState) => ({ ...prevState, [symbol]: { current: parseFloat(price.toFixed(2)) } }))
                })
              )
            }
          } catch (e: any) {
            await notify({ type: 'error', message: 'Error fetching pyth price accounts', icon: 'rate_error' }, e)
          }
        } catch (e: any) {
          await notify({ type: 'error', message: 'Error fetching pyth products', icon: 'rate_error' }, e)
        }
      })()

    return () => {
      cancelled = true
      subscriptions.forEach((sub) => connection.removeAccountChangeListener(sub))
    }
  }, [connection])

  return (
    <CryptoContext.Provider
      value={{
        formatPair,
        getAskSymbolFromPair,
        getBidSymbolFromPair,
        getSymbolFromPair,
        prices,
        selectedCrypto,
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
    prices: context.prices,
    selectedCrypto: context.selectedCrypto,
    setSelectedCrypto: context.setSelectedCrypto
  }
}
