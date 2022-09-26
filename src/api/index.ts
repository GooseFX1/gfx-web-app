import { ANALYTICS_API_ENDPOINTS } from './analytics/constants'
import axios from 'axios'
import { NFT_LAUNCHPAD_API_ENDPOINTS } from './NFTLaunchpad'

const DOMAIN = () => {
  const sub =
    window.location.hostname.includes('staging') || process.env.NODE_ENV !== 'production'
      ? 'staging.'
      : window.location.hostname.includes('testing')
      ? 'testing.'
      : ''

  return `${sub}goosefx.io`
}

const apiClient = (base: string) =>
  axios.create({
    baseURL: `https://${base}.${DOMAIN()}`,
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json'
    }
  })

export const httpClient = (base: string) =>
  axios.create({
    baseURL: `https://${base}.goosefx.io`,
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json'
    }
  })

export const customClient = (customURL: string, collectionId?: number) => {
  const data = JSON.stringify({
    collectionId: collectionId
  })
  return axios.create({
    baseURL: customURL,
    responseType: 'json',
    data: data,
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const logData = async (event: string) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      const url = NFT_LAUNCHPAD_API_ENDPOINTS.NFT_LAUNCHPAD_API_BASE + ANALYTICS_API_ENDPOINTS.LOG_DATA
      const dataToSend = JSON.stringify({
        event: event
      })
      const response = await axios({
        method: 'POST',
        url: url,
        data: dataToSend,
        headers: {
          'Content-Type': 'application/json'
        }
      })
      return response.data
    }
    return null
  } catch (e) {
    return {
      status: 'failed'
    }
  }
}

export default apiClient
