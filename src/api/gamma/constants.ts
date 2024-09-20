export const GAMMA_API_BASE = 'http://localhost:4000/v1'

export enum GAMMA_ENDPOINTS_V1 {
  CONFIG = '/config',
  STATS = '/stats',
  POOLS_INFO_IDS = '/pool/info/ids',
  POOLS_INFO_ALL = '/pool/info/all',
  USER = `/user`,
  PORTFOLIO_STATS = `/portfolio-stats`,
  LP_POSITIONS = `/user-liquidity`,
  TOKEN_LIST = '/token-list'
}