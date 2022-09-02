import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'
import { FARM_TOKEN_LIST } from './crypto'
import { serum } from '../web3'
import { useConnectionConfig } from '../context'
import axios from 'axios'
import { getFarmTokenPrices } from '../api/SSL'

// const minMaxSuffix = '/ohlc?vs_currency=usd&days=7'

interface IPrices {
  [x: string]: {
    current: number
  }
}
interface IChange {
  [x: string]: {
    change?: string
    volume?: string
    range?: {
      min: string
      max: string
    }
  }
}
interface IPriceFeedConfig {
  prices: IPrices
  tokenInfo?: IChange
  refreshTokenData: Function
  priceFetched: boolean
}

const PriceFeedFarmContext = createContext<IPriceFeedConfig | null>(null)

export const PriceFeedFarmProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<IPrices>({})
  const [priceFetched, setPriceFetched] = useState<boolean>(false)

  const refreshTokenData = async () => {
    const PAIR_LIST = [...FARM_TOKEN_LIST]
    ;(async () => {
      const cryptoMarkets = PAIR_LIST.filter(({ type }) => type === 'crypto')
      const { data } = await getFarmTokenPrices(cryptoMarkets)
      setPrices(data)
      setPriceFetched(true)
    })()
  }

  return (
    <PriceFeedFarmContext.Provider
      value={{
        prices,
        refreshTokenData,
        priceFetched
      }}
    >
      {children}
    </PriceFeedFarmContext.Provider>
  )
}

export const usePriceFeedFarm = (): IPriceFeedConfig => {
  const context = useContext(PriceFeedFarmContext)
  if (!context) {
    throw new Error('Missing crypto context')
  }

  return {
    prices: context.prices,
    refreshTokenData: context.refreshTokenData,
    priceFetched: context.priceFetched
  }
}
