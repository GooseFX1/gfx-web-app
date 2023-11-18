import axios from 'axios'
import { httpClient } from '../'
import { ANALYTICS_ENDPOINTS, ANALYTICS_BASE, ANALYTICS_SUBDOMAIN } from './constants'
import { SOLSCAN_BASE } from '../../constants'

export const logData = async (event: string): Promise<any> => {
  try {
    if (process.env.NODE_ENV === 'production') {
      const url = `${ANALYTICS_BASE}${ANALYTICS_ENDPOINTS.LOG_DATA}`
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

export const getGofxHolders = async (): Promise<any> => {
  try {
    const res = await axios(
      `${SOLSCAN_BASE}/token${ANALYTICS_ENDPOINTS.META_DATA}${ANALYTICS_ENDPOINTS.GOFX_TOKEN}`
    )
    return res.data
  } catch (err) {
    return err
  }
}

export const getTotalLiquidityVolume = async (): Promise<any> => {
  try {
    const { data } = await httpClient(ANALYTICS_SUBDOMAIN).get(ANALYTICS_ENDPOINTS.GET_LIQUIDITY)
    return data
  } catch (err) {
    return err
  }
}

export const getWorkingRPCEndpoints = async (): Promise<any> => {
  try {
    const { data } = await httpClient(ANALYTICS_SUBDOMAIN).get(ANALYTICS_ENDPOINTS.GET_WORKING_RPC_ENDPOINT)
    return data
  } catch (err) {
    return err
  }
}

export const getTokenDetails = async (): Promise<any> => {
  try {
    const { data } = await axios.get(
      `https://pro-api.solscan.io/v1.0/wallet/info/${ANALYTICS_ENDPOINTS.GFX_WALLET}`
    )
    return data
  } catch (err) {
    return err
  }
}

export const getSOLPrice = async (): Promise<any> => {
  try {
    const { data } = await axios.get(`https://api.solscan.io/market?symbol=SOL&cluster=`)
    return data.data.priceUsdt
  } catch (err) {
    return err
  }
}

export const fetchBrowserCountryCode = async (): Promise<null | string> => {
  try {
    const resp = await axios.get(`https://geocode.goosefx.workers.dev`)
    const country = resp.data.results[0].components.country_code
    return country.toUpperCase()
  } catch (error) {
    console.error(error)
    return null
  }
}
