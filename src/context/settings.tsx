import React, {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from 'react'
import { ENV } from '@solana/spl-token-registry'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { ComputeBudgetProgram, Connection, TransactionInstruction } from '@solana/web3.js'
import { USER_CONFIG_CACHE } from '../types/app_params'
import { fetchBrowserCountryCode } from '../api/analytics'
import { fetchIsUnderMaintenance } from '../api/config'
import { ENVS } from '../constants'
import useActivityTracker from '@/hooks/useActivityTracker'
import { INTERVALS } from '@/utils/time'
import axios from 'axios'
import * as https from 'node:https'

const RETRY_ATTEMPTS = 3

const agent = new https.Agent({
  maxSockets: 100
})

const axiosObject = axios.create({
  httpsAgent: agent
})

export async function axiosFetchWithRetries(
  input: string | URL | globalThis.Request,
  incomingInit?: RequestInit,
  retryAttempts = 0
): Promise<Response> {
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

const countries = [
  { code: 'BY', name: 'Belarus' },
  { code: 'CA', name: 'Canada' },
  { code: 'CF', name: 'Central African Republic' },
  { code: 'CD', name: 'Congo, Democratic Republic of the' },
  { code: 'KP', name: 'North Korea' },
  { code: 'CU', name: 'Cuba' },
  { code: 'IR', name: 'Iran' },
  { code: 'LY', name: 'Lybia' },
  { code: 'RU', name: 'Russia' },
  { code: 'SO', name: 'Somalia' },
  { code: 'SS', name: 'South Sudan' },
  { code: 'SD', name: 'Sudan' },
  { code: 'SY', name: 'Syrian Arab Republic' },
  { code: 'US', name: 'United States of America' },
  { code: 'YE', name: 'Yemen' },
  { code: 'ZW', name: 'Zimbabwe' }
]
const banned_countries = countries.map((c) => c.code)

export const DEFAULT_SLIPPAGE = 0.005
export type EndPointName = 'Custom' | 'QuickNode' | 'Helius'

export type RPC = {
  chainId: ENV
  name: EndPointName
  endpoint: string
  network: WalletAdapterNetwork
}

export const APP_RPC: RPC = {
  chainId: ENV.MainnetBeta,
  name: 'QuickNode',
  endpoint: `https://rpc-proxy.goosefx.workers.dev`,
  network: WalletAdapterNetwork.Mainnet
}
export const HELIUS_RPC: RPC = {
  chainId: ENV.MainnetBeta,
  name: 'Helius',
  endpoint: `https://yearling-adorne-fast-mainnet.helius-rpc.com/`,
  network: WalletAdapterNetwork.Mainnet
}
const CUSTOM_RPC: RPC = {
  chainId: ENV.MainnetBeta,
  name: 'Custom',
  endpoint: '',
  network: WalletAdapterNetwork.Mainnet
}
export const RPCs = {
  QuickNode: APP_RPC,
  Helius: HELIUS_RPC,
  Custom: CUSTOM_RPC
}

type IRPC_CACHE = null | USER_CONFIG_CACHE

interface ISettingsConfig {
  chainId: ENV
  connection: Connection
  perpsConnection: Connection
  endpoint: string
  endpointName: EndPointName
  network: WalletAdapterNetwork
  setEndpointName: Dispatch<SetStateAction<EndPointName>>
  blacklisted: boolean
  isUnderMaintenance: boolean
  setSlippage?: Dispatch<SetStateAction<number>>
  slippage?: number
  priorityFee?: PriorityFeeName
  priorityFeeInstruction?: TransactionInstruction
  setPriorityFee?: Dispatch<SetStateAction<PriorityFeeName>>
  latency: number
  priorityFeeValue: number
}

const SettingsContext = React.createContext<ISettingsConfig | null>(null)

export function useSlippageConfig(): {
  slippage: number
  setSlippage: React.Dispatch<React.SetStateAction<number>>
} {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('Missing settings context')
  }

  const { slippage, setSlippage } = context
  return { slippage, setSlippage }
}

export function useConnectionConfig(): ISettingsConfig {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('Missing settings context')
  }

  return context
}

