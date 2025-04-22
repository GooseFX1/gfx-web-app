import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/queries/query.helper'
import { PoolsAPIResponse } from '@/queries/GAMMA/pools/usePoolsQuery'
import { GAMMAPool, GAMMAPortfolioPoolResponse } from '@/types/gamma'
import { POOL_LIST_PAGE_SIZE } from '@/pages/FarmV4/constants'
import { getGAMMARootUrl } from '@/api'
import { GAMMA_ENDPOINTS_V1 } from '@/api/gamma/constants'
import { clamp } from '@/utils'

type Props = {
  symbolA?: string
  symbolB?: string
}

function useSelectPoolByMints({ symbolA, symbolB }: Props) {
  return useQuery({
    queryKey: [QUERY_KEY, 'useSelectPoolByMints', symbolA, symbolB],
    queryFn: async ({ signal }) => {
      if (!symbolA || !symbolB) return null
      const results = await getAllPoolMintResults({
        symbolA: symbolA,
        symbolB: symbolB,
        signal,
      })
      if (!results || results.length == 0) return null
      let pool: GAMMAPool
      for (const result of results) {
        if (
          (result.mintA.symbol == symbolA && result.mintB.symbol == symbolB) ||
          (result.mintA.symbol == symbolB && result.mintB.symbol == symbolA)
        ) {
          pool = result
          break
        }
      }
      return pool
    },
    staleTime: Infinity,
    enabled: !!symbolA && !!symbolB
  })
}

export default useSelectPoolByMints

async function getAllPoolMintResults({ symbolA, symbolB, signal }) {
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
  const sortQuery = `&sortBy=volume24h&sortOrder=desc`
  const symbolQuery = `&symbol1=${symbolA.trim()}&symbol2=${symbolB.trim()}`
  const poolTypeQuery = `&poolType=all`

  const response = (await fetch(
    getGAMMARootUrl() + GAMMA_ENDPOINTS_V1.POOLS_INFO_MINTS + pageQuery + sortQuery + symbolQuery + poolTypeQuery,
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
