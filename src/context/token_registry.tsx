import React, { createContext, FC, ReactNode, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { ENV, TokenInfo } from '@solana/spl-token-registry'
import { useConnectionConfig } from './settings'
import { FARM_SUPPORTED_TOKEN_LIST } from '../constants'
import { ADDRESSES } from '../web3'
//import { TOKEN_LIST_URL } from '@jup-ag/core'

interface ITokenRegistryConfig {
  getTokenInfoFromSymbol: (x: string) => TokenInfo | undefined
  getTokenInfoForFarming: (x: string) => TokenInfo | undefined
  tokens: ITokenInfo[]
  tokenMap: Map<string, ITokenInfo>
  farmTokenMap: Map<string, ITokenInfo>
}
interface ITokenInfo extends TokenInfo {
  imageURL?: string
  tokenBalance?: number
}
const TokenRegistryContext = createContext<ITokenRegistryConfig | null>(null)

export const TokenRegistryProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { chainId, network } = useConnectionConfig()
  const [tokens, setTokens] = useState<ITokenInfo[]>([])
  const [farmingToken, setFarmingTokens] = useState<ITokenInfo[]>([])
  const generateTokenList = useCallback((tokens: ITokenInfo[]): [string, ITokenInfo][] => {
    const data: [string, ITokenInfo][] = []
    // objects are reference types - all keys point to same object
    for (const token of tokens) {
      data.push([token.symbol, token])
      data.push([token.address, token])
    }
    return data
  }, [])
  // as getTokenInfo iterates through the list, for constant lookup time, we can use a map
  const tokenMap = useMemo(() => new Map(generateTokenList(tokens)), [tokens])

  const farmTokenMap = useMemo(() => new Map(generateTokenList(farmingToken)), [farmingToken])
  const getTokenInfoFromSymbol = useCallback((symbol: string) => tokenMap.get(symbol), [tokenMap])
  const getTokenInfoForFarming = useCallback((symbol: string) => farmTokenMap.get(symbol), [farmTokenMap])

  useEffect(() => {
    ;(async () => {
      let farmSupportedList = []
      const obj = ADDRESSES[network].sslPool
      farmSupportedList.push({
        address: 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD',
        chainId,
        decimals: 9,
        name: 'GooseFX',
        symbol: 'GOFX',
        imageURL: `/img/crypto/GOFX.svg`
      })
      for (const key in obj) {
        if (FARM_SUPPORTED_TOKEN_LIST.has(key)) {
          farmSupportedList.push({
            chainId: chainId,
            address: obj[key].address.toBase58(),
            symbol: key,
            name: obj[key].name,
            decimals: obj[key].decimals,
            imageURL: `/img/crypto/${key}.svg`
          })
        }
      }
      try {
        const splList = (await (await fetch('TOKEN_LIST_URL[network]')).json()).map((token: ITokenInfo) => {
          token.imageURL = `/img/crypto/${token.symbol}.svg`
          return token
        })
        //commented  out below as this seemed pointless - union and exclusion makes up the entire set
        //const manualList = newList.filter(({ symbol }) => SUPPORTED_TOKEN_LIST.has(symbol))
        //const jupiterList = newList.filter(({ symbol }) => !SUPPORTED_TOKEN_LIST.has(symbol))
        splList.push({
          address: '6LNeTYMqtNm1pBFN8PfhQaoLyegAH8GD32WmHU9erXKN',
          decimals: 8,
          name: 'Aptos Coin (Wormhole)',
          symbol: 'APT',
          chainId: 101,
          imageURL: `/img/crypto/APT.svg`
        })

        //TODO: Add filteredList from solana-spl-registry back
        if (chainId === ENV.Devnet) {
          farmSupportedList = []
          farmSupportedList.push({
            address: '2uig6CL6aQNS8wPL9YmfRNUNcQMgq9purmXK53pzMaQ6',
            chainId,
            decimals: 9,
            name: 'GooseFX',
            symbol: 'GOFX',
            imageURL: `/img/crypto/GOFX.svg`
          })

          farmSupportedList.push({
            address: ADDRESSES.devnet.sslPool.USDC.address.toString(),
            chainId,
            decimals: 9,
            name: 'USD Coin',
            symbol: 'USDC',
            imageURL: `/img/crypto/USDC.svg`
          })

          farmSupportedList.push({
            address: ADDRESSES.devnet.sslPool.SOL.address.toString(),
            chainId,
            decimals: 9,
            name: 'SOLANA',
            symbol: 'SOL',
            imageURL: `/img/crypto/SOL.svg`
          })

          farmSupportedList.push({
            address: ADDRESSES.devnet.sslPool.ETH.address.toString(),
            chainId,
            decimals: 9,
            name: 'ETH',
            symbol: 'ETH',
            imageURL: `/img/crypto/ETH.svg`
          })
        }
        setFarmingTokens(farmSupportedList)
        let filteredList = splList.map((i) => {
          if (i.symbol === 'SOL') {
            i.name = 'SOLANA'
          } else if (i.address === 'APTtJyaRX5yGTsJU522N4VYWg3vCvSb65eam5GrPT5Rt') {
            i.symbol = 'APRT'
          }
          return i
        })

        if (chainId === ENV.Devnet) {
          filteredList = []
          filteredList.push({
            address: ADDRESSES.devnet.mints.GOFX.address.toString(),
            chainId,
            decimals: 9,
            name: 'GooseFX',
            symbol: 'GOFX',
            imageURL: `/img/crypto/GOFX.svg`
          })

          filteredList.push({
            address: ADDRESSES.devnet.mints.gUSD.address.toString(),
            chainId,
            decimals: 9,
            name: 'GFX USD Coin',
            symbol: 'gUSDC',
            imageURL: `/img/crypto/gUSDC.svg`
          })

          filteredList.push({
            address: ADDRESSES.devnet.mints.gSOL.address.toString(),
            chainId,
            decimals: 9,
            name: 'GFX SOLANA',
            symbol: 'gSOL',
            imageURL: `/img/crypto/gSOL.svg`
          })

          filteredList.push({
            address: ADDRESSES.devnet.mints.gETH.address.toString(),
            chainId,
            decimals: 9,
            name: 'GFX ETH',
            symbol: 'gETH',
            imageURL: `/img/crypto/gETH.svg`
          })

          filteredList.push({
            address: ADDRESSES.devnet.mints.gAVAX.address.toString(),
            chainId,
            decimals: 9,
            name: 'GFX AVAX',
            symbol: 'gAVAX',
            imageURL: `/img/crypto/gAVAX.svg`
          })
        }

        filteredList.sort(({ symbol: a }, { symbol: b }) => a.localeCompare(b))
        setTokens(filteredList)
      } catch (e) {
        console.log(e)
      }
    })()
  }, [chainId])

  return (
    <TokenRegistryContext.Provider
      value={{
        getTokenInfoFromSymbol,
        getTokenInfoForFarming,
        tokens,
        tokenMap,
        farmTokenMap
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

  return context
}
