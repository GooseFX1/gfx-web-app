import React, {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState
} from 'react'
import { Market } from 'openbook-ts/serum'
import { useConnectionConfig } from './settings'
import MARKET_PAIRS from '../pages/TradeV3/constants/MARKET_PAIRS.json'
import MARKET_PAIRS_DEVNET from '../pages/TradeV3/constants/MARKET_PAIRS_DEVNET.json'

interface ICrypto {
  market?: Market
  pair: string
  type?: MarketType
  coinGecko?: any
  marketAddress: string
  display: string
}

export type MarketSide = 'asks' | 'bids'

interface ICryptoConfig {
  pairs: any
  formatPair: (x: string) => string
  getAskSymbolFromPair: (x: string) => string
  getBidSymbolFromPair: (x: string) => string
  getSymbolFromPair: (x: string, y: 'buy' | 'sell' | 'bid' | 'ask') => string
  selectedCrypto: ICrypto
  setSelectedCrypto: Dispatch<SetStateAction<ICrypto>>
  filteredSearchPairs: any
  setFilteredSearchPairs: Dispatch<SetStateAction<any>>
  isDevnet: boolean
  setIsDevnet: Dispatch<SetStateAction<boolean>>
}

export type MarketType = 'mainnet' | 'devnet'

export const FEATURED_PAIRS_LIST = [
  { pair: 'GOFX/USDC', type: 'crypto' as MarketType, coinGecko: 'goosefx' },
  { pair: 'BTC/USDC', type: 'crypto' as MarketType, coinGecko: 'bitcoin' },
  { pair: 'ETH/USDC', type: 'crypto' as MarketType, coinGecko: 'ethereum' },
  { pair: 'SOL/USDC', type: 'crypto' as MarketType, coinGecko: '' },
  { pair: 'LINK/USDC', type: 'crypto' as MarketType, coinGecko: 'chainlink' },
  { pair: 'AAPL/USD', type: 'synth' as MarketType, coinGecko: '' },
  { pair: 'AMZN/USD', type: 'synth' as MarketType, coinGecko: '' },
  { pair: 'TSLA/USD', type: 'synth' as MarketType, coinGecko: '' }
]

const CryptoContext = createContext<ICryptoConfig | null>(null)

export const CryptoProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [pairs, setPairs] = useState([])
  const [filteredSearchPairs, setFilteredSearchPairs] = useState([])
  const pairsToset = MARKET_PAIRS as any
  const devnetPairs = MARKET_PAIRS_DEVNET as any

  const getPairWithMarketAddress = () => {
    let pairSet = pairsToset[0]
    // const { blacklisted } = useConnectionConfig()
    let isDevnet = false
    try {
      const paths = window.location.href.split('/')
      const marketAddress = paths[4]
      pairsToset.map((item) => {
        if (marketAddress === item.marketAddress) {
          pairSet = item
          isDevnet = false
        }
      })
      devnetPairs.map((item) => {
        if (marketAddress === item.marketAddress) {
          pairSet = item
          isDevnet = true
        }
      })
      return { set: pairSet, isDevnet: isDevnet }
    } catch (e) {
      return { set: pairSet, isDevnet: isDevnet }
    }
  }
  const [isDevnet, setIsDevnet] = useState<boolean>(getPairWithMarketAddress().isDevnet)
  const [selectedCrypto, setSelectedCrypto] = useState<ICrypto>(getPairWithMarketAddress().set)
  const { connection } = useConnectionConfig()

  useEffect(() => {
    const pairsToset = isDevnet ? MARKET_PAIRS_DEVNET : MARKET_PAIRS
    setPairs(pairsToset)
  }, [])

  useEffect(() => {
    const pairsToset = isDevnet ? MARKET_PAIRS_DEVNET : MARKET_PAIRS
    setPairs(pairsToset)
  }, [isDevnet])

  useEffect(() => {
    if (pairs.length > 0) {
      setSelectedCrypto(pairs[0])
    }
    setFilteredSearchPairs(pairs)
  }, [pairs])

  useEffect(() => {
    ;(async () => {
      try {
        setSelectedCrypto((prevState) => ({ ...prevState, market: null }))
      } catch (e) {
        console.log(e)
      }
    })()
  }, [connection, selectedCrypto.pair])

  const formatPair = (symbol: string) => symbol.replace('/', ' / ')

  const getAskSymbolFromPair = (pair: string): string => pair.slice(0, pair.indexOf('/'))

  const getBidSymbolFromPair = (pair: string): string => pair.slice(pair.indexOf('/') + 1)

  const getSymbolFromPair = (pair: string, side: 'buy' | 'sell'): string =>
    side === 'buy' ? getBidSymbolFromPair(pair) : getAskSymbolFromPair(pair)

  return (
    <CryptoContext.Provider
      value={{
        pairs,
        formatPair,
        getAskSymbolFromPair,
        getBidSymbolFromPair,
        getSymbolFromPair,
        selectedCrypto,
        setSelectedCrypto,
        filteredSearchPairs,
        setFilteredSearchPairs,
        isDevnet,
        setIsDevnet
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

  return context
}
