import { customClient } from '../index'
import { GAMMA_API_BASE, GAMMA_ENDPOINTS_V1 } from '@/api/gamma/constants'
import {
  GAMMAConfig,
  GAMMAListTokenResponse,
  GAMMAPoolsResponse,
  GAMMAProtocolStats,
  GAMMAUser,
  UserPortfolioLPPosition,
  UserPortfolioStats
} from '../../types/gamma'

const fetchGAMMAConfig = async (): Promise<GAMMAConfig | null> => {
  try {
    // const response = await apiClient(GAMMA_API_BASE).get(GAMMA_ENDPOINTS_V1.CONFIG)
    // return response.data
    return null
  } catch (error) {
    console.error('Error fetching GAMMA Config:', error)
    return null
  }
}

const fetchAggregateStats = async (): Promise<GAMMAProtocolStats | null> => {
  try {
    // const response = await apiClient(GAMMA_API_BASE).get(GAMMA_ENDPOINTS_V1.STATS)
    // return response.data
    return null
  } catch (error) {
    console.error('Error fetching aggregate stats:', error)
    return null
  }
}

const fetchAllPools = async (
  page: number,
  pageSize: number,
  poolType: 'all' | 'hyper' | 'primary' = 'all',
  sortConfig: 'asc' | 'desc',
  sortKey: string
): Promise<GAMMAPoolsResponse | null> => {
  try {
    const response = await customClient(GAMMA_API_BASE).get(
      GAMMA_ENDPOINTS_V1.POOLS_INFO_ALL +
        `?pageSize=${pageSize}&page=${page}&poolType=${poolType}&sortOrder=${sortConfig}&sortBy=${sortKey}`
    )
    return response.data
  } catch (error) {
    console.error('Error fetching gamma pools:', error)
    return null
  }
}

const fetchUser = async (publicKey: string): Promise<GAMMAUser | null> => {
  console.log(publicKey)
  try {
    // const response = await apiClient(GAMMA_API_BASE).get(`${GAMMA_ENDPOINTS_V1.USER}/${publicKey}`)
    // return response.data
    return null
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

const fetchPortfolioStats = async (userId: string): Promise<UserPortfolioStats | null> => {
  console.log(userId)
  try {
    // const response = await apiClient(GAMMA_API_BASE).get(`${GAMMA_ENDPOINTS_V1.PORTFOLIO_STATS}/${userId}`)
    // return response.data
    return null
  } catch (error) {
    console.error('Error fetching portfolio stats:', error)
    return null
  }
}

const fetchLpPositions = async (userId: string): Promise<UserPortfolioLPPosition[] | null> => {
  try {
    const response = await customClient(GAMMA_API_BASE).get(`${GAMMA_ENDPOINTS_V1.LP_POSITIONS}/${userId}`)
    console.log(response)
    
    return response.data.success ? response.data.data.accounts : []
  } catch (error) {
    console.error('Error fetching LP positions:', error)
    return null
  }
}

const fetchTokenList = async (page: number, pageSize: number): Promise<GAMMAListTokenResponse | null> => {
  try {
    const response = await customClient(GAMMA_API_BASE).get(
      GAMMA_ENDPOINTS_V1.TOKEN_LIST + `?pageSize=${pageSize}&page=${page}`
    )    
    return await response.data
  } catch (error) {
    console.log('Error fetching token list', error)
    return null
  }
}

export {
  fetchGAMMAConfig,
  fetchAggregateStats,
  fetchUser,
  fetchPortfolioStats,
  fetchLpPositions,
  fetchAllPools,
  fetchTokenList
}
