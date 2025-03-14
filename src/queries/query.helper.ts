import { PortfolioStatsResponse } from '@/queries/GAMMA/pools/useUserPortfolioStatsQuery'
import { GAMMAStats, GAMMAUserLPPositionWithPrice } from '@/types/gamma'

export function getQueryKeys(key: string, ...args: any[]) {
  return [key, ...args]
}

export const INFINITE_QUERY_KEY = 'infiniteQueryKey' as const
export const QUERY_KEY = 'queryKey' as const
export const DEFAULT_INFINITE_QUERY_RESPONSE = {
  pages: [],
  allPages: [],
  maxPagesReached: false,
  pageParams: [1],
  totalItems: 0
}

export const UseStatsQueryKey = 'GAMMA-stats' as const
export const UseUserLiquidityQueryKey = 'GAMMA-user-liquidity' as const
export const UsePortfolioStatsQueryKey = 'GAMMA-portfolio-stats' as const
export const UseSelectPoolQueryKey = 'GAMMA-pool-by-id' as const
export const UsePoolsQueryKey = 'GAMMA-pools' as const
export const UseSelectPoolQueryDefault = null
export const UsePortfolioStatsQueryDefault: PortfolioStatsResponse = {
  portfolioValue: '0.00'
} as const
export const UseStatsQueryDefault: GAMMAStats = {
  tvl: '0',
  stats24h: {
    volume: '0',
    fees: '0'
  },
  stats7d: {
    volume: '0',
    fees: '0'
  },
  stats30d: {
    volume: '0',
    fees: '0'
  }
} as const

export const UseUserLiquidityQueryDefault: GAMMAUserLPPositionWithPrice[] = [] as const

export const QUERY_DEFAULT_MAP = {
  [UseSelectPoolQueryKey]: UseSelectPoolQueryDefault,
  [UsePortfolioStatsQueryKey]: UsePortfolioStatsQueryDefault,
  [UseStatsQueryKey]: UseStatsQueryDefault,
  [UseUserLiquidityQueryKey]: UseUserLiquidityQueryDefault
} as const
