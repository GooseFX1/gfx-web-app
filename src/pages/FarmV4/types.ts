// Enums
enum PoolCategory {
  Primary = 'Primary',
  Hyper = 'Hyper'
}

// Types
type TokenInfo = {
  name: string
  mint: string
}

type GAMMAUser = {
  uuid: string
  publicKey: string
  favorites: string[] // GAMMAPool.uuid
}

// Interfaces
interface GAMMAProtocolMetrics {
  userTotalEarningsUSD: string
  tvlUSD: string
  volume24hrUSD: string
  fee24hrUSD: string
  volume7dUSD: string
  fee7dUSD: string
  allTimeVolumeUSD: string
  allTimeFeesUSD: string
}

interface GAMMAPool {
  uuid: string
  tokenA: TokenInfo
  tokenB: TokenInfo
  poolCategory: PoolCategory
  liquidityUSD: string
  volume24hrUSD: string
  fees24hrUSD: string
  apr: number
  feeTier: number
}

interface UserPortfolioMetrics {
  totalPortfolioValue: string
  totalEarnings: string
}

interface UserPortfolioLPPosition {
  uuid: string
  tokenA: TokenInfo
  tokenB: TokenInfo
  positionValueUSD: string
  tokenAQuantity: string
  tokenBQuantity: string
  pendingYieldUSD: string
  totalYieldUSD: string
  apr: number
}

interface CreateGAMMAPool {
  poolCategory: PoolCategory
  tokenA: TokenInfo
  tokenB: TokenInfo
  tokenAAmount: string
  tokenBAmount: string
  initialPrice: string
  minPrice: string
  maxPrice: string
  totalDeposit: string
  feeTier: number
}

// Data model
interface GAMMADataModel {
  aggregateMetrics: GAMMAProtocolMetrics
  pools: GAMMAPool[]
  userPortfolio: {
    user: GAMMAUser
    aggregate: UserPortfolioMetrics
    lpPositions: UserPortfolioLPPosition[]
  }
}

export {
  PoolCategory,
  TokenInfo,
  GAMMAProtocolMetrics,
  GAMMAPool,
  CreateGAMMAPool,
  UserPortfolioMetrics,
  UserPortfolioLPPosition,
  GAMMADataModel
}
