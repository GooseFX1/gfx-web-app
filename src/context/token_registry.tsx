import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'
import { ENV, TokenInfo } from '@solana/spl-token-registry'
import { useConnectionConfig } from './settings'
import { SUPPORTED_TOKEN_LIST, FARM_SUPPORTED_TOKEN_LIST } from '../constants'
import { ADDRESSES } from '../web3'
import { TOKEN_LIST_URL } from '@jup-ag/core'

interface ITokenRegistryConfig {
  getTokenInfoFromSymbol: (x: string) => TokenInfo | undefined
  getTokenInfoForFarming: (x: string) => TokenInfo | undefined
  tokens: TokenInfo[]
}

const TokenRegistryContext = createContext<ITokenRegistryConfig | null>(null)

export const TokenRegistryProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { chainId, network } = useConnectionConfig()
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [farmingToken, setFarmingTokens] = useState<TokenInfo[]>([])

  const getTokenInfoFromSymbol = (symbol: string) => tokens.find(({ symbol: x }) => x === symbol)
  const getTokenInfoForFarming = (symbol: string) => farmingToken.find(({ symbol: x }) => x === symbol)

  useEffect(() => {
    ;(async () => {
      const myList = []
      const obj = ADDRESSES[network].sslPool
      myList.push({
        address: 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD',
        chainId,
        decimals: 9,
        name: 'GooseFX',
        symbol: 'GOFX'
      })
      for (const key in obj) {
        myList.push({
          chainId: chainId,
          address: obj[key].address.toBase58(),
          symbol: key,
          name: obj[key].name,
          decimals: obj[key].decimals
        })
      }
      const newList = await (await fetch(TOKEN_LIST_URL[network])).json()
      const manualList = newList.filter(({ symbol }) => SUPPORTED_TOKEN_LIST.includes(symbol))
      const jupiterList = newList.filter(({ symbol }) => !SUPPORTED_TOKEN_LIST.includes(symbol))
      const splList = [
        ...manualList,
        ...jupiterList,
        {
          address: '6LNeTYMqtNm1pBFN8PfhQaoLyegAH8GD32WmHU9erXKN',
          decimals: 8,
          name: 'Aptos Coin (Wormhole)',
          symbol: 'APT',
          chainId: 101
        }
      ]

      let farmSupportedList = myList.filter(({ symbol }) => FARM_SUPPORTED_TOKEN_LIST.includes(symbol))
      //TODO: Add filteredList from solana-spl-registry back
      if (chainId === ENV.Devnet) {
        farmSupportedList = []
        farmSupportedList.push({
          address: '2uig6CL6aQNS8wPL9YmfRNUNcQMgq9purmXK53pzMaQ6',
          chainId,
          decimals: 9,
          name: 'GooseFX',
          symbol: 'GOFX'
        })

        farmSupportedList.push({
          address: ADDRESSES.devnet.sslPool.USDC.address.toString(),
          chainId,
          decimals: 9,
          name: 'USD Coin',
          symbol: 'USDC'
        })

        farmSupportedList.push({
          address: ADDRESSES.devnet.sslPool.SOL.address.toString(),
          chainId,
          decimals: 9,
          name: 'SOLANA',
          symbol: 'SOL'
        })

        farmSupportedList.push({
          address: ADDRESSES.devnet.sslPool.ETH.address.toString(),
          chainId,
          decimals: 9,
          name: 'ETH',
          symbol: 'ETH'
        })
        setFarmingTokens(farmSupportedList)
      } else setFarmingTokens(farmSupportedList)

      let filteredList = [...splList].map((i) => {
        if (i.symbol === 'SOL') {
          return { ...i, name: 'SOLANA' }
        } else if (i.address === 'APTtJyaRX5yGTsJU522N4VYWg3vCvSb65eam5GrPT5Rt') {
          return { ...i, symbol: 'APRT' }
        } else {
          return i
        }
      })

      if (chainId === ENV.Devnet) {
        filteredList = []
        filteredList.push({
          address: ADDRESSES.devnet.mints.GOFX.address.toString(),
          chainId,
          decimals: 9,
          name: 'GooseFX',
          symbol: 'GOFX'
        })

        filteredList.push({
          address: ADDRESSES.devnet.mints.gUSD.address.toString(),
          chainId,
          decimals: 9,
          name: 'GFX USD Coin',
          symbol: 'gUSDC'
        })

        filteredList.push({
          address: ADDRESSES.devnet.mints.gSOL.address.toString(),
          chainId,
          decimals: 9,
          name: 'GFX SOLANA',
          symbol: 'gSOL'
        })

        filteredList.push({
          address: ADDRESSES.devnet.mints.gETH.address.toString(),
          chainId,
          decimals: 9,
          name: 'GFX ETH',
          symbol: 'gETH'
        })

        filteredList.push({
          address: ADDRESSES.devnet.mints.gAVAX.address.toString(),
          chainId,
          decimals: 9,
          name: 'GFX AVAX',
          symbol: 'gAVAX'
        })
      }

      filteredList.sort(({ symbol: a }, { symbol: b }) => a.localeCompare(b))
      setTokens(filteredList)
    })()
  }, [chainId])

  return (
    <TokenRegistryContext.Provider
      value={{
        getTokenInfoFromSymbol,
        getTokenInfoForFarming,
        tokens
      }}
    >
      {children}
    </TokenRegistryContext.Provider>
  )
}

export const useTokenRegistry = (): ITokenRegistryConfig => {
  const context = useContext(TokenRegistryContext)
  if (!context) {
    throw new Error('Missing token registry context')
  }

  const { getTokenInfoFromSymbol, getTokenInfoForFarming, tokens } = context
  return { getTokenInfoFromSymbol, getTokenInfoForFarming, tokens }
}
