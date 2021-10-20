import React, { FC, ReactNode, createContext, useContext, useEffect, useState, Dispatch, SetStateAction } from 'react'
import { Orderbook } from '@project-serum/serum'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { FEATURED_PAIRS_LIST } from './crypto'
import { useConnectionConfig } from './settings'
import { notify } from '../utils'
import { pyth, serum } from '../web3'

interface IPrices {
  [x: string]: {
    change24H?: number
    current: number
  }
}

interface IPricesConfig {
  prices: IPrices
  setPrices: Dispatch<SetStateAction<IPrices>>
}

const PricesContext = createContext<IPricesConfig | null>(null)

export const PricesProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { connection, network } = useConnectionConfig()
  const [prices, setPrices] = useState<IPrices>({})

  useEffect(() => {
    let cancelled = false
    const subscriptions: number[] = []

    const cryptoMarkets = FEATURED_PAIRS_LIST.filter(({ type }) => type === 'crypto')
    network === WalletAdapterNetwork.Mainnet &&
      cryptoMarkets.forEach(async ({ pair }) => {
        if (!cancelled) {
          try {
            const [market, current] = await Promise.all([
              serum.getMarket(connection, pair),
              serum.getLatestBid(connection, pair)
            ])
            setPrices((prevState: IPrices) => ({ ...prevState, [pair]: { current } }))

            subscriptions.push(
              await serum.subscribeToOrderBook(connection, market, 'asks', (account, market) => {
                const [[current]] = Orderbook.decode(market, account.data).getL2(1)
                setPrices((prevState: IPrices) => ({ ...prevState, [pair]: { current } }))
              })
            )
          } catch (e: any) {
            await notify({ type: 'error', message: 'Error fetching serum markets', icon: 'rate_error' }, e)
          }
        }
      })

    ;(async () => {
      try {
        const synths = FEATURED_PAIRS_LIST.filter(({ type }) => type === 'synth').map(({ pair }) => pair)
        const products = await pyth.fetchProducts(connection, network, synths)
        try {
          const accounts = await pyth.fetchPriceAccounts(connection, products)
          accounts.forEach(({ mint, price, symbol }) => {
            setPrices((prevState) => ({ ...prevState, [symbol]: { current: price } }))
            subscriptions.push(
              connection.onAccountChange(mint, (priceAccount) =>
                setPrices((prevState: IPrices) => ({
                  ...prevState,
                  ...{ [symbol]: { current: Number(pyth.getPriceFromPriceAccount(priceAccount).toFixed(2)) } }
                }))
              )
            )
          })
        } catch (e: any) {
          await notify({ type: 'error', message: 'Error fetching pyth price accounts', icon: 'rate_error' }, e)
        }
      } catch (e: any) {
        await notify({ type: 'error', message: 'Error fetching pyth products', icon: 'rate_error' }, e)
      }
    })()

    return () => {
      cancelled = true
      setPrices({})
      subscriptions.forEach((subscription) => connection.removeAccountChangeListener(subscription))
    }
  }, [connection, network])

  return (
    <PricesContext.Provider
      value={{
        prices,
        setPrices
      }}
    >
      {children}
    </PricesContext.Provider>
  )
}

export const usePrices = (): IPricesConfig => {
  const context = useContext(PricesContext)
  if (!context) {
    throw new Error('Missing prices context')
  }

  const { prices, setPrices } = context
  return { prices, setPrices }
}
