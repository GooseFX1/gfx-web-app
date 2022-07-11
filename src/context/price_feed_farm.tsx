import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'
import { FARM_TOKEN_LIST, FEATURED_PAIRS_LIST } from './crypto'
import { serum } from '../web3'
import { notify } from '../utils'
import { useConnectionConfig } from '../context'
import axios from 'axios'

const coinGeckoUrl = 'https://api.coingecko.com/api/v3/coins/'
const coinGeckoSuffix = '/market_chart?vs_currency=usd&days=1&interval=daily'
const minMaxSuffix = '/ohlc?vs_currency=usd&days=7'

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

  const getTokenInfo = async (coinGeckoId) => {
    let url = coinGeckoUrl + coinGeckoId + coinGeckoSuffix,
      response = null,
      change = null,
      volume = null,
      initial = null,
      current = null
    try {
      response = await axios.get(url)
      if (response.status !== 200) throw Error
    } catch (e) {
      return {
        change,
        volume
      }
    }
    try {
      initial = response.data.prices[0][1]
      current = response.data.prices[1][1]
      change = (((current - initial) / initial) * 100).toFixed(1)
      if (change && change.slice(0, 1) !== '-') change = '+' + change
    } catch (e) {
      change = null
    }
    try {
      volume = response.data.total_volumes[1][1].toFixed(2)
    } catch (e) {
      volume = null
    }
    return {
      change,
      volume,
      current
    }
  }

  const refreshTokenData = async (coinGeckoId) => {
    let tokenInfo = await getTokenInfo(coinGeckoId.coinGecko)
    return parseFloat(tokenInfo.current.toFixed(3))
  }

  useEffect(() => {
    let cancelled = false
    const subscriptions: number[] = []

    if (!cancelled && !priceFetched) {
      ;(async () => {
        const PAIR_LIST = [...FARM_TOKEN_LIST]
        const cryptoMarkets = PAIR_LIST.filter(({ type }) => type === 'crypto')
        const promiseArr = []
        for (const { pair, coinGecko } of cryptoMarkets) {
          try {
            if (pair !== 'MSOL/USDC' && pair !== 'USDC/USD') {
              promiseArr.push(refreshTokenData({ pair, coinGecko }))
            } else if (pair === 'USDC/USD') {
              setPrices((prevState) => ({ ...prevState, [pair]: { current: 1 } }))
            } else {
              promiseArr.push(serum.getLatestBid(connection, pair))
            }
          } catch (e: any) {
            console.error(e, 'Error fetching serum markets', pair)
            await notify({ type: 'error', message: `Error fetching pair ${pair}`, icon: 'rate_error' }, e)
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
          console.log(err)
        }
      })()
    }

    return () => {
      cancelled = true
      subscriptions.forEach((sub) => connection.removeAccountChangeListener(sub))
    }
  }, [connection])

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
