import { CONTROLLER_KEY } from './../../web3/stake'
import { httpClient } from '../../api'
import { SSL_API_BASE, SSL_API_ENDPOINTS } from '../SSL/constants'
const controllerKey = CONTROLLER_KEY.toString()

const callProdAPI = true
export const fetchSSLAPR = async (tokenAddress: string) => {
  try {
    const res = await httpClient(SSL_API_BASE).get(
      `${SSL_API_ENDPOINTS.APR}?controller=${controllerKey}&mint=${tokenAddress}`
    )
    return res.data.apr7d
  } catch (err) {
    return err
  }
}

export const fetchSSLVolumeData = async (tokenAddress: string) => {
  try {
    const res = await httpClient(SSL_API_BASE).get(
      `${SSL_API_ENDPOINTS.Volume}?controller=${controllerKey}&mint=${tokenAddress}&interval=${SSL_API_ENDPOINTS.d7}`
    )
    return res.data
  } catch (err) {
    return err
  }
}
