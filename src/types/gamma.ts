import { TokenListToken } from '@/context'

interface GAMMAConfig {
  id: string
  index: number
  protocolFeeRate: number
  tradeFeeRate: number
  fundFeeRate: number
  createPoolFee: string
}

interface GAMMAProtocolStats {
  userTotalEarningsUSD: string
  tvlUSD: string
  volume24hrUSD: string
  fee24hrUSD: string
  volume7dUSD: string
  fee7dUSD: string
  allTimeVolumeUSD: string
  allTimeFeesUSD: string
}

// Token Models
// TODO - marry with web3js types
type ExtensionsItem = {
  coingeckoId?: string
  feeConfig?: TransferFeeDataBaseType
}

// Extracted from the state for a token-22 mint.
interface TransferFeeDataBaseType {
  transferFeeConfigAuthority: string
  withdrawWithheldAuthority: string
  withheldAmount: string
  olderTransferFee: {
    epoch: string
    maximumFee: string
    transferFeeBasisPoints: number
  }
  newerTransferFee: {
    epoch: string
    maximumFee: string
    transferFeeBasisPoints: number
  }
}

type GAMMAToken = {
  chainId: number
  address: string
  programId: string
  logoURI: string
  symbol: string
  name: string
  decimals: number
  tags: string[] // "hasFreeze" | "hasTransferFee" | "token-2022" | "community" | "unknown" ..etc
  extensions: ExtensionsItem
}

type GAMMATokenList = {
  mintList: GAMMAToken[]
  blacklist: GAMMAToken[]
  whitelist: string[]
}

// Pool Models
enum GAMMAPoolCategory {
  Primary = 'Primary',
  Hyper = 'Hyper'
}

type GAMMAPoolKeysArray = GAMMAPoolKeys[]

interface GAMMAPoolKeys {
  programId: string
  id: string
  mintA: GAMMAToken
  mintB: GAMMAToken
  lookupTableAccount?: string
  openTime: string
  vault: { A: string; B: string }
  authority: string
  mintLp: GAMMAToken
  config: GAMMAConfig
}

interface GAMMAPool {
  programId: string
  id: string
  mintA: GAMMAToken
  mintB: GAMMAToken
  price: number
  mintAmountA: number
  mintAmountB: number
  feeRate: number
  openTime: string
  tvl: number
  day: GAMMAPoolStats
  week: GAMMAPoolStats
  month: GAMMAPoolStats
  lpMint: GAMMAToken
  lpPrice: number
  lpAmount: number
  config: GAMMAConfig
}

interface GAMMAPoolStats {
  volume: number
  volumeQuote: number
  volumeFee: number
  apr: number
  feeApr: number
  priceMin: number
  priceMax: number
  rewardApr: number[]
}

// user model
type GAMMAUser = {
  id: string
  publicKey: string
  favoritePools: string[] // GAMMAPool.id
}

interface UserPortfolioStats {
  totalPortfolioValue: string
  totalEarnings: string
}

interface UserPortfolioLPPosition {
  id: string
  tokenA: GAMMAToken
  tokenB: GAMMAToken
  positionValueUSD: string
  tokenAQuantity: string
  tokenBQuantity: string
  pendingYieldUSD: string
  totalYieldUSD: string
  apr: number
}

type GAMMAAPIPaginatedResponse = {
  currentPage: number
  pageSize: number
  totalPages: number
  totalItems: number
  count: number
}
type GAMMAAPIBaseResponse<T> = {
  success: boolean
  data: T
}

type GAMMAPoolsResponse = GAMMAAPIBaseResponse<{
  pools: GAMMAPool[]
} & GAMMAAPIPaginatedResponse>
type GAMMAListTokenResponse = GAMMAAPIBaseResponse<{
  tokens: TokenListToken[]
} & GAMMAAPIPaginatedResponse>
export type {
  GAMMAConfig,
  GAMMAProtocolStats,
  GAMMATokenList,
  GAMMAToken,
  ExtensionsItem,
  TransferFeeDataBaseType,
  GAMMAPoolKeysArray,
  GAMMAPoolKeys,
  GAMMAPool,
  GAMMAPoolCategory,
  GAMMAPoolStats,
  GAMMAUser,
  UserPortfolioStats,
  UserPortfolioLPPosition,
  GAMMAPoolsResponse,
  GAMMAListTokenResponse
}
