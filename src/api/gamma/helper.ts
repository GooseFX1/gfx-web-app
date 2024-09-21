import { GAMMAPool, Pool } from '@/types/gamma'
import { GAMMA_SORT_CONFIG, GAMMASortConfig } from '@/pages/FarmV4/constants'

const sortAndFilterPools = (
  pools: GAMMAPool[],
  searchTokens: string,
  currentPoolType: Pool,
  sortConfig: GAMMASortConfig
) => {
  const tokens = searchTokens.toLowerCase()

  return pools
    .filter((pool) => {
      const searchFound =
        searchTokens.length === 0 ||
        pool.mintA.name.toLowerCase().includes(tokens) ||
        pool.mintB.name.toLowerCase().includes(tokens)
      const isMatchingPoolType = pool.pool_type === currentPoolType.type
      return searchFound && isMatchingPoolType
    })
    .sort((a, b) => {
      switch (sortConfig.name) {
        case GAMMA_SORT_CONFIG[0].name:
          return b.tvl - a.tvl
        case GAMMA_SORT_CONFIG[1].name:
          return a.tvl - b.tvl
        case GAMMA_SORT_CONFIG[2].name:
          return (
            b.stats.daily.volumeTokenAUSD +
            b.stats.daily.volumeTokenBUSD -
            (a.stats.daily.volumeTokenAUSD + a.stats.daily.volumeTokenBUSD)
          )
        case GAMMA_SORT_CONFIG[3].name:
          return (
            a.stats.daily.volumeTokenAUSD +
            a.stats.daily.volumeTokenBUSD -
            (b.stats.daily.volumeTokenAUSD + b.stats.daily.volumeTokenBUSD)
          )
        case GAMMA_SORT_CONFIG[4].name:
          return b.stats.daily.tradeFeesUSD - a.stats.daily.tradeFeesUSD
        case GAMMA_SORT_CONFIG[5].name:
          return a.stats.daily.tradeFeesUSD - b.stats.daily.tradeFeesUSD
        case GAMMA_SORT_CONFIG[6].name:
          return b.stats.daily.feesAprUSD - a.stats.daily.feesAprUSD
        case GAMMA_SORT_CONFIG[7].name:
          return a.stats.daily.feesAprUSD - b.stats.daily.feesAprUSD
        default:
          return 0
      }
    })
}

export { sortAndFilterPools }
