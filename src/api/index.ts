import { ANALYTICS_ENDPOINTS, ANALYTICS_BASE } from './analytics/constants'
import axios from 'axios'

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

export const customClient = (url: string) => {
  return axios.create({
    baseURL: url,
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export default apiClient
