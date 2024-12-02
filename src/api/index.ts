import { ANALYTICS_ENDPOINTS, ANALYTICS_BASE } from './analytics/constants'
import axios from 'axios'
import * as https from 'node:https'
import { INTERVALS } from '@/utils/time'

const DOMAIN = () => {
  const sub =
    window.location.hostname.includes('staging') || process.env.NODE_ENV !== 'production'
      ? 'staging.'
      : window.location.hostname.includes('testing')
      ? 'testing.'
      : ''

  return `${sub}goosefx.io`
}

const createAxiosInstance = (config: unknown) => {
  const axiosInstance = axios.create(config)

  let abortController

  axiosInstance.interceptors.request.use(
    (config) => {
      // Cancel the previous request if it exists
      if (abortController) {
        abortController.abort('Operation canceled due to new request.')
      }

      // Create a new AbortController for the current request
      abortController = new AbortController()
      config.signal = abortController.signal // Attach the signal to the request config

      return config
    },
    (error) => {
      return Promise.reject(error)
    }
  )

  return axiosInstance
}

const agent = new https.Agent({
  maxSockets: 100
})

const axiosObject = createAxiosInstance({
  httpsAgent: agent
})

const apiClient = (base: string) =>
  createAxiosInstance({
    baseURL: `https://${base}.${DOMAIN()}`,
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json'
    }
  })

export const httpClient = (base: string) =>
  createAxiosInstance({
    baseURL: `https://${base}.goosefx.io`,
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json'
    }
  })

export const customClient = (url: string) => {
  return createAxiosInstance({
    baseURL: url,
    responseType: 'json',
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

export const axiosFetchWithRetries = async (
  input: string | URL | globalThis.Request,
  incomingInit?: RequestInit,
  retryAttempts = 3
): Promise<Response> => {
  let attempt = 0
  let init = incomingInit
  // Adding default headers
  if (!init || !init.headers) {
    init = {
      headers: {
        'Content-Type': 'application/json'
      },
      ...init
    }
  }

  while (attempt < retryAttempts) {
    try {
      let axiosHeaders = {}

      axiosHeaders = Array.from(new Headers(init.headers).entries()).reduce((acc, [key, value]) => {
        acc[key] = value
        return acc
      }, {})

      const axiosConfig = {
        data: init.body,
        headers: axiosHeaders,
        method: init.method,
        baseURL: input.toString(),
        validateStatus: () => true
      }

      const axiosResponse = await axiosObject.request(axiosConfig)

      const { data, status, statusText, headers } = axiosResponse

      // Mapping headers from axios to fetch format
      const headersArray: [string, string][] = Object.entries(headers).map(([key, value]) => [key, value])

      const fetchHeaders = new Headers(headersArray)

      const response = new Response(JSON.stringify(data), {
        status,
        statusText,
        headers: fetchHeaders
      })

      // Comment the above lines and uncomment the following one to switch from axios to fetch
      // const response = await fetch(input, init);

      // Traffic might get routed to backups or node restarts or if anything throws a 502, retry
      if (response.status === 502) {
        console.log('Retrying due to 502')

        attempt++

        // Backoff to avoid hammering the server
        await new Promise<void>((resolve) => setTimeout(resolve, 100 * attempt))

        continue
      }
      return Promise.resolve(response)
    } catch (e) {
      console.log(`Retrying due to error ${e}`, e)

      attempt++
      continue
    }
  }

  return Promise.reject('Max retries reached')
}

export default apiClient
