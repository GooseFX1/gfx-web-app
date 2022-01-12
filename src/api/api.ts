import axios from 'axios'

export const API_BASE_URL = `https://${
  process.env.NODE_ENV === 'production' ? 'nest-api' : 'nest-api.staging'
}.goosefx.io`

export enum NFT_MARKET_API {
  SESSION_USER = '/user',
  USER_ACTIVITY = '/user-activity',
  ALL_COLLECTIONS = '/all-collections',
  FEATURED_COLLECTIONS = '/featured-collections',
  UPCOMING_COLLECTIONS = '/upcoming-collections',
  SINGLE_COLLECTION = '/collection',
  OPEN_BID = '/open-bid',
  FIXED_PRICE = '/fixed-price',
  SINGLE_NFT = '/nft',
  BID = '/bid',
  ASK = '/ask'
}

const apiClient = () => {
  return axios.create({
    baseURL: API_BASE_URL,
    responseType: 'json'
  })
}

export default apiClient
