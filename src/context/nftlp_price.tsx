import React, { FC, ReactNode, createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

interface ISOLToggle {
  isUSDC: boolean
  setIsUSDC: any
  solPrice: number
}

const SolPriceContext = createContext<ISOLToggle | null>(null)

export const SolPriceProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isUSDC, setIsUSDCToggle] = useState<boolean>(false)
  const [solPrice, setSolPrice] = useState<number>(0)

  useEffect(() => {
    ;(async () => {
      const coinGeckoUrl = 'https://api.coingecko.com/api/v3/coins/'
      const coinGeckoSuffix = '/market_chart?vs_currency=usd&days=1&interval=daily'

      const getTokenInfo = async (coinGeckoId) => {
        let url = coinGeckoUrl + coinGeckoId + coinGeckoSuffix,
          response = null,
          current = null
        try {
          response = await axios.get(url)
        } catch (e) {
          console.error(e)
        }
        try {
          current = response.data.prices[1][1]
        } catch (err) {
          console.log(err)
        }
        return {
          current
        }
      }
      const data = await getTokenInfo('solana')
      setSolPrice(data.current)
    })()
  }, [])
  const setIsUSDC = (value) => {
    setIsUSDCToggle(value)
  }

  return (
    <SolPriceContext.Provider
      value={{
        isUSDC,
        setIsUSDC,
        solPrice
      }}
    >
      {children}
    </SolPriceContext.Provider>
  )
}

export const useSolToggle = (): ISOLToggle => {
  const context = useContext(SolPriceContext)
  if (!context) {
    throw new Error('Missing NFTLP context')
  }

  const { isUSDC, setIsUSDC, solPrice } = context
  return { isUSDC, setIsUSDC, solPrice }
}
