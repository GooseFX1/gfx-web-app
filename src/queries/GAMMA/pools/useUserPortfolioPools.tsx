import useQueryWrapperWithError from '@/queries/useQueryWrapperWithError'
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'
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
import useUserLiquidityQuery from '@/queries/GAMMA/user/useUserLiquidityQuery'
import { attachLiquidity } from '@/queries/GAMMA/gammaQueries.helpers'
import { INTERVALS } from '@/utils/time'

type MintSearchProps = {
  mintA: string
  mintB?: string
}
type UserPortfolioQueryProps = MintSearchProps & PoolsQueryProps
type PoolsAPIResponse = InfiniteDataAPIResponse<GAMMAPortfolioPool[]>
type PoolsQueryResponse = InfiniteDataQueryResponse<PoolsAPIResponse, GAMMAPortfolioPool>

const DEFAULT = {
  pages: [],
  allPages: [],
  maxPagesReached: false,
  pageParams: [1]
} as InfiniteData<PoolsAPIResponse>

function useUserPortfolioPools(props: UserPortfolioQueryProps) {
  const { base58PublicKey } = useWalletBalance()
  const { pathname } = useLocation()
  const keys = getQueryKeys('GAMMA-user-portfolio-pools', base58PublicKey, props)

  const liqQuery = useUserLiquidityQuery()

  return useQueryWrapperWithError(
    useInfiniteQuery({
      queryKey: keys,
      queryFn: async ({ signal, pageParam}) => {
        if (props.mintA) {
          return await fetchPoolsByMints({
            pageParam,
            signal,
            mintA: props.mintA,
            mintB: props.mintB,
            sortBy: props.sortBy,
            sortDirection: props.sortDirection,
            showCreated: props.showCreated,
            showDeposited: props.showDeposited,
            userPublicKey: base58PublicKey
          })
        } else {
          return await fetchPools({
            pageParam,
            signal,
            sortBy: props.sortBy,
            sortDirection: props.sortDirection,
            showCreated: props.showCreated,
            showDeposited: props.showDeposited,
            userPublicKey: base58PublicKey
          })
        }
      },
      getNextPageParam: (lastPage) => lastPage?.nextPage,
      getPreviousPageParam: (firstPage) => firstPage?.nextPage,
      select: (data) => {
        const flatPages = attachLiquidity({
          pools: data.pages.flatMap((page) => page.data),
          userLiqQuery: liqQuery,
          mintA: props.mintA,
          mintB: props.mintB,
          sortBy: props.sortBy,
          sortDirection: props.sortDirection
        })
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
  pageParam = 1
}): Promise<PoolsAPIResponse> {
  const pageQuery = `?page=${pageParam}`
  const sortQuery = `&sortBy=${sortBy}&sortDirection=${sortDirection}`
  const mintQuery = `&mintA=${mintA}${mintB ? `&mintB=${mintB}` : ''}`
  let userQuery = ``
  if (userPublicKey) {
    userQuery = `&userPublicKey=${userPublicKey}&showCreated=${showCreated}&showDeposited=${showDeposited}`
  }
  const response = (await fetch(
    getGAMMARootUrl() + GAMMA_ENDPOINTS_V1.PORTFOLIO_POOLS_SEARCH + pageQuery + sortQuery + mintQuery + userQuery,
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
  pageParam = 1
}): Promise<PoolsAPIResponse> {
  const pageQuery = `?page=${pageParam}`
  const sortQuery = `&sortBy=${sortBy}&sortDirection=${sortDirection}`
  let userQuery = ``
  if (userPublicKey) {
    userQuery = `&userPublicKey=${userPublicKey}&showCreated=${showCreated}&showDeposited=${showDeposited}`
  }
  const response = (await fetch(
    getGAMMARootUrl() + GAMMA_ENDPOINTS_V1.PORTFOLIO_POOLS + pageQuery + sortQuery + userQuery,
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
