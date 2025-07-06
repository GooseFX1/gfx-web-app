import { useEffect, useMemo, useState } from 'react'
import { JupToken, TOKEN_LIST_PAGE_SIZE } from '@/pages/FarmV4/constants'
import { fetchTokenList } from '@/api/gamma'
import useFirstRender from './useFirstRender'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { clamp } from '@/utils'
import useDebounce from '@/hooks/useDebounce'
import { POPULAR_TOKENS } from '@/constants'

export function useTokens({ searchValue: initialSearchValue }: { searchValue: string }) {
  const [tokens, setTokens] = useState<JupToken[]>([])
  const [tokenPage, setTokenPage] = useState<number>(1)
  const [nextTokenPage, setNextTokenPage] = useState<number>(2)
  const [maxTokensReached, setMaxTokensReached] = useState<boolean>(false)
  const [isLoadingTokenList, setIsLoadingTokenList] = useState<boolean>(false)
  const { balance, topBalances, publicKey } = useWalletBalance()
  const [searchValue, setSearchValue] = useState<string>(initialSearchValue)
  const firstMount = useFirstRender()
  const { debounce, abortDebounce } = useDebounce()
  const updateTokens = ({ page }) => {
    setIsLoadingTokenList(true)

    fetchTokenList(page, TOKEN_LIST_PAGE_SIZE, undefined, searchValue)
      .then((res) => {
        if (!res.success) return
        if (res?.data?.tokens) {
          setTokens(res.data.tokens)
        }
        setTokenPage(res.data.currentPage)
        setMaxTokensReached(res.data.totalPages == res.data.currentPage)
        setNextTokenPage(clamp(res.data.currentPage + 1, 1, res.data.totalPages))
      })
      .finally(() => {
        setIsLoadingTokenList(false)
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
    debounce(() => updateTokens({ page: 1 }), 333)
    return () => {
      abortDebounce()
    }
  }, [searchValue])
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
  const loadNextPage = async () => {
    if (isLoadingTokenList || maxTokensReached) return
    await updateTokens({ page: nextTokenPage })
  }
  return {
    searchValue,
    setSearchValue,
    tokens,
    tokenPage,
    setTokenPage,
    maxTokensReached,
    isLoadingTokenList,
    updateTokens,
    topBalancesWithTokenList,
    nextTokenPage,
    loadNextPage
  }
}
