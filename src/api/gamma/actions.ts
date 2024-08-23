// import apiClient from '../index'
import { 
    // GAMMA_API_BASE, 
    // GAMMA_ENDPOINTS_V1, 
    GAMMA_TOKENS 
} from './constants'
import {
  GAMMAConfig,
  GAMMAProtocolStats,
//   GAMMAPool,
  GAMMAUser,
  UserPortfolioStats,
  UserPortfolioLPPosition
} from '../../types/gamma'

const fetchGAMMAConfig = async (): Promise<GAMMAConfig | null> => {
  try {
    // const response = await apiClient(GAMMA_API_BASE).get(GAMMA_ENDPOINTS_V1.CONFIG)
    // return response.data
    return {}
  } catch (error) {
    console.error('Error fetching GAMMA Config:', error)
    return null
  }
}

const fetchAggregateStats = async (): Promise<GAMMAProtocolStats | null> => {
  try {
    // const response = await apiClient(GAMMA_API_BASE).get(GAMMA_ENDPOINTS_V1.STATS)
    // return response.data
    return {}
  } catch (error) {
    console.error('Error fetching aggregate stats:', error)
    return null
  }
}

const fetchPools = async (): Promise<any[] | null> => {
  try {
    // const response = await apiClient(GAMMA_API_BASE).get(GAMMA_ENDPOINTS_V1.POOLS)
    // return response.data
    return GAMMA_TOKENS
  } catch (error) {
    console.error('Error fetching pools:', error)
    return null
  }
}

const fetchUser = async (publicKey: string): Promise<GAMMAUser | null> => {
  try {
    // const response = await apiClient(GAMMA_API_BASE).get(`${GAMMA_ENDPOINTS_V1.USER}/${publicKey}`)
    // return response.data
    return publicKey
  } catch (error) {
    console.error('Error fetching user:', error)
    return null
  }
}

const fetchPortfolioStats = async (userId: string): Promise<UserPortfolioStats | null> => {
  try {
    // const response = await apiClient(GAMMA_API_BASE).get(`${GAMMA_ENDPOINTS_V1.PORTFOLIO_STATS}/${userId}`)
    // return response.data
    return userId
  } catch (error) {
    console.error('Error fetching portfolio stats:', error)
    return null
  }
}

const fetchLpPositions = async (userId: string): Promise<UserPortfolioLPPosition[] | null> => {
  try {
    // const response = await apiClient(GAMMA_API_BASE).get(`${GAMMA_ENDPOINTS_V1.LP_POSITIONS}/${userId}`)
    // return response.data
    return userId
  } catch (error) {
    console.error('Error fetching LP positions:', error)
    return null
  }
}

export { fetchGAMMAConfig, fetchAggregateStats, fetchPools, fetchUser, fetchPortfolioStats, fetchLpPositions }
