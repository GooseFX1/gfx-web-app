import { POOL_LIST_PAGE_SIZE } from '@/pages/FarmV4/constants'
import { getGAMMARootUrl } from '@/api'
import { GAMMA_ENDPOINTS_V1 } from '@/api/gamma/constants'
import {
  GAMMAPool,
  GAMMAPoolWithUserLiquidity,
  GAMMAPortfolioPoolResponse,
  GAMMAUserLPPositionWithPrice
} from '@/types/gamma'
import { clamp } from '@/utils'
import {
  InfiniteDataAPIResponse,
  InfiniteDataQueryResponse,
  PoolsQueryProps,
  UseInfiniteQueryResponseFix
} from '@/queries/types'
import useQueryWrapperWithError from '@/queries/useQueryWrapperWithError'
import { getQueryKeys } from '@/queries/query.helper'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useWalletBalance } from '@/context/walletBalanceContext'
import useUserLiquidityQuery from '@/queries/GAMMA/user/useUserLiquidityQuery'
import { INTERVALS } from '@/utils/time'
import { useLocation } from 'react-router-dom'
import { ROUTES } from '@/Router'
import BN from 'bn.js'

type PoolsAPIResponse = InfiniteDataAPIResponse<GAMMAPool[]>
type MintSearchProps = {
  mintA: string
  mintB?: string
}
type PoolQueryProps = MintSearchProps & PoolsQueryProps
type PoolsQueryResponse = InfiniteDataQueryResponse<PoolsAPIResponse, GAMMAPoolWithUserLiquidity>
export type UsePoolQueryResponse = UseInfiniteQueryResponseFix<PoolsAPIResponse, Error, PoolsQueryResponse>
const DEFAULT: PoolsQueryResponse = {
  pages: [],
  allPages: [],
  maxPagesReached: false,
  pageParams: [1],
  totalItems: 0
}

function usePoolsQuery({
  mintA,
  mintB,
  sortBy,
  sortDirection,
  showCreated,
  showDeposited,
  poolType
}: PoolQueryProps) {
  const { base58PublicKey } = useWalletBalance()
  const { pathname } = useLocation()

  const keys = getQueryKeys(
    'GAMMA-pools',
    base58PublicKey,
    mintA,
    mintB,
    sortBy,
    sortDirection,
    showCreated,
    showDeposited,
    poolType
  )
  const userLiqQuery = useUserLiquidityQuery()
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
      getNextPageParam: (lastPage) => lastPage.nextPage,
      getPreviousPageParam: (firstPage) => firstPage.nextPage,
      select: (data) => {
        const flatData = data.pages.flatMap((page) => page.data)
        const lastPage = data.pages[data.pages.length - 1]
        const response: PoolsQueryResponse = {
          ...data,
          allPages: attachUserLiquidity(flatData, userLiqQuery.data, mintA, mintB),
          maxPagesReached: lastPage?.currentPage != lastPage?.totalPages,
          totalItems: lastPage?.totalItems ?? 0
        }
        return response
      },
      placeholderData: DEFAULT,
      staleTime: INTERVALS.MINUTE,
      enabled: !!base58PublicKey && pathname.includes(ROUTES.GAMMA)
    }) as UsePoolQueryResponse,
    DEFAULT,
    keys
  )
}

export default usePoolsQuery

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
  const mintQuery = `&mint1=${mintA}${mintB ? `&mint2=${mintB}` : ''}`
  const poolTypeQuery = `&poolType=${poolType}`
  let userQuery = ``
  if (userPublicKey) {
    userQuery = `&userPublicKey=${userPublicKey}&showCreated=${showCreated}&showDeposited=${showDeposited}`
  }
  const response = (await fetch(
    getGAMMARootUrl() +
      GAMMA_ENDPOINTS_V1.POOLS_INFO_MINTS +
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
    getGAMMARootUrl() + GAMMA_ENDPOINTS_V1.POOLS_INFO_ALL + pageQuery + sortQuery + userQuery + poolTypeQuery,
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

function attachUserLiquidity(
  pools: GAMMAPool[],
  userLiquidity: GAMMAUserLPPositionWithPrice[],
  mintA?: string,
  mintB?: string
) {
  const userLpPositions = new Map(userLiquidity.map((lp) => [lp.poolStatePublicKey, lp]))
  return pools
    .map((pool) => {
      const userLpPosition = userLpPositions.get(pool.id)
      return {
        ...pool,
        userLpPosition: userLpPosition ? structuredClone(userLpPosition) : undefined,
        hasDeposit: userLpPosition ? new BN(userLpPosition?.lpTokensOwned)?.gt(new BN(0)) : false
      }
    })
    .sort((a, b) => {
      if (mintA && mintB) {
        // don't have both so keep current sort
        if (
          (a.mintA.address === mintA && a.mintB.address === mintB) ||
          (a.mintB.address === mintA && a.mintA.address === mintB)
        ) {
          return -1
        } else if (
          (b.mintA.address === mintA && b.mintB.address === mintB) ||
          (b.mintB.address === mintA && b.mintA.address === mintB)
        ) {
          return 1
        }
      }
      return 0
    })
}
