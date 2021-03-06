import React, { createContext, Dispatch, FC, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react'
import { Market } from '@project-serum/serum'
import { useConnectionConfig } from './settings'
import { serum } from '../web3'

interface ICrypto {
  decimals: number
  market?: Market
  pair: string
  type: MarketType
}

interface CryptoChange {
  pair: string
  change?: string
  coinGeckoId: string
}

export type MarketSide = 'asks' | 'bids'

interface ICryptoConfig {
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
  { decimals: 3, pair: 'GOFX/USDC', type: 'crypto' as MarketType, coinGecko: 'goosefx' },
  { decimals: 1, pair: 'BTC/USDC', type: 'crypto' as MarketType, coinGecko: 'bitcoin' },
  { decimals: 2, pair: 'ETH/USDC', type: 'crypto' as MarketType, coinGecko: 'ethereum' },
  { decimals: 3, pair: 'SOL/USDC', type: 'crypto' as MarketType, coinGecko: 'solana' },
  { decimals: 3, pair: 'LINK/USDC', type: 'crypto' as MarketType, coinGecko: 'chainlink' },
  { decimals: 2, pair: 'AAPL/USD', type: 'synth' as MarketType, coinGecko: '' },
  { decimals: 2, pair: 'AMZN/USD', type: 'synth' as MarketType, coinGecko: '' },
  { decimals: 2, pair: 'TSLA/USD', type: 'synth' as MarketType, coinGecko: '' }
]
export const FARM_TOKEN_LIST = [
  // this is added to fetch current price from coin geko
  { decimals: 3, pair: 'GOFX/USDC', type: 'crypto' as MarketType, coinGecko: 'goosefx' },
  { decimals: 2, pair: 'ETH/USDC', type: 'crypto' as MarketType, coinGecko: 'ethereum' },
  { decimals: 3, pair: 'SOL/USDC', type: 'crypto' as MarketType, coinGecko: 'solana' },
  { decimals: 3, pair: 'MSOL/USDC', type: 'crypto' as MarketType, coinGecko: 'Marinade staked SOL' },
  { decimals: 3, pair: 'SRM/USDC', type: 'crypto' as MarketType, coinGecko: 'serum' },
  { decimals: 3, pair: 'GMT/USDC', type: 'crypto' as MarketType, coinGecko: 'stepn' }
]

const CryptoContext = createContext<ICryptoConfig | null>(null)

export const CryptoProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCrypto, setSelectedCrypto] = useState<ICrypto>(FEATURED_PAIRS_LIST[3])
  const { connection } = useConnectionConfig()
  const [change24h, setChange24h] = useState<[CryptoChange]>(null)

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
    formatPair: context.formatPair,
    getAskSymbolFromPair: context.getAskSymbolFromPair,
    getBidSymbolFromPair: context.getBidSymbolFromPair,
    getSymbolFromPair: context.getSymbolFromPair,
    selectedCrypto: context.selectedCrypto,
    setSelectedCrypto: context.setSelectedCrypto,
    change24h: context.change24h
  }
}
