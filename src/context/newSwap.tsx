import React, { createContext, FC, ReactNode, useContext, useEffect, useLayoutEffect, useMemo, useState } from 'react'
import { JupToken, TOKEN_LIST_PAGE_SIZE } from '@/pages/FarmV4/constants'
import useBoolean from '@/hooks/useBoolean'
import { fetchTokenList, fetchTokensByPublicKey } from '@/api/gamma'
import { aborter } from '@/utils'
import { useConnectionConfig } from '@/context/settings'
import { useWalletBalance } from '@/context/walletBalanceContext'
import useFirstRender from '@/hooks/useFirstRender'
import { useHistory } from 'react-router-dom'
import useTokenInput, { useTokenInputCommands } from '@/hooks/useTokenInput'

interface ISwapConfig {
  tokens: JupToken[]
  selectedTokenA: JupToken | null
  selectedTokenB: JupToken | null
  amountTokenA: string
  amountTokenB: string
  slippage: number
  tokenPage: number
  maxTokensReached: boolean
  isLoadingTokenList: boolean
  searchValue: string
  amountTokenACommands: useTokenInputCommands
  amountTokenBCommands: useTokenInputCommands
  setSearchValue: (value: string) => void
  setSelectedTokenA: (token: JupToken) => void
  setSelectedTokenB: (token: JupToken) => void
  setSlippage: (slippage: number) => void
  topBalancesWithTokenList: JupToken[]
  setTokenPage: (page: number) => void
}

const SwapContext = createContext<ISwapConfig | null>(null)
const tokenListAborterTokenSwap = 'tokenListSWAP'
export const SwapProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const history = useHistory()
  const { userCache, updateUserCache } = useConnectionConfig()
  const [tokens, setTokens] = useState<JupToken[]>([])
  const [tokenPage, setTokenPage] = useState<number>(1)
  const [maxTokensReached, setMaxTokensReached] = useBoolean(true)
  const [isLoadingTokenList, setIsLoadingTokenList] = useBoolean(false)
  const [searchValue, setSearchValue] = useState<string>('')
  const [selectedTokenA, setSelectedTokenA] = useState<JupToken | null>(null)
  const [selectedTokenB, setSelectedTokenB] = useState<JupToken | null>(null)
  const [amountTokenA, amountTokenACommands] = useTokenInput()
  const [amountTokenB, amountTokenBCommands] = useTokenInput()
  const [slippage, setSlippage] = useState<number>(userCache?.swap?.slippage ?? 1.0)
  const firstMount = useFirstRender()
  // external hooks
  const { balance, topBalances, publicKey } = useWalletBalance()
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

  useEffect(() => {
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

  const updateTokens = ({ page }) => {
    setIsLoadingTokenList.on()
    const signal = aborter.addSignal(tokenListAborterTokenSwap)

    fetchTokenList(page, TOKEN_LIST_PAGE_SIZE, undefined, searchValue, signal)
      .then((res) => {
        if (!res.success) return
        if (res?.data?.tokens) {
          setTokens(res.data.tokens)
        }
        setTokenPage(res.data.currentPage)
        setMaxTokensReached.set(res.data.totalPages == res.data.currentPage)
      })
      .finally(() => {
        setIsLoadingTokenList.off()
      })
  }
  useEffect(() => {
    if (firstMount) {
      updateTokens({
        page: 1
      })
    }
  }, [])
  useEffect(() => {
    updateUserCache({
      ...userCache,
      swap: {
        ...userCache.swap,
        slippage: slippage
      }
    })
  }, [slippage, userCache])

  const topBalancesWithTokenList: JupToken[] = useMemo(() => {
    if (!tokens.length || !publicKey) return []
    const data = []
    const hasTokenSet = new Set()
    for (const tokenBalance of topBalances) {
      if (!hasTokenSet.has(tokenBalance.mint)) {
        hasTokenSet.add(tokenBalance.mint)
        data.push({
          ...tokenBalance,
          address: tokenBalance.mint
        })
      }
    }
    for (const token of tokens) {
      if (!hasTokenSet.has(token.address)) {
        data.push(token)
      }
    }
    return data.sort((a, b) => (balance[a.address].value.gt(balance[b.address].value) ? -1 : 1))
  }, [topBalances, tokens, balance, publicKey])

  useEffect(() => {
    if (firstMount) return
    const timeout = setTimeout(() => {
      updateTokens({
        page: 1
      })
    }, 250)
    return () => {
      clearTimeout(timeout)
    }
  }, [searchValue])
  return (
    <SwapContext.Provider
      value={{
        tokens,
        selectedTokenA,
        selectedTokenB,
        amountTokenA,
        amountTokenB,
        slippage,
        tokenPage,
        maxTokensReached,
        isLoadingTokenList,
        amountTokenACommands,
        amountTokenBCommands,
        setSearchValue,
        setSelectedTokenA,
        setSelectedTokenB,
        setSlippage,
        topBalancesWithTokenList,
        searchValue,
        setTokenPage
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
