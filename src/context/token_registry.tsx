import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'
import { ENV, TokenInfo, TokenListProvider } from '@solana/spl-token-registry'
import { useConnectionConfig } from './settings'
import { SUPPORTED_TOKEN_LIST, FARM_SUPPORTED_TOKEN_LIST, TOKEN_BLACKLIST } from '../constants'
import { ADDRESSES } from '../web3'

interface ITokenRegistryConfig {
  getTokenInfoFromSymbol: (x: string) => TokenInfo | undefined
  getTokenInfoForFarming: (x: string) => TokenInfo | undefined
  tokens: TokenInfo[]
}

const TokenRegistryContext = createContext<ITokenRegistryConfig | null>(null)

export const TokenRegistryProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { chainId } = useConnectionConfig()
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [farmingToken, setFarmingTokens] = useState<TokenInfo[]>([])

  const getTokenInfoFromSymbol = (symbol: string) => tokens.find(({ symbol: x }) => x === symbol)
  const getTokenInfoForFarming = (symbol: string) => farmingToken.find(({ symbol: x }) => x === symbol)

  useEffect(() => {
    ;(async () => {
      const list = (await new TokenListProvider().resolve()).filterByChainId(chainId).getList()
      const splList = list
        .filter(({ symbol }) => SUPPORTED_TOKEN_LIST.includes(symbol))
        .filter(({ address }) => !TOKEN_BLACKLIST.includes(address))
      let farmSupportedList = list.filter(({ symbol }) => FARM_SUPPORTED_TOKEN_LIST.includes(symbol))
      //TODO: Add filteredList from solana-spl-registry back
      //setFarmingTokens()
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
        console.log(farmSupportedList)
        setFarmingTokens(farmSupportedList)
      } else setFarmingTokens(farmSupportedList)
      const filteredList = [...splList]

      if (chainId === ENV.Devnet) {
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
