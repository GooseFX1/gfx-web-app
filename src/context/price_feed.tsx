import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'
import { Orderbook } from '@project-serum/serum'
import { useCrypto } from './crypto'
import { serum } from '../web3'
import { useConnectionConfig } from '../context'
import axios from 'axios'
import { useHistory, useLocation } from 'react-router-dom'
import { NFT_LAUNCHPAD_API_ENDPOINTS } from '../api/NFTLaunchpad'

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
  refreshTokenData: (d: string) => void
  priceFetched: boolean
}

const PriceFeedContext = createContext<IPriceFeedConfig | null>(null)

export const PriceFeedProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<IPrices>({})
  const [tokenInfo, setTokenInfo] = useState<IChange>({})
  const { connection } = useConnectionConfig()
  const [priceFetched, setPriceFetched] = useState<boolean>(false)
  const { pairs, selectedCrypto } = useCrypto()
  const history = useHistory()
  const location = useLocation()

  const refreshTokenData = async (coinGeckoId) => {
    if (!coinGeckoId) {
      const cryptoMarkets = pairs.filter(({ type }) => type === 'crypto')
      const response =
        cryptoMarkets.length &&
        (await axios.post(
          NFT_LAUNCHPAD_API_ENDPOINTS.NFT_LAUNCHPAD_API_BASE + NFT_LAUNCHPAD_API_ENDPOINTS.GET_TOKEN_INFO,
          JSON.stringify({ tokens: cryptoMarkets }),
          {
            headers: {
              'Content-Type': 'application/json'
            }
          }
        ))
      if (response) {
        for (const { pair, change, volume, min, max } of response.data.data) {
          setTokenInfo((prevState) => ({
            ...prevState,
            [pair]: {
              change: change,
              volume: volume,
              range: { min: min, max: max }
            }
          }))
        }
      }
    }
  }

  useEffect(() => {
    let cancelled = false
    const subscriptions: number[] = []

    if (!cancelled) {
      ;(async () => {
        if (JSON.stringify(tokenInfo) === '{}') refreshTokenData(null)
        const { pair, market } = selectedCrypto
        if (location.pathname.includes('trade') && !location.pathname.includes(selectedCrypto.marketAddress)) {
          history.push('/trade/' + selectedCrypto.marketAddress)
        }
        if (market) {
          try {
            //set SOL/USDC price always
            const solPair = 'SOL/USDC'
            const solUsdc = await serum.getLatestBid(connection, solPair)
            setPrices((prevState) => ({ ...prevState, [solPair]: { current: solUsdc } }))

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
          }
          setPriceFetched(true)
        }
      })()
    }

    return () => {
      cancelled = true
      subscriptions.forEach((sub) => connection.removeAccountChangeListener(sub))
    }
  }, [connection, selectedCrypto])

  return (
    <PriceFeedContext.Provider
      value={{
        prices,
        tokenInfo,
        refreshTokenData,
        priceFetched
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
    tokenInfo: context.tokenInfo,
    refreshTokenData: context.refreshTokenData,
    priceFetched: context.priceFetched
  }
}
