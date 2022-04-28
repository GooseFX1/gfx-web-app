import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'
import { parsePriceData } from '@pythnetwork/client'
import { Orderbook } from '@project-serum/serum'
import { FEATURED_PAIRS_LIST } from './crypto'
import { notify } from '../utils'
import { pyth, serum } from '../web3'
import { useConnectionConfig } from '../context'

interface IPrices {
  [x: string]: {
    change24H?: number
    current: number
  }
}

interface IPriceFeedConfig {
  prices: IPrices
}

const PriceFeedContext = createContext<IPriceFeedConfig | null>(null)

export const PriceFeedProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<IPrices>({})
  const { connection } = useConnectionConfig()

  useEffect(() => {
    let cancelled = false
    const subscriptions: number[] = []

    if (!cancelled) {
      ;(async () => {
        const cryptoMarkets = FEATURED_PAIRS_LIST.filter(({ type }) => type === 'crypto')
        for (const { pair } of cryptoMarkets) {
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
        prices
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
    prices: context.prices
  }
}
