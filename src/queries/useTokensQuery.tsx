import {
  useInfiniteQuery
} from '@tanstack/react-query'
import { GAMMA_API_BASE, GAMMA_ENDPOINTS_V1 } from '@/api/gamma/constants'
import { TOKEN_LIST_PAGE_SIZE } from '@/pages/FarmV4/constants'
import { GAMMAListTokenResponse } from '@/types/gamma'
import { clamp } from '@/utils'
import { IWalletBalanceContext, useWalletBalance } from '@/context/walletBalanceContext'
import { TokenListToken } from '@/context'
import { InfiniteDataAPIResponse, InfiniteDataQueryResponse, UseInfiniteQueryResponseFix } from '@/queries/types'
import { useEffect } from 'react'
import { DEFAULT_INFINITE_QUERY_RESPONSE, getQueryKeys } from '@/queries/query.helper'

type TokenQueryProps = {
  searchValue?: string
  poolType?: string
}
type TokenListAPIResponse = InfiniteDataAPIResponse<TokenListToken[]>

type TokenQueryResponse = InfiniteDataQueryResponse<TokenListAPIResponse, TokenListToken>

function useTokensQuery({
  searchValue = '',
  poolType = 'all'
                        }: TokenQueryProps) {
  const { base58PublicKey, topBalances, balance } = useWalletBalance()
  const keys = getQueryKeys('GAMMA-tokens', searchValue, poolType)
  const query =  useInfiniteQuery({
    queryKey: keys,
    queryFn: async ({ pageParam, signal, queryKey }) =>
      getTokens({
        searchValue: queryKey[1],
        poolType: queryKey[3],
        pageParam,
        signal
      }),
    select: (data) => {
      const flatData = data.pages.map((page) => page.data).flat()
      const lastPage = data.pages[data.pages.length - 1]
      const response: TokenQueryResponse = {
        pages: data.pages,
        allPages: flatData,
        pageParams: data.pageParams,
        maxPagesReached: lastPage?.currentPage >= lastPage?.totalPages
      }

      return response;
    },
    getNextPageParam: (lastPage: TokenListAPIResponse) => lastPage?.nextPage,
    getPreviousPageParam: (firstPage: TokenListAPIResponse) => firstPage?.nextPage,
    staleTime: 1000 * 60,
    placeholderData: DEFAULT_INFINITE_QUERY_RESPONSE // fixes type issue, but ugly :/
  }) as UseInfiniteQueryResponseFix<TokenListAPIResponse, Error, TokenQueryResponse>
  // ^ TypeCasting to fix the query.data access to get intellisense working

  useEffect(()=>{
    if (!query.data || query.data.allPages.length == 0) return
    query.data.allPages = getTopBalancesWithTokenList(query.data.allPages, balance, topBalances);
  },[balance,base58PublicKey,topBalances,query.data])

  return query;
}

export default useTokensQuery

function getTopBalancesWithTokenList(
  tokens: TokenListToken[],
  balance: IWalletBalanceContext['balance'],
  topBalances: IWalletBalanceContext['topBalances']
): TokenListToken[] {
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
}

async function getTokens({ searchValue, signal, pageParam = 1, poolType = 'all' }): Promise<TokenListAPIResponse> {
  const searchQuery = searchValue ? `&search=${searchValue}` : ''
  const poolTypeQuery = poolType ? `&tokenType=${poolType}` : ''
  const pageQuery = `?&page=${pageParam}&pageSize=${TOKEN_LIST_PAGE_SIZE}`
  const response = (await fetch(
    `https://${GAMMA_API_BASE}.goosefx.io` +
      GAMMA_ENDPOINTS_V1.TOKEN_LIST +
      pageQuery +
      searchQuery +
      poolTypeQuery,
    {
      signal
    }
  ).then((res) => res.json())) as GAMMAListTokenResponse

  return {
    data: response.data.tokens,
    totalPages: response.data.totalPages,
    totalItems: response.data.totalItems,
    currentPage: response.data.currentPage,
    nextPage: clamp(response.data.currentPage + 1, 1, response.data.totalPages)
  }
}
