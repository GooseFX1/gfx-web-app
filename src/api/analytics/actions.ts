import { NFT_LAUNCHPAD_API_ENDPOINTS } from './../NFTLaunchpad/constants'
import axios from 'axios'
import { ANALYTICS_API_ENDPOINTS, SOLSCAN_BASE } from './constants'

export const getGofxHolders = async (): Promise<any> => {
  try {
    const res = await axios(
      `${SOLSCAN_BASE}${ANALYTICS_API_ENDPOINTS.META_DATA}${ANALYTICS_API_ENDPOINTS.GOFX_TOKEN}`
    )
    return res.data
  } catch (err) {
    return err
  }
}

export const getTotalLiquidityVolume = async (): Promise<any> => {
  try {
    const { data } = await axios(
      `${NFT_LAUNCHPAD_API_ENDPOINTS.NFT_LAUNCHPAD_API_BASE}${ANALYTICS_API_ENDPOINTS.GET_LIQUIDITY}`
      //`${'http://localhost:4000'}${ANALYTICS_API_ENDPOINTS.GET_LIQUIDITY}`
    )
    return data
  } catch (err) {
    return err
  }
}

export const getWorkingRPCEndpoints = async (): Promise<any> => {
  try {
    const { data } = await axios(
      `${NFT_LAUNCHPAD_API_ENDPOINTS.NFT_LAUNCHPAD_API_BASE}${ANALYTICS_API_ENDPOINTS.GET_WORKING_RPC_ENDPOINT}`
      // `${'http://localhost:4000'}${ANALYTICS_API_ENDPOINTS.GET_WORKING_RPC_ENDPOINT}`
    )
    return data
  } catch (err) {
    return err
  }
}
