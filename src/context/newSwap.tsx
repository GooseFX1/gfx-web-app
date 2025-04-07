import React, { createContext, FC, ReactNode, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { JupToken } from '@/pages/FarmV4/constants'
import { fetchTokensByPublicKey } from '@/api/gamma'
import { useConnectionConfig } from '@/context/settings'
import { useHistory } from 'react-router-dom'
import useTokenInput, { useTokenInputCommands } from '@/hooks/useTokenInput'
import useTokensQuery from '@/queries/useTokensQuery'

interface ISwapConfig {
  tokens: JupToken[]
  selectedTokenA: JupToken | null
  selectedTokenB: JupToken | null
  amountTokenA: string
  amountTokenB: string
  slippage: number
  maxTokensReached: boolean
  isLoadingTokenList: boolean
  searchValue: string
  amountTokenACommands: useTokenInputCommands
  amountTokenBCommands: useTokenInputCommands
  setSearchValue: (value: string) => void
  setSelectedTokenA: (token: JupToken) => void
  setSelectedTokenB: (token: JupToken) => void
  setSlippage: (slippage: number) => void
  loadNextPage: ()=>void
}

const SwapContext = createContext<ISwapConfig | null>(null)

export const SwapProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const history = useHistory()
  const { userCache, updateUserCache } = useConnectionConfig()
  const [searchValue, setSearchValue] = useState<string>('')
  const [selectedTokenA, setSelectedTokenA] = useState<JupToken | null>(null)
  const [selectedTokenB, setSelectedTokenB] = useState<JupToken | null>(null)
  const [amountTokenA, amountTokenACommands] = useTokenInput()
  const [amountTokenB, amountTokenBCommands] = useTokenInput()
  const [slippage, setSlippage] = useState<number>(userCache?.swap?.slippage ?? 1.0)
  // external hooks
  useLayoutEffect(() => {
    const query = new URLSearchParams(location.search);
    const mintA = query.get('mintA');
    const mintB = query.get('mintB');

    let keys = '';
    if (mintA) {
      keys += mintA;
    }
    if (mintB) {
      keys += ',';
      keys += mintB;
    }
    fetchTokensByPublicKey(keys).then((res)=>{
      if (!res || !res.success) return;
      res.data.tokens.forEach((token)=>{
        if (token.address === mintA) {
          setSelectedTokenA(token);
        }
        if (token.address === mintB) {
          setSelectedTokenB(token);
        }
      })
    })
  }, [])

  useLayoutEffect(() => {
    const mintA = selectedTokenA?.address;
    const mintB = selectedTokenB?.address;
    const params = new URLSearchParams();
    if (mintA) {
      params.set('mintA', mintA);
    }
    if (mintB) {
      params.set('mintB', mintB);
    }
    const newUrl = `${location.pathname}?${params.toString()}`;
    if (location.pathname !== newUrl) {
      history.push({
        pathname: location.pathname,
        search: params.toString()
      });
    }

  }, [selectedTokenA,selectedTokenB])

  useEffect(() => {
    updateUserCache({
      ...userCache,
      swap: {
        ...userCache.swap,
        slippage: slippage
      }
    })
  }, [slippage, userCache])
  const tokensQuery = useTokensQuery({
    searchValue: searchValue,
    poolType: 'all'
  });
  return (
    <SwapContext.Provider
      value={{
        tokens: tokensQuery.data.allPages ?? [],
        selectedTokenA,
        selectedTokenB,
        amountTokenA,
        amountTokenB,
        slippage,
        maxTokensReached: tokensQuery.data.maxPagesReached,
        isLoadingTokenList: tokensQuery.isFetching,
        amountTokenACommands,
        amountTokenBCommands,
        setSearchValue,
        setSelectedTokenA,
        setSelectedTokenB,
        setSlippage,
        searchValue,
        loadNextPage: tokensQuery.fetchNextPage
      }}
    >
      {children}
    </SwapContext.Provider>
  )
}

export const useSwap = (): ISwapConfig => {
  const context = useContext(SwapContext)

  if (!context) {
    throw new Error('Missing swap context')
  }
  return context
}
