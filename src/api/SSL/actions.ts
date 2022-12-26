import { NFT_LAUNCHPAD_API_ENDPOINTS } from './../NFTLaunchpad/constants'
import { getDateInISOFormat } from './../../utils/misc'
import { httpClient } from '../../api'
import { SSL_API_BASE, SSL_API_ENDPOINTS } from '../SSL/constants'
import axios from 'axios'
import { PublicKey } from '@solana/web3.js'

export type VolumeAprRecord = Record<string, VolumeApr>

export type VolumeApr = {
  volume: number
  apr: number
}

export type SSLRes = {
  apr7d: number
  apy7d: number
}

export const fetchSSLAPR = async (tokenAddress: string, controller: string): Promise<number> => {
  try {
    const res = await httpClient(SSL_API_BASE).get(
      `${SSL_API_ENDPOINTS.APR}?controller=${controller}&mint=${tokenAddress}`
    )

    const body: SSLRes = res.data
    return body.apr7d
  } catch (err) {
    return err
  }
}

export type VolumeRes = {
  volume: number
}

export const fetchSSLVolumeData = async (tokenAddress: string, controller: string): Promise<number> => {
  try {
    const res = await httpClient(SSL_API_BASE).get(
      `${SSL_API_ENDPOINTS.Volume}?controller=${controller}&mint=${tokenAddress}&interval=${SSL_API_ENDPOINTS.d7}`
    )
    const body: VolumeRes = res.data
    return body.volume
  } catch (err) {
    return err
  }
}

export type TotalVolumeRes = {
  totalVolumeTrade: number
  totalVolumeTradeDay: number
  totalVolumeTradeWeek: number
  totalVolumeTradeMonth: number
}

export const fetchTotalVolumeTrade = async (): Promise<TotalVolumeRes> => {
  try {
    const res = await axios.get(
      `${NFT_LAUNCHPAD_API_ENDPOINTS.NFT_LAUNCHPAD_API_BASE}${SSL_API_ENDPOINTS.TOTAL_VOLUME_TRADE}`
    )
    // const res = await axios.get('http://localhost:4000' + SSL_API_ENDPOINTS.TOTAL_VOLUME_TRADE)
    return res.data.data
  } catch (err) {
    return err
  }
}

export const fetchTotalVolumeTradeChart = async (walletAddress: PublicKey): Promise<any> => {
  try {
    const res = await axios.get(
      NFT_LAUNCHPAD_API_ENDPOINTS.NFT_LAUNCHPAD_API_BASE +
        SSL_API_ENDPOINTS.TOTAL_VOLUME_TRADE_CHART +
        '?wallet=' +
        walletAddress
    )
    // const res = await axios.get(
    //   'http://localhost:4000' + SSL_API_ENDPOINTS.TOTAL_VOLUME_TRADE_CHART + '?wallet=' + walletAddress
    // )
    return res.data
  } catch (err) {
    return err
  }
}

export const saveLiquidityVolume = async (
  sslVolume: number,
  stakeVolume: number,
  liqObj: Record<string, number>
): Promise<unknown> => {
  try {
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
    await axios({
      method: 'POST',
      url: url,
      data: dataToSend,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (e) {
    return {
      status: 'failed'
    }
  }
}

export const getVolumeApr = async (
  tokenList: string[],
  SSLTokenNames: string[],
  controllerStr: string
): Promise<VolumeAprRecord> => {
  try {
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
    return response.data.data
  } catch (e) {
    console.error(e)
    return {}
  }
}

export const getFarmTokenPrices = async (): Promise<any> => {
  try {
    const url = NFT_LAUNCHPAD_API_ENDPOINTS.NFT_LAUNCHPAD_API_BASE + SSL_API_ENDPOINTS.GET_TOKEN_PRICES
    const dataToSend = JSON.stringify({})
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
