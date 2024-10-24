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
import { fetchBrowserCountryCode } from '../api/analytics'
import { fetchIsUnderMaintenance } from '../api/config'
import { ENVS } from '../constants'
import useActivityTracker from '@/hooks/useActivityTracker'
import { axiosFetchWithRetries } from '../api'
import { INTERVALS } from '@/utils/time'
import { USER_CONFIG_CACHE } from '@/types/app_params'


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
  endpoint: 'https://yearling-adorne-fast-mainnet.helius-rpc.com/', // fallback for first set
  network: WalletAdapterNetwork.Mainnet
}
export const RPCs = {
  QuickNode: APP_RPC,
  Helius: HELIUS_RPC,
  Custom: CUSTOM_RPC
}

interface ISettingsConfig {
  chainId: ENV
  connection: Connection
  perpsConnection: Connection
  endpoint?: string | null
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
  userCache: USER_CONFIG_CACHE
  setUserCache: (cache: USER_CONFIG_CACHE) => void
  updateUserCache: (cache: Partial<USER_CONFIG_CACHE>) => void
}

const SettingsContext = React.createContext<ISettingsConfig | null>(null)

function newCache(): USER_CONFIG_CACHE {
  return {
    hasDexOnboarded: false,
    farm: {
      hasFarmOnboarded: false,
      showDepositedFilter: false
    },
    gamma: {
      hasGAMMAOnboarded: false,
      showDepositedFilter: false,
      showCreatedFilter: false,
      docsBanner: true,
      currentSort: '1'
    },
    hasSignedTC: false,
    endpointName: 'QuickNode',
    endpoint: null,
    priorityFee: 'Default'
  } as USER_CONFIG_CACHE
}

export function resetUserCache(): void {
  window.localStorage.setItem('gfx-user-cache', JSON.stringify(newCache()))
}

function shouldMatchOpCache(key: string) {
  switch (key) {
    case 'endpoint':
      return false
    default:
      return true
  }
}

function migrateCache(cache: USER_CONFIG_CACHE): USER_CONFIG_CACHE {
  const migratedCache = structuredClone(cache)
  const opCache = newCache()
  for (const key in opCache) {
    if (!(key in migratedCache) || (typeof migratedCache[key] !== typeof opCache[key] && shouldMatchOpCache(key))) {
      console.log('MIGRATING CACHE KEY', key, {
        inMigrated: (key in migratedCache),
        typeMatch: typeof migratedCache[key] !== typeof opCache[key]
      })
      migratedCache[key] = opCache[key]
    }
  }
  for (const key in migratedCache) {
    if (!(key in opCache)) {
      delete migratedCache[key]
    }
  }

  if (JSON.stringify(migratedCache) !== JSON.stringify(cache)) {
    window.localStorage.setItem(USER_CACHE, JSON.stringify(migratedCache))
  }
  return migratedCache
}

export function getOrCreateCache(): USER_CONFIG_CACHE {
  const rawCache = window.localStorage.getItem('gfx-user-cache')
  if (rawCache) {
    try {
      const cache = JSON.parse(rawCache) as USER_CONFIG_CACHE
      return migrateCache(cache)
    } catch (e) {
      console.error('Error parsing user cache', e)
    }
  }
  const cache = newCache()
  localStorage.setItem(USER_CACHE, JSON.stringify(cache))
  return cache
}

export function validateUserCache(cache?: USER_CONFIG_CACHE): boolean {
  const validCache = cache ?? getOrCreateCache()
  const validCacheKeys = Object.keys(validCache)
  const emptyValidCache = newCache()
  for (const key of validCacheKeys) {
    if (!(key in emptyValidCache)) {
      return false
    }
    if (typeof validCache[key] !== typeof emptyValidCache[key]) {
      return false
    }
  }
  return true
}

export function useSlippageConfig(): {
  slippage: number
  setSlippage: React.Dispatch<React.SetStateAction<number>>
} {
  const context = useContext(SettingsContext)

  const { slippage, setSlippage } = context
  return { slippage, setSlippage }
}

export function useConnectionConfig(): ISettingsConfig {
  const context = useContext(SettingsContext)

  return context
}

