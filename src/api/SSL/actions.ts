import { ADDRESSES } from './../../web3/ids'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { httpClient } from '../../api'
import { SSL_API_BASE, SSL_API_ENDPOINTS } from '../SSL/constants'

const callProdAPI = true
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
