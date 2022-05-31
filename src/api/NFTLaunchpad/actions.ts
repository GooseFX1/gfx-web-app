import { customClient } from '../../api'
import apiClient from '../../api'
import { NFT_LAUNCHPAD_API_ENDPOINTS, NFT_LAUNCHPAD_API_BASE } from '../NFTLaunchpad/constants'

const BASE_URL = 'https://ca45-103-108-117-198.ngrok.io'

export const fetchAllNFTLaunchpadData = async () => {
  try {
    const res = await customClient(BASE_URL).get(`${NFT_LAUNCHPAD_API_ENDPOINTS.GET_ALL_LAUNCHES}`)
    return res
  } catch (err) {
    return err
  }
}
export const fetchSelectedNFTLPData = async () => {
  try {
    const res = await customClient(BASE_URL).post(`${NFT_LAUNCHPAD_API_ENDPOINTS.GET_SELECTED_LAUNCH}`)
  } catch (err) {
    return err
  }
}