export type PriorityFeeName = 'Default' | 'Fast' | 'Turbo'
export const USER_CACHE = 'gfx-user-cache' as const

export const SettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [slippage, setSlippage] = useState<number>(DEFAULT_SLIPPAGE)
  const [blacklisted, setBlacklisted] = useState<boolean>(false)
  const [isUnderMaintenance, setIsUnderMaintenance] = useState<boolean>(false)
  const [userCache, setUserCache] = useState<USER_CONFIG_CACHE>(getOrCreateCache())
  const [endpointName, setEndpointName] = useState<EndPointName>(userCache.endpointName || 'QuickNode')
  const [priorityFee, setPriorityFee] = useState<PriorityFeeName>(userCache.priorityFee || 'Default')
  const [latency, setLatency] = useState<number>(0)
  const [shouldTrack, setShouldTrack] = useState<boolean>(true)
  const setCache = useCallback((cache: USER_CONFIG_CACHE) => {
    setUserCache(cache)
  }, [])
  const [cacheUpdateQueue, setCacheUpdateQueue] = useState<Partial<USER_CONFIG_CACHE>>({})

  const updateUserCache = useCallback((cache: Partial<USER_CONFIG_CACHE>) => {
    // predicts multiple sets to prevent race condition overwriting sets instead takes latest and merges
    setCacheUpdateQueue((prevCache) => ({ ...prevCache, ...cache }))
  }, [])

  useEffect(() => {
    if (Object.keys(cacheUpdateQueue).length === 0) return
    const timeout = setTimeout(() => {
      setUserCache((prevCache) => {
        const newCache = {
          ...prevCache,
          ...cacheUpdateQueue
        }
        if (newCache.endpointName !== 'Custom' && newCache.endpoint !== null) {
          newCache.endpoint = null
        }
        window.localStorage.setItem(USER_CACHE, JSON.stringify(newCache))
        return newCache
      })
      setCacheUpdateQueue({})
    }, 500)
    return () => {
      clearTimeout(timeout)
    }
  }, [cacheUpdateQueue])

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

  const chainId = useMemo(() => RPCs[endpointName ?? 'QuickNode'].chainId, [endpointName])
  const network = useMemo(() => RPCs[endpointName ?? 'QuickNode'].network, [endpointName])
  const endpoint = useMemo(
    () => (userCache.endpoint !== null ? userCache.endpoint : RPCs[endpointName].endpoint),
    [endpointName, userCache]
  )

  useEffect(
    () => {
      const payload: Partial<USER_CONFIG_CACHE> = {}
      // WHY?! -_- .. need smarter way to handle this
      if (endpoint !== userCache.endpoint) {
        payload.endpoint = endpoint
      }
      if (endpointName !== userCache.endpointName) {
        payload.endpointName = endpointName
      }
      if (priorityFee !== userCache.priorityFee) {
        payload.priorityFee = priorityFee
      }
      if (Object.keys(payload).length > 0) {
        updateUserCache(payload)
      }
    },
    [priorityFee, endpointName, endpoint]
  )

  const { connection, perpsConnection } = useMemo(() => {
    const perpsConnection = new Connection(endpoint, {
      async fetch(input, init?) {
        return await axiosFetchWithRetries(input, init)
      },
      commitment: 'processed'
    })
    // creates connection - temp ws url
    const connection = new Connection(endpoint, {
      async fetch(input, init?) {
        return await axiosFetchWithRetries(input, init)
      },
      commitment: 'processed'
    })
    return { connection, perpsConnection }
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
  const callbackOff = useCallback(() => setShouldTrack(false), [])
  const callbackOn = useCallback(() => {
    setShouldTrack(true)
    getAndSetLatency
  }, [])
  useActivityTracker({
    callbackOff: callbackOff,
    callbackOn: callbackOn
  })
  useEffect(() => {
    if (endpointName === null) {
      setEndpointName(
        userCache.endpointName === null || userCache.endpoint === null
          ? RPCs[endpointName].name
          : 'Custom'
      )
    }
  }, [userCache])

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
        priorityFeeValue,
        userCache,
        setUserCache: setCache,
        updateUserCache
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
