import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'
import { FARM_TOKEN_LIST } from './crypto'
import { serum } from '../web3'
import { notify } from '../utils'
import { useConnectionConfig } from '../context'
import axios from 'axios'

const coinGeckoUrl = 'https://api.coingecko.com/api/v3/coins/'
const coinGeckoSuffix = '/market_chart?vs_currency=usd&days=1&interval=daily'
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
  const { connection } = useConnectionConfig()
  const [priceFetched, setPriceFetched] = useState<boolean>(false)

  const getTokenInfo = async (coinGeckoId: string): Promise<number> => {
    const coinGeckoURL = coinGeckoUrl + coinGeckoId + coinGeckoSuffix

    try {
      const res = await axios.get(coinGeckoURL)
      const current: number = res.data.prices[1][1]
      return current ? current : 0
    } catch (e) {
      return 0
    }
  }

  const refeshFeed = async (coinGeckoId: string): Promise<number> => {
    const currentPrice = await getTokenInfo(coinGeckoId)
    return parseFloat(currentPrice.toFixed(3))
  }

  useEffect(() => {
    let cancelled = false

    if (!cancelled && !priceFetched) {
      refreshTokenData()
    }

    return () => {
      cancelled = true
    }
  }, [connection])

  const refreshTokenData = async () => {
    const PAIR_LIST = [...FARM_TOKEN_LIST]
    const cryptoMarkets = PAIR_LIST.filter(({ type }) => type === 'crypto')

    const promiseArr = []
    for (const { pair, coinGecko } of cryptoMarkets) {
      if (pair !== 'MSOL/USDC' && pair !== 'USDC/USD') {
        promiseArr.push(refeshFeed(coinGecko))
      } else if (pair === 'USDC/USD') {
        setPrices((prevState) => ({ ...prevState, [pair]: { current: 1 } }))
      } else {
        promiseArr.push(serum.getLatestBid(connection, pair))
      }
    }

    try {
      await Promise.all(promiseArr)
        .then((res) => {
          for (let i = 0; i < cryptoMarkets.length; i++) {
            setPrices((prevState) => ({ ...prevState, [cryptoMarkets[i].pair]: { current: res[i] } }))
          }
          setPriceFetched(true)
        })
        .catch((err) => {
          notify({ type: 'error', message: `Error fetching pair, Please Reload`, icon: 'rate_error' }, err)
        })
    } catch (err) {
      console.log('PROMISE FAILED', err)
      notify({ type: 'error', message: `Error fetching pair, Please Reload`, icon: 'rate_error' }, err)
    }
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
