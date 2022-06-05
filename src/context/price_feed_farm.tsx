import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'
import { parsePriceData } from '@pythnetwork/client'
import { Orderbook } from '@project-serum/serum'
import { FARM_TOKEN_LIST, FEATURED_PAIRS_LIST } from './crypto'
import { notify } from '../utils'
import { pyth, serum } from '../web3'
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

    if (!cancelled) {
      ;(async () => {
        const PAIR_LIST = [...FARM_TOKEN_LIST]
        const cryptoMarkets = PAIR_LIST.filter(({ type }) => type === 'crypto')
        for (const { pair, coinGecko } of cryptoMarkets) {
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
            try {
              const currentPrice = await refreshTokenData({ pair, coinGecko })
              setPrices((prevState) => ({ ...prevState, [pair]: { current: currentPrice } }))
            } catch (e: any) {
              console.log('Error fetching CoinGeko market', pair)
            }
            console.error('Error fetching serum markets', pair)
            // await notify({ type: 'error', message: 'Error fetching serum markets', icon: 'rate_error' }, e)
          }
        }
        setPriceFetched(true)
      })()
    }

    return () => {
      cancelled = true
      subscriptions.forEach((sub) => connection.removeAccountChangeListener(sub))
    }
  }, [connection])
  useEffect(() => {
    console.log(prices)
  }, [priceFetched])

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