export type PriorityFeeName = 'Default' | 'Fast' | 'Turbo'
export const USER_CACHE = 'gfx-user-cache' as const
export const SettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [slippage, setSlippage] = useState<number>(DEFAULT_SLIPPAGE)
  const [blacklisted, setBlacklisted] = useState<boolean>(false)
  const [isUnderMaintenance, setIsUnderMaintenance] = useState<boolean>(false)
  const existingUserCache: IRPC_CACHE = JSON.parse(window.localStorage.getItem('gfx-user-cache'))
  const [endpointName, setEndpointName] = useState<EndPointName>(existingUserCache.endpointName || 'QuickNode')
  const [priorityFee, setPriorityFee] = useState<PriorityFeeName>(existingUserCache.priorityFee || 'Default')
  const [latency, setLatency] = useState<number>(0)
  const [shouldTrack, setShouldTrack] = useState<boolean>(true)

  const { priorityFeeInstruction, priorityFeeValue } = useMemo(() => {
    let fee = 0.0
    switch (priorityFee) {
      case 'Fast':
        fee = 40000
        break
      case 'Turbo':
        fee = 50000
        break
    }
    return {
      priorityFeeInstruction: ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: fee
      }),
      priorityFeeValue: fee
    }
  }, [priorityFee])
  const curEnv: string = useMemo(() => {
    const host = window.location.hostname
    if (host.includes(ENVS.STAGING)) {
      return ENVS.STAGING
    } else if (process.env.NODE_ENV === ENVS.PROD) {
      return ENVS.PROD
    } else {
      return ENVS.DEV
    }
  }, [])

  const chainId = useMemo(() => RPCs[endpointName].chainId, [endpointName])
  const network = useMemo(() => RPCs[endpointName].network, [endpointName])

  const endpoint = useMemo(() => {
    if (existingUserCache.endpoint !== null) {
      return existingUserCache.endpoint
    } else {
      // asserts 'Custom' is cached with a null enpoint value - results in default reset
      if (endpointName === 'Custom') {
        setEndpointName(RPCs[endpointName].name)
        return RPCs[endpointName].endpoint
      } else {
        return RPCs[endpointName].endpoint
      }
    }
  }, [endpointName])
  useEffect(
    () =>
      window.localStorage.setItem(
        USER_CACHE,
        JSON.stringify({
          ...existingUserCache,
          endpointName: endpointName,
          endpoint: existingUserCache.endpointName === 'Custom' ? endpoint : null,
          priorityFee: priorityFee
        })
      ),
    [priorityFee, endpointName, endpoint]
  )
  const perpsConnection = useMemo(() => {
    // sets rpc info to cache
    window.localStorage.setItem(
      USER_CACHE,
      JSON.stringify({
        ...existingUserCache,
        endpointName: endpointName,
        endpoint: existingUserCache.endpointName === 'Custom' ? endpoint : null
      })
    )

    // creates connection - temp ws url
    return new Connection(endpoint, {
      async fetch(input, init?) {
        return await axiosFetchWithRetries(input, init, RETRY_ATTEMPTS)
      },
      commitment: 'processed'
    })
  }, [endpointName, endpoint])

  const connection = useMemo(() => {
    // sets rpc info to cache
    window.localStorage.setItem(
      USER_CACHE,
      JSON.stringify({
        ...existingUserCache,
        endpointName: endpointName,
        endpoint: existingUserCache.endpointName === 'Custom' ? endpoint : null,
        priorityFee: priorityFee
      })
    )

    // creates connection - temp ws url
    return new Connection(endpoint, {
      async fetch(input, init?) {
        return await axiosFetchWithRetries(input, init, RETRY_ATTEMPTS)
      },
      commitment: 'confirmed'
    })
  }, [endpointName, endpoint])

  const getAndSetLatency = useCallback(async () => {
    const start = Date.now()
    await connection.getLatestBlockhashAndContext({
      commitment: 'confirmed'
    })
    const end = Date.now()
    const speedMs = end - start
    setLatency(speedMs)
  }, [connection])
  useEffect(() => {
    let timer: NodeJS.Timeout
    getAndSetLatency()
    if (shouldTrack) {
      timer = setInterval(async () => {
        getAndSetLatency()
      }, INTERVALS.SECOND * 30)
    }
    return () => clearInterval(timer)
  }, [shouldTrack, getAndSetLatency, endpoint, connection, endpointName])
  useActivityTracker({
    callbackOff: () => setShouldTrack(false),
    callbackOn: () => {
      setShouldTrack(true)
      getAndSetLatency()
    }
  })
  useEffect(() => {
    if (endpointName === null) {
      setEndpointName(
        existingUserCache.endpointName === null || existingUserCache.endpoint === null
          ? RPCs[endpointName].name
          : 'Custom'
      )
    }
  }, [])

  useEffect(() => {
    if (curEnv === ENVS.PROD) {
      // sets geo country code
      fetchBrowserCountryCode().then((countryCode: null | string) => {
        if (countryCode) {
          setBlacklisted(banned_countries.includes(countryCode))
        }
      })

      // sets isUnderMaintenance flag
      fetchIsUnderMaintenance().then((maintenanceStatus: boolean) => setIsUnderMaintenance(maintenanceStatus))
    }
  }, [])

  return (
    <SettingsContext.Provider
      value={{
        chainId,
        connection,
        endpoint,
        network,
        endpointName,
        setEndpointName,
        setSlippage: (val: number) => setSlippage(val),
        slippage: slippage,
        perpsConnection,
        blacklisted,
        isUnderMaintenance,
        priorityFee,
        setPriorityFee,
        priorityFeeInstruction,
        latency,
        priorityFeeValue
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
