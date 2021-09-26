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
import { useConnectionConfig } from './settings'
import { notify } from '../utils'
import { fetchPythPriceAccounts, fetchPythProducts, getPriceFromPriceAccount, getSerumLatestBid } from '../web3'

interface IFeaturedMarket {
  decimals: number
  market: string
  symbol: string
}

interface IFeaturedPrices {
  [symbol: string]: number
}

interface IMarketConfig {
  featuredPrices: IFeaturedPrices
  fetching: boolean
  setFeaturedList: Dispatch<SetStateAction<IFeaturedMarket[]>>
}

const MarketContext = createContext<IMarketConfig | null>(null)

export const MarketProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection } = useConnectionConfig()
  const [featuredList, setFeaturedList] = useState<IFeaturedMarket[]>([])
  const [featuredPrices, setFeaturedPrices] = useState<IFeaturedPrices>({})
  const [fetching, setFetching] = useState(true)

  const fetchFeatured = useCallback(async () => {
    try {
      const serumMarkets = featuredList.filter(({ market }) => market === 'serum')
      const results = await Promise.all(serumMarkets.map(({ symbol }) => getSerumLatestBid(connection, symbol)))
      setFeaturedPrices((prevState: IFeaturedPrices) => {
        const serumPrices = results.reduce((acc: IFeaturedPrices, price: number, index: number) => {
          const { decimals, symbol } = serumMarkets[index]
          acc[symbol] = Number(price.toFixed(decimals))
          return acc
        }, {})
        return { ...prevState, ...serumPrices }
      })
    } catch (e: any) {
      notify({ type: 'error', message: 'Error fetching featured serum markets', icon: 'error', description: e.message })
    }
  }, [connection, featuredList])

  useEffect(() => {
    ;(async () => {
      try {
        const pythMarkets = featuredList.filter(({ market }) => market === 'pyth')
        const products = await fetchPythProducts(
          connection,
          pythMarkets.map(({ symbol }) => symbol)
        )
        const accounts = await fetchPythPriceAccounts(connection, products)

        setFeaturedPrices((prevState) => {
          const pythPrices = accounts.reduce((acc: IFeaturedPrices, it, index) => {
            const { decimals } = pythMarkets[index]
            const { price, symbol } = it
            acc[symbol] = Number(price.toFixed(decimals))
            return acc
          }, {})
          return { ...prevState, ...pythPrices }
        })

        accounts.forEach(({ mint, symbol }) =>
          connection.onAccountChange(mint, (priceAccount) => {
            const [{ decimals }] = featuredList.filter(({ symbol: x }) => x === symbol)
            const price = getPriceFromPriceAccount(priceAccount)
            setFeaturedPrices((prevState) => ({ ...prevState, ...{ [symbol]: Number(price.toFixed(decimals)) } }))
          })
        )
      } catch (e: any) {
        notify({ type: 'error', message: 'Error loading pyth markets', icon: 'error', description: e.message })
      }
    })()
  }, [connection, featuredList])

  useEffect(() => {
    fetchFeatured().then(() => setFetching(false))
  }, [connection, fetchFeatured])

  return (
    <MarketContext.Provider
      value={{
        featuredPrices,
        fetching,
        setFeaturedList
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

  const { featuredPrices, fetching, setFeaturedList } = context
  return { featuredPrices, fetching, setFeaturedList }
}
