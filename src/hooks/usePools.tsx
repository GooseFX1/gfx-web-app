import { fetchAllPools } from '@/api/gamma'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { GAMMAPool, GAMMAPoolsResponse } from '@/types/gamma'
import { useEffect, useState } from 'react'
import { clamp } from '@/utils'

export function usePools({
  sortKey,
  sortOrder,
  searchTokens,
  showDeposited,
  showCreated,
  pageSize = 10
}: {
  sortKey: any
  sortOrder: any
  searchTokens: string
  showDeposited: boolean
  showCreated: boolean
  pageSize: number
}) {
  const { base58PublicKey } = useWalletBalance()
  const [pools, setPools] = useState<GAMMAPool[]>([])
  const [poolsHasMoreData, setPoolsHasMoreData] = useState(false)
  const [totalPoolCount, setTotalPoolCount] = useState(0)
  const [poolPage, setPoolPage] = useState(1)
  const [nextPage, setNextPage] = useState(2)
  const [isLoadingPools, setIsLoadingPools] = useState(false)

  const loadPools = (initialPoolPage?: number) => {
    setIsLoadingPools(true)
    fetchAllPools({
      page: initialPoolPage || poolPage,
      pageSize,
      poolType: 'all',
      sortOrder: sortOrder,
      searchTokens,
      userPublicKey: base58PublicKey,
      showDeposited,
      showCreated: showCreated,
      sortKey: sortKey
    })
      .then((poolsData: GAMMAPoolsResponse) => {
        if (poolsData && poolsData.success) {
          setPoolsHasMoreData(poolsData.data.totalPages > poolsData.data.currentPage)
          setTotalPoolCount(poolsData.data.totalItems)
          setPoolPage(poolsData.data.currentPage + 1)
          setNextPage(clamp(poolsData.data.currentPage + 1, 1, poolsData.data.totalPages))
          const existingPools = pools
          const existingPoolsMap = new Map(
            existingPools.map((pool) => [`${pool.mintA.address}_${pool.mintB.address}`, pool])
          )

          // Process new pools, overwriting existing entries to maintain sort order
          const updatedPools = poolsData.data.pools.map((pool) => {
            const key = `${pool.mintA.address}_${pool.mintB.address}`
            // If pool exists and we're appending, use existing data
            if (existingPoolsMap.has(key)) {
              existingPoolsMap.delete(key) // Remove from map since we've handled it
              return pool // Use new pool to maintain sort order
            }
            return pool
          })

          // Add any remaining existing pools that weren't in the new data
          updatedPools.unshift(...Array.from(existingPoolsMap.values()))

          setPools(updatedPools)
        }
      })
      .finally(() => setIsLoadingPools(false))
  }

  useEffect(() => {
    setPools([])
    setPoolPage(1)
    setPoolsHasMoreData(false)
    setTotalPoolCount(0)
    loadPools(1)
  }, [pageSize, sortKey, searchTokens, showCreated, showDeposited, base58PublicKey])

  const loadMorePools = () => {
    if (isLoadingPools || !poolsHasMoreData) return
    loadPools(nextPage)
  }

  return {
    pools,
    poolsHasMoreData,
    totalPoolCount,
    poolPage,
    isLoadingPools,
    loadMorePools
  }
}
