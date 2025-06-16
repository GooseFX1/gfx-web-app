import React, { createContext, FC, ReactNode, useContext, useEffect, useLayoutEffect, useState } from 'react'
import { JupToken } from '@/pages/FarmV4/constants'
import { fetchTokensByPublicKey } from '@/api/gamma'
import { useConnectionConfig } from '@/context/settings'
import { useNavigate, useLocation } from 'react-router-dom'
import useTokenInput, { useTokenInputCommands } from '@/hooks/useTokenInput'
import useTokensQuery from '@/queries/useTokensQuery'
import { useQuery } from '@tanstack/react-query'
import { INTERVALS } from '@/utils/time'

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
  loadNextPage: () => void
}

const SwapContext = createContext<ISwapConfig | null>(null)

export const SwapProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { userCache, updateUserCache } = useConnectionConfig()
  const [searchValue, setSearchValue] = useState<string>('')
  const [selectedTokenA, setSelectedTokenA] = useState<JupToken | null>(null)
  const [selectedTokenB, setSelectedTokenB] = useState<JupToken | null>(null)
  const [amountTokenA, amountTokenACommands] = useTokenInput()
  const [amountTokenB, amountTokenBCommands] = useTokenInput()
  const [slippage, setSlippage] = useState<number>(userCache?.swap?.slippage ?? 1.0)

  const tokenDeepLinkQuery = useQuery({
    queryKey: ['tokenDeepLink', location.search],
    queryFn: async () => {
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
      if (!keys) return [];
      return await fetchTokensByPublicKey(keys).then((res) => {
        if (!res || !res.success) return [];
        return res.data.tokens;
      })
    },
    staleTime: INTERVALS.MINUTE,
    placeholderData: []
  })

  useEffect(() => {
    if (tokenDeepLinkQuery.isError || tokenDeepLinkQuery.data?.length === 0) return;
    console.log('REMOUNT')
    const query = new URLSearchParams(location.search);
    const mintA = query.get('mintA');
    const mintB = query.get('mintB');
    const tokenA = tokenDeepLinkQuery.data.find((token) => token.address === mintA);
    const tokenB = tokenDeepLinkQuery.data.find((token) => token.address === mintB);
    setSelectedTokenA(tokenA);
    setSelectedTokenB(tokenB);
  }, [tokenDeepLinkQuery.data])

  useLayoutEffect(() => {
    const mintA = selectedTokenA?.address;
    const mintB = selectedTokenB?.address;
    const params = new URLSearchParams(window.location.search);
    if (mintA) {
      params.set('mintA', mintA);
    }
    if (mintB) {
      params.set('mintB', mintB);
    }
    const newUrl = `${location.pathname}?${params.toString()}`;
    if (location.pathname !== newUrl) {
      navigate({
        pathname: location.pathname,
        search: params.toString()
      }, { replace: true });
    }
  }, [selectedTokenA, selectedTokenB, navigate, location.pathname])

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
    searchValue: searchValue
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
