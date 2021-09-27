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
import { Orderbook } from '@project-serum/serum'
import { useConnectionConfig } from './settings'
import { notify } from '../utils'
import {
  fetchPythPriceAccounts,
  fetchPythProducts,
  getPriceFromPythPriceAccount,
  subscribeToSerumOrderBook
} from '../web3'

interface IMarket {
  decimals: number
  market: string
  symbol: string
}

interface IMarketData {
  change24H: number
  current: number
}

interface IMarketsData {
  [symbol: string]: IMarketData
}

interface IMarketConfig {
  formatSymbol: (x: string) => string
  getAssetFromSymbol: (x: string) => string
  marketsData: IMarketsData
  selectedMarket: IMarket
  setMarketsData: Dispatch<SetStateAction<IMarketsData>>
  setSelectedMarket: Dispatch<SetStateAction<IMarket>>
}

export const FEATURED_PAIRS_LIST = [
  { decimals: 1, market: 'serum', symbol: 'BTC/USDC' },
  { decimals: 2, market: 'serum', symbol: 'ETH/USDC' },
  { decimals: 3, market: 'serum', symbol: 'SOL/USDC' },
  { decimals: 2, market: 'pyth', symbol: 'LTC/USD' },
  { decimals: 3, market: 'serum', symbol: 'LINK/USDC' },
  { decimals: 2, market: 'pyth', symbol: 'AAPL/USD' },
  { decimals: 2, market: 'pyth', symbol: 'TSLA/USD' }
]

const MarketContext = createContext<IMarketConfig | null>(null)

export const MarketProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection } = useConnectionConfig()
  const [marketsData, setMarketsData] = useState<IMarketsData>(
    FEATURED_PAIRS_LIST.reduce(
      (acc: IMarketsData, it) => ({ ...acc, ...{ [it.symbol]: { change24H: 0, current: 0 } } }),
      {}
    )
  )
  const [selectedMarket, setSelectedMarket] = useState<IMarket>(FEATURED_PAIRS_LIST[0])

  const formatSymbol = (symbol: string) => symbol.replace('/', ' / ')
  const getAssetFromSymbol = (symbol: string): string => symbol.slice(0, symbol.indexOf('/'))

  const handlePythSubscription = useCallback(
    async (markets: IMarket[], subscriptions: number[]) => {
      try {
        const products = await fetchPythProducts(
          connection,
          markets.map(({ symbol }) => symbol)
        )
        try {
          const accounts = await fetchPythPriceAccounts(connection, products)
          accounts.forEach(({ mint, symbol }) =>
            subscriptions.push(
              connection.onAccountChange(mint, (priceAccount) => {
                const [{ decimals }] = FEATURED_PAIRS_LIST.filter(({ symbol: x }) => x === symbol)
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

  const handleSerumSubscription = useCallback(
    async (symbol: string, decimals: number, subscriptions: number[]) => {
      try {
        subscriptions.push(
          await subscribeToSerumOrderBook(connection, symbol, 'ask', (account, market) => {
            const [[price]] = Orderbook.decode(market, account.data).getL2(1)
            const newPrice = { [symbol]: { change24H: 0, current: Number(price.toFixed(decimals)) } }
            setMarketsData((prevState: IMarketsData) => ({ ...prevState, ...newPrice }))
          })
        )
      } catch (e: any) {
        notify({ type: 'error', message: 'Error fetching serum markets', icon: 'error', description: e.message })
      }
    },
    [connection]
  )

  useEffect(() => {
    let cancelled = false
    const subscriptions: number[] = []

    const serumMarkets = FEATURED_PAIRS_LIST.filter(({ market }) => market === 'serum')
    serumMarkets.forEach(
      ({ decimals, symbol }) => !cancelled && handleSerumSubscription(symbol, decimals, subscriptions)
    )

    const pythMarkets = FEATURED_PAIRS_LIST.filter(({ market }) => market === 'pyth')
    !cancelled && handlePythSubscription(pythMarkets, subscriptions)

    return () => {
      cancelled = true
      subscriptions.forEach((subscription) => connection.removeAccountChangeListener(subscription))
    }
  }, [connection, handlePythSubscription, handleSerumSubscription])

  useEffect(() => {
    let cancelled = false
    const subscriptions: number[] = []

    const { decimals, market, symbol } = selectedMarket
    if (market === 'serum') {
      !cancelled && handleSerumSubscription(symbol, decimals, subscriptions)
    } else if (market === 'pyth') {
      !cancelled && handlePythSubscription([selectedMarket], subscriptions)
    }

    return () => {
      cancelled = true
      subscriptions.forEach((sub) => connection.removeAccountChangeListener(sub))
    }
  }, [connection, handlePythSubscription, handleSerumSubscription, selectedMarket])

  return (
    <MarketContext.Provider
      value={{
        formatSymbol,
        getAssetFromSymbol,
        marketsData,
        selectedMarket,
        setMarketsData,
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
    formatSymbol: context.formatSymbol,
    getAssetFromSymbol: context.getAssetFromSymbol,
    marketsData: context.marketsData,
    selectedMarket: context.selectedMarket,
    setMarketsData: context.setMarketsData,
    setSelectedMarket: context.setSelectedMarket
  }
}
