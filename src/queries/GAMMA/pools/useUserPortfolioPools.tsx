import useQueryWrapperWithError from '@/queries/useQueryWrapperWithError'
import { useInfiniteQuery } from '@tanstack/react-query'
import { getQueryKeys } from '@/queries/query.helper'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { useLocation } from 'react-router-dom'
import { ROUTES } from '@/Router'
import {
  InfiniteDataAPIResponse,
  InfiniteDataQueryResponse,
  PoolsQueryProps,
  UseInfiniteQueryResponseFix
} from '@/queries/types'
import { getGAMMARootUrl } from '@/api'
import { GAMMA_ENDPOINTS_V1 } from '@/api/gamma/constants'
import { GAMMAPortfolioPool, GAMMAPortfolioPoolResponse } from '@/types/gamma'
import { clamp } from '@/utils'
import { INTERVALS } from '@/utils/time'
import { POOL_LIST_PAGE_SIZE } from '@/pages/FarmV4/constants'

type MintSearchProps = {
  mintA: string
  mintB?: string
}
type UserPortfolioQueryProps = MintSearchProps & PoolsQueryProps
type PoolsAPIResponse = InfiniteDataAPIResponse<GAMMAPortfolioPool[]>
type PoolsQueryResponse = InfiniteDataQueryResponse<PoolsAPIResponse, GAMMAPortfolioPool>

const DEFAULT: PoolsQueryResponse = {
  pages: [],
  allPages: [],
  maxPagesReached: false,
  pageParams: [1]
}

function useUserPortfolioPools({
  poolType,
  mintA,
  mintB,
  sortBy,
  sortDirection,
  showCreated,
  showDeposited
}: UserPortfolioQueryProps) {
  const { base58PublicKey } = useWalletBalance()
  const { pathname } = useLocation()
  const keys = getQueryKeys(
    'GAMMA-user-portfolio-pools',
    base58PublicKey,
    poolType,
    mintA,
    mintB,
    sortBy,
    sortDirection,
    showCreated,
    showDeposited
  )

  return useQueryWrapperWithError(
    useInfiniteQuery({
      queryKey: keys,
      queryFn: async ({ signal, pageParam }) => {
        if (mintA) {
          return await fetchPoolsByMints({
            pageParam,
            signal,
            mintA: mintA,
            mintB: mintB,
            sortBy: sortBy,
            sortDirection: sortDirection,
            showCreated: showCreated,
            showDeposited: showDeposited,
            userPublicKey: base58PublicKey,
            poolType: poolType
          })
        } else {
          return await fetchPools({
            pageParam,
            signal,
            poolType: poolType,
            sortBy: sortBy,
            sortDirection: sortDirection,
            showCreated: showCreated,
            showDeposited: showDeposited,
            userPublicKey: base58PublicKey
          })
        }
      },
      getNextPageParam: (lastPage) => lastPage?.nextPage,
      getPreviousPageParam: (firstPage) => firstPage?.nextPage,
      select: (data) => {
        const flatPages = data.pages.flatMap((page) => page.data)
        const lastPage = data.pages[data.pages.length - 1]

        return {
          allPages: flatPages,
          maxPagesReached: lastPage?.currentPage != lastPage?.totalPages,
          ...data
        }
      },
      placeholderData: DEFAULT,
      staleTime: INTERVALS.MINUTE,
      enabled: !!base58PublicKey && pathname.includes(ROUTES.GAMMA)
    }) as UseInfiniteQueryResponseFix<PoolsAPIResponse, Error, PoolsQueryResponse>,
    DEFAULT,
    keys
  )
}

//as UseInfiniteQueryResponseFix<PoolsAPIResponse, Error, PoolsQueryResponse>
export default useUserPortfolioPools

async function fetchPoolsByMints({
  signal,
  mintA,
  mintB,
  sortBy,
  sortDirection,
  showCreated,
  showDeposited,
  userPublicKey,
  poolType,
  pageParam = 1
}): Promise<PoolsAPIResponse> {
  const pageQuery = `?page=${pageParam}&${POOL_LIST_PAGE_SIZE}`
  const sortQuery = `&sortBy=${sortBy}&sortDirection=${sortDirection}`
  const mintQuery = `&mintA=${mintA}${mintB ? `&mintB=${mintB}` : ''}`
  const poolTypeQuery = `&poolType=${poolType}`
  let userQuery = ``
  if (userPublicKey) {
    userQuery = `&userPublicKey=${userPublicKey}&showCreated=${showCreated}&showDeposited=${showDeposited}`
  }
  const response = (await fetch(
    getGAMMARootUrl() +
      GAMMA_ENDPOINTS_V1.PORTFOLIO_POOLS_SEARCH +
      pageQuery +
      sortQuery +
      mintQuery +
      userQuery +
      poolTypeQuery,
    { signal }
  ).then((res) => res.json())) as GAMMAPortfolioPoolResponse

  return {
    data: response.data.pools,
    currentPage: response.data.currentPage,
    totalItems: response.data.totalItems,
    totalPages: response.data.totalPages,
    nextPage: clamp(response.data.currentPage + 1, 1, response.data.totalPages)
  }
}

async function fetchPools({
  signal,
  sortBy,
  sortDirection,
  showCreated,
  showDeposited,
  userPublicKey,
  poolType,
  pageParam = 1
}): Promise<PoolsAPIResponse> {
  const pageQuery = `?page=${pageParam}&pageSize=${POOL_LIST_PAGE_SIZE}`
  const sortQuery = `&sortBy=${sortBy}&sortDirection=${sortDirection}`
  const poolTypeQuery = `&poolType=${poolType}`
  let userQuery = ``
  if (userPublicKey) {
    userQuery = `&userPublicKey=${userPublicKey}&showCreated=${showCreated}&showDeposited=${showDeposited}`
  }
  const response = (await fetch(
    getGAMMARootUrl() + GAMMA_ENDPOINTS_V1.PORTFOLIO_POOLS + pageQuery + sortQuery + userQuery + poolTypeQuery,
    { signal }
  ).then((res) => res.json())) as GAMMAPortfolioPoolResponse

  return {
    data: response.data.pools,
    currentPage: response.data.currentPage,
    totalItems: response.data.totalItems,
    totalPages: response.data.totalPages,
    nextPage: clamp(response.data.currentPage + 1, 1, response.data.totalPages)
  }
}
