import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/queries/query.helper'
import { attachUserLiquidity, PoolsAPIResponse } from '@/queries/GAMMA/pools/usePoolsQuery'
import { GAMMAPool, GAMMAPoolWithUserLiquidity, GAMMAPortfolioPoolResponse } from '@/types/gamma'
import { POOL_LIST_PAGE_SIZE } from '@/pages/FarmV4/constants'
import { getGAMMARootUrl } from '@/api'
import { GAMMA_ENDPOINTS_V1 } from '@/api/gamma/constants'
import { clamp } from '@/utils'
import { INTERVALS } from '@/utils/time'
import useUserLiquidityQuery from '@/queries/GAMMA/user/useUserLiquidityQuery'

type Props = {
  symbolA?: string
  symbolB?: string
  enabled?: boolean
}

function useSelectPoolBySymbols({ symbolA, symbolB, enabled = true }: Props) {
  const userLiqQuery = useUserLiquidityQuery()
  return useQuery({
    queryKey: [QUERY_KEY, 'useSelectPoolBySymbols', symbolA, symbolB],
    queryFn: async ({ signal }) => {
      if (!symbolA || !symbolB) return null
      const results = await getAllPoolsBySymbolResults({
        symbolA: symbolA,
        symbolB: symbolB,
        signal
      })
      if (!results || results.length == 0) return null
      let pool: GAMMAPool
      for (const result of results) {
        if (
          (result.mintA.symbol.toLowerCase() == symbolA.toLowerCase() &&
            result.mintB.symbol.toLowerCase() == symbolB.toLowerCase()) ||
          (result.mintA.symbol.toLowerCase() == symbolB.toLowerCase() &&
            result.mintB.symbol.toLowerCase() == symbolA.toLowerCase())
        ) {
          pool = result
          break
        }
      }
      return pool as GAMMAPoolWithUserLiquidity;
    },
    select: (pool)=>{
      console.log('ppol',pool)
      if (!pool)return pool;
      return attachUserLiquidity([pool], userLiqQuery.data, pool.mintA.address, pool.mintB.address)[0]
    },
    staleTime: INTERVALS.MINUTE,
    enabled: !!symbolA && !!symbolB && enabled
  })
}

export default useSelectPoolBySymbols

async function getAllPoolsBySymbolResults({ symbolA, symbolB, signal }) {
  const res = await fetchPoolsBySymbols({
    symbolA,
    symbolB,
    signal,
    pageParam: 1
  })

  if (res.totalPages > 1) {
    const reqs = []
    for (let i = 2; i <= res.totalPages; i++) {
      reqs.push(
        fetchPoolsBySymbols({
          symbolA,
          symbolB,
          signal,
          pageParam: i
        })
      )
    }
    const resolved = await Promise.all(reqs)
    const allPools = resolved.reduce((acc, curr) => acc.concat(curr.data.pools), res.data)
    res.data = allPools
  }
  return res.data
}

async function fetchPoolsBySymbols({ signal, symbolA, symbolB, pageParam = 1 }): Promise<PoolsAPIResponse> {
  const pageQuery = `?page=${pageParam}&pageSize=${POOL_LIST_PAGE_SIZE}`
  // const sortQuery = `&sortBy=volume24h&sortOrder=desc`
  const symbolQuery = `&symbol1=${symbolA.trim()}&symbol2=${symbolB.trim()}`

  const response = (await fetch(getGAMMARootUrl() + GAMMA_ENDPOINTS_V1.POOL_BY_SYMBOLS + pageQuery + symbolQuery, {
    signal
  }).then((res) => res.json())) as GAMMAPortfolioPoolResponse
  if (!response || !response.data || !response.success) {
    throw new Error('Failed to fetch pools')
  }
  return {
    data: response.data.pools,
    currentPage: response.data.currentPage,
    totalItems: response.data.totalItems,
    totalPages: response.data.totalPages,
    nextPage: clamp(response.data.currentPage + 1, 1, response.data.totalPages)
  }
}
