import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'
import { parsePriceData } from '@pythnetwork/client'
import { Orderbook } from '@project-serum/serum'
import { FEATURED_PAIRS_LIST } from './crypto'
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
  tokenInfo: IChange
}

const PriceFeedContext = createContext<IPriceFeedConfig | null>(null)

export const PriceFeedProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<IPrices>({})
  const [tokenInfo, setTokenInfo] = useState<IChange>({})
  const { connection } = useConnectionConfig()

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
      volume
    }
  }

  const getRange = async (coinGeckoId) => {
    let range = null,
      response = null
    try {
      response = await axios.get(coinGeckoUrl + coinGeckoId + minMaxSuffix)
      if (response.status !== 200) throw Error
    } catch (e) {
      return {
        range
      }
    }
    try {
      let min = response.data[response.data.length - 1][3],
        max = response.data[response.data.length - 1][2]
      for (let i = response.data.length - 1; i > response.data.length - 7; i--) {
        if (response.data[i][3] < min) min = response.data[i][3]
        if (response.data[i][2] > max) max = response.data[i][2]
      }
      if (min.toFixed(2) === max.toFixed(2)) {
        min = min.toFixed(3)
        max = max.toFixed(3)
      } else {
        min = min.toFixed(2)
        max = max.toFixed(2)
      }
      return {
        min,
        max
      }
    } catch (e) {
      return range
    }
  }

  useEffect(() => {
    let cancelled = false
    const subscriptions: number[] = []

    if (!cancelled) {
      ;(async () => {
        const cryptoMarkets = FEATURED_PAIRS_LIST.filter(({ type }) => type === 'crypto')
        for (const { pair, coinGecko } of cryptoMarkets) {
          try {
            let tokenInfo = await getTokenInfo(coinGecko)
            let range = await getRange(coinGecko)
            setTokenInfo((prevState) => ({ ...prevState, [pair]: { ...tokenInfo, range } }))
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
            console.error('Error fetching serum markets')
            // await notify({ type: 'error', message: 'Error fetching serum markets', icon: 'rate_error' }, e)
          }
        }

        try {
          const synths = FEATURED_PAIRS_LIST.filter(({ type }) => type === 'synth').map(({ pair }) => pair)
          const products = await pyth.fetchProducts(connection, synths)
          try {
            const accounts = await pyth.fetchPriceAccounts(connection, products)
            for (const { price, priceAccountKey, symbol } of accounts) {
              if (price) {
                setPrices((prevState) => ({ ...prevState, [symbol]: { current: parseFloat(price.toFixed(2)) } }))
              }
              subscriptions.push(
                connection.onAccountChange(priceAccountKey, ({ data }) => {
                  const { price } = parsePriceData(data)
                  if (price) {
                    setPrices((prevState) => ({ ...prevState, [symbol]: { current: parseFloat(price.toFixed(2)) } }))
                  }
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
    }

    return () => {
      cancelled = true
      subscriptions.forEach((sub) => connection.removeAccountChangeListener(sub))
    }
  }, [connection])

  return (
    <PriceFeedContext.Provider
      value={{
        prices,
        tokenInfo
      }}
    >
      {children}
    </PriceFeedContext.Provider>
  )
}

export const usePriceFeed = (): IPriceFeedConfig => {
  const context = useContext(PriceFeedContext)
  if (!context) {
    throw new Error('Missing crypto context')
  }

  return {
    prices: context.prices,
    tokenInfo: context.tokenInfo
  }
}
