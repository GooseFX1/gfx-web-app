import { NFT_LAUNCHPAD_API_ENDPOINTS } from './../NFTLaunchpad/constants'
import { getDateInISOFormat } from './../../utils/misc'
import { httpClient } from '../../api'
import { SSL_API_BASE, SSL_API_ENDPOINTS } from '../SSL/constants'
import axios from 'axios'

//const callProdAPI = true
export const fetchSSLAPR = async (tokenAddress: string, controller: string) => {
  try {
    const res = await httpClient(SSL_API_BASE).get(
      `${SSL_API_ENDPOINTS.APR}?controller=${controller}&mint=${tokenAddress}`
    )
    return res.data.apr7d
  } catch (err) {
    return err
  }
}

export const fetchSSLVolumeData = async (tokenAddress: string, controller: string) => {
  try {
    const res = await httpClient(SSL_API_BASE).get(
      `${SSL_API_ENDPOINTS.Volume}?controller=${controller}&mint=${tokenAddress}&interval=${SSL_API_ENDPOINTS.d7}`
    )
    return res.data
  } catch (err) {
    return err
  }
}

export const saveLiquidtyVolume = async (sslVolume: number, stakeVolume: number, liqObj: object) => {
  try {
    //const url = 'http://localhost:4000' + SSL_API_ENDPOINTS.SAVE_LIQUIDITY_DATA
    const url = NFT_LAUNCHPAD_API_ENDPOINTS.NFT_LAUNCHPAD_API_BASE + SSL_API_ENDPOINTS.SAVE_LIQUIDITY_DATA
    const dataToSend = JSON.stringify({
      date: getDateInISOFormat(),
      updatedTime: new Date().getTime(),
      aggregatedVolume: {
        sslVolume: sslVolume,
        stakeVolume: stakeVolume,
        totalVolume: sslVolume + stakeVolume
      },
      seprateVolume: liqObj
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
  } catch (e) {
    return {
      status: 'failed'
    }
  }
}

export const getVolumeApr = async (tokenList: string[], SSLTokenNames: string[], controllerStr: string) => {
  try {
    //const url = 'http://localhost:4000' + SSL_API_ENDPOINTS.GET_VOLUME_APR_DATA
    const url = NFT_LAUNCHPAD_API_ENDPOINTS.NFT_LAUNCHPAD_API_BASE + SSL_API_ENDPOINTS.GET_VOLUME_APR_DATA
    const dataToSend = JSON.stringify({
      tokens: tokenList,
      SSLTokenNames: SSLTokenNames,
      controllerStr: controllerStr
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
  } catch (e) {
    return {
      status: 'failed'
    }
  }
}
export const getFarmTokenPrices = async (cryptoMarkets: object) => {
  try {
    //const url = 'http://localhost:4000' + SSL_API_ENDPOINTS.GET_TOKEN_PRICES
    const url = NFT_LAUNCHPAD_API_ENDPOINTS.NFT_LAUNCHPAD_API_BASE + SSL_API_ENDPOINTS.GET_TOKEN_PRICES
    const dataToSend = JSON.stringify({
      cryptoMarkets: cryptoMarkets
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
  } catch (e) {
    return {
      status: 'failed'
    }
  }
}
