import React, { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'
import { Market } from '@project-serum/serum'
import { useConnectionConfig } from './settings'
import { serum } from '../web3'
const MARKET_PAIRS = require('../pages/TradeV2/constants/MARKET_PAIRS.json')

interface ICrypto {
  market?: Market
  pair: string
  type?: MarketType
  coinGecko?: any
  marketAddress: string
}

interface CryptoChange {
  pair: string
  change?: string
  coinGeckoId: string
}

export type MarketSide = 'asks' | 'bids'

interface ICryptoConfig {
  pairs: any
  formatPair: (x: string) => string
  getAskSymbolFromPair: (x: string) => string
  getBidSymbolFromPair: (x: string) => string
  getSymbolFromPair: (x: string, y: 'buy' | 'sell') => string
  selectedCrypto: ICrypto
  setSelectedCrypto: Dispatch<SetStateAction<ICrypto>>
  change24h: [CryptoChange]
}

export type MarketType = 'crypto' | 'synth'

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
export const FARM_TOKEN_LIST = [
  // this is added to fetch current price from coin geko
  { decimals: 3, pair: 'GOFX/USDC', type: 'crypto' as MarketType, coinGecko: 'goosefx' },
  { decimals: 2, pair: 'ETH/USDC', type: 'crypto' as MarketType, coinGecko: 'ethereum' },
  { decimals: 3, pair: 'SOL/USDC', type: 'crypto' as MarketType, coinGecko: 'solana' },
  { decimals: 3, pair: 'MSOL/USDC', type: 'crypto' as MarketType, coinGecko: 'solana' },
  { decimals: 3, pair: 'SRM/USDC', type: 'crypto' as MarketType, coinGecko: 'serum' },
  { decimals: 3, pair: 'GMT/USDC', type: 'crypto' as MarketType, coinGecko: 'stepn' },
  { decimals: 3, pair: 'USDT/USD', type: 'crypto' as MarketType, coinGecko: 'tether' },
  { decimals: 3, pair: 'USDC/USDT', type: 'crypto' as MarketType, coinGecko: 'usd-coin' },
  { decimals: 3, pair: 'ORCA/USDC', type: 'crypto' as MarketType, coinGecko: 'orca' }
]

const CryptoContext = createContext<ICryptoConfig | null>(null)

export const CryptoProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [pairs, setPairs] = useState([])
  const pairsToset = MARKET_PAIRS

  const getPairWithMarketAddress = () => {
    let pairSet = pairsToset[0]
    try {
      let paths = window.location.href.split('/')
      let marketAddress = paths[4]
      pairsToset.map((item) => {
        if (marketAddress === item.marketAddress) {
          pairSet = item
        }
      })
      return pairSet
    } catch (e) {
      return pairSet
    }
  }
  const [selectedCrypto, setSelectedCrypto] = useState<ICrypto>(getPairWithMarketAddress)
  const { connection } = useConnectionConfig()
  const [change24h, setChange24h] = useState<[CryptoChange]>(null)

  useEffect(() => {
    ;(async () => {
      const pairsToset = MARKET_PAIRS
      setPairs(pairsToset)
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        const market = await serum.getMarket(connection, selectedCrypto.pair)
        setSelectedCrypto((prevState) => ({ ...prevState, market }))
      } catch (e) {}
    })()
  }, [connection, selectedCrypto.pair])

  useEffect(() => {
    setChange24h([
      {
        pair: 'as',
        coinGeckoId: 'as'
      }
    ])
  }, [])

  const formatPair = (symbol: string) => symbol.replace('/', ' / ')

  const getAskSymbolFromPair = (pair: string): string => pair.slice(0, pair.indexOf('/'))

  const getBidSymbolFromPair = (pair: string): string => pair.slice(pair.indexOf('/') + 1)

  const getSymbolFromPair = (pair: string, side: 'buy' | 'sell'): string => {
    return side === 'buy' ? getBidSymbolFromPair(pair) : getAskSymbolFromPair(pair)
  }

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
        change24h
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
    pairs: context.pairs,
    formatPair: context.formatPair,
    getAskSymbolFromPair: context.getAskSymbolFromPair,
    getBidSymbolFromPair: context.getBidSymbolFromPair,
    getSymbolFromPair: context.getSymbolFromPair,
    selectedCrypto: context.selectedCrypto,
    setSelectedCrypto: context.setSelectedCrypto,
    change24h: context.change24h
  }
}
