import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'
import { ENV, TokenInfo, TokenListProvider } from '@solana/spl-token-registry'
import { useConnectionConfig } from './settings'
import { SUPPORTED_TOKEN_LIST } from '../constants'
import { SOLANA_REGISTRY_TOKEN_MINT, TOKEN_A, TOKEN_B } from '../web3'

interface ITokenRegistryConfig {
  getTokenInfoFromSymbol: (x: string) => TokenInfo | undefined
  tokens: TokenInfo[]
}

const TokenRegistryContext = createContext<ITokenRegistryConfig | null>(null)

export const TokenRegistryProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { chainId } = useConnectionConfig()
  const [tokens, setTokens] = useState<TokenInfo[]>([])

  const getTokenInfoFromSymbol = (symbol: string) => tokens.find(({ symbol: x }) => x === symbol)

  useEffect(() => {
    (async () => {
      const list = (await new TokenListProvider().resolve()).filterByChainId(chainId).getList()
      const filteredList = list.filter(({ symbol }) => SUPPORTED_TOKEN_LIST.includes(symbol))
      filteredList.push({ address: SOLANA_REGISTRY_TOKEN_MINT, chainId, decimals: 9, name: 'Solana', symbol: 'SOL' })

      if (chainId === ENV.Devnet) {
        filteredList.push({ address: TOKEN_A, chainId, decimals: 9, name: 'Token A', symbol: 'TKNA' })
        filteredList.push({ address: TOKEN_B, chainId, decimals: 9, name: 'Token B', symbol: 'TKNB' })
      }

      const formattedList = filteredList
        .map(({ address, chainId, decimals, name, symbol }) => ({
          address,
          chainId,
          decimals,
          name: name.replace(' (Sollet)', ''),
          symbol
        }))
        .sort(({ symbol: a }, { symbol: b }) => a.localeCompare(b))
      setTokens(formattedList)
    })()
  }, [chainId])

  return (
    <TokenRegistryContext.Provider
      value={{
        getTokenInfoFromSymbol,
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

  const { getTokenInfoFromSymbol, tokens } = context
  return { getTokenInfoFromSymbol, tokens }
}
