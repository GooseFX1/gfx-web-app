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

const apiClient = (base: string) => {
  return axios.create({
    baseURL: `https://${base}.${DOMAIN()}`,
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export const httpClient = (base: string) => {
  return axios.create({
    baseURL: `https://${base}.goosefx.io`,
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}
export const customClient = (customURL: string, collectionId?: number) => {
  let data = JSON.stringify({
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

export default apiClient
