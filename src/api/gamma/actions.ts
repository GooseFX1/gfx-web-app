// import apiClient from '../index'
import {
  GAMMAConfig,
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

// const fetchPools = async (): Promise<any[] | null> => {
//   try {
//     // const response = await apiClient(GAMMA_API_BASE).get(GAMMA_ENDPOINTS_V1.POOLS)
//     // return response.data
//     return GAMMA_TOKENS
//   } catch (error) {
//     console.error('Error fetching pools:', error)
//     return null
//   }
// }

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
  console.log(userId)
  try {
    // const response = await apiClient(GAMMA_API_BASE).get(`${GAMMA_ENDPOINTS_V1.LP_POSITIONS}/${userId}`)
    // return response.data
    return null
  } catch (error) {
    console.error('Error fetching LP positions:', error)
    return null
  }
}

export { fetchGAMMAConfig, fetchAggregateStats, fetchUser, fetchPortfolioStats, fetchLpPositions }
