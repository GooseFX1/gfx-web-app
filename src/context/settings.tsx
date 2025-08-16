import React, {
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState
} from 'react'
import { ENV } from '@solana/spl-token-registry'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  ComputeBudgetProgram,
  Connection,
  Transaction,
  TransactionInstruction,
  VersionedTransaction
} from '@solana/web3.js'
import { fetchBrowserCountryCode } from '../api/analytics'
import { fetchIsUnderMaintenance, fetchGammaBoostedRewards } from '../api/config'
import { ENVS } from '../constants'
import { axiosFetchWithRetries } from '../api'
import { INTERVALS } from '@/utils/time'
import { USER_CONFIG_CACHE } from '@/types/app_params'
import bs58 from 'bs58'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/queries/query.helper'
import { GAMMA_MAIN_SORT_CONFIG_DEFAULT } from '@/pages/FarmV4/constants'

const countries = [
  { code: 'BY', name: 'Belarus' },
  // { code: 'CA', name: 'Canada' },
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
  // { code: 'US', name: 'United States of America' },
  { code: 'YE', name: 'Yemen' },
  { code: 'ZW', name: 'Zimbabwe' }
]
const banned_countries = countries.map((c) => c.code)

export const DEFAULT_SLIPPAGE = 0.005
export const DEFAULT_ENDPOINT_NAME = 'Helius'
export type EndPointName = 'Custom' | 'Helius'

export type RPC = {
  chainId: ENV
  name: EndPointName
  endpoint: string
  network: WalletAdapterNetwork
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
  Helius: HELIUS_RPC,
  Custom: CUSTOM_RPC
}

type FeatureFlags = {
  tokenFeed: boolean
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
  gammaBoostedRewardsIsActive: boolean
  setTermsOfServiceVisible: Dispatch<SetStateAction<boolean>>
  termsOfServiceVisible: boolean
  featureFlags: FeatureFlags
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
      currentSort: GAMMA_MAIN_SORT_CONFIG_DEFAULT,
      viewMode: 'row',
      jtoRewardsBanner: true
    },
    tokenFeed: {
      enabledColumns: {
        social: true,
        new: true,
        migrated: true
      },
      quickBuyAmount: undefined,
      quickBuyToken: 'So11111111111111111111111111111111111111112',
      columnFilters: {
        new: {
          age: {
            min: undefined,
            max: undefined
          },
          holders: {
            min: undefined,
            max: undefined
          },
          topHolders: {
            min: undefined,
            max: undefined
          },
          bondingCurveProgress: {
            min: undefined,
            max: undefined
          },
          marketCap: {
            min: undefined,
            max: undefined
          },
          volume: {
            min: undefined,
            max: undefined
          },
          enabledSocials: {
            x: true,
            website: true,
            telegram: true
          }
        },
        migrated: {
          age: {
            min: undefined,
            max: undefined
          },
          holders: {
            min: undefined,
            max: undefined
          },
          topHolders: {
            min: undefined,
            max: undefined
          },
          bondingCurveProgress: {
            min: undefined,
            max: undefined
          },
          marketCap: {
            min: undefined,
            max: undefined
          },
          volume: {
            min: undefined,
            max: undefined
          },
          enabledSocials: {
            x: true,
            website: true,
            telegram: true
          }
        },
        soon: {
          age: {
            min: undefined,
            max: undefined
          },
          holders: {
            min: undefined,
            max: undefined
          },
          topHolders: {
            min: undefined,
            max: undefined
          },
          bondingCurveProgress: {
            min: undefined,
            max: undefined
          },
          marketCap: {
            min: undefined,
            max: undefined
          },
          volume: {
            min: undefined,
            max: undefined
          },
          enabledSocials: {
            x: true,
            website: true,
            telegram: true
          }
        }
      },
      socialPanelTab: 'social',
      mobileSelectedColumn: 'new'
    },
    hasSignedTC: false,
    endpointName: DEFAULT_ENDPOINT_NAME,
    endpoint: null,
    priorityFee: 'Default',
    swap: {
      slippage: 1.0
    }
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
    if (
      !(key in migratedCache) ||
      (typeof migratedCache[key] !== typeof opCache[key] && shouldMatchOpCache(key))
    ) {
      console.log('MIGRATING CACHE KEY', key, {
        inMigrated: key in migratedCache,
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
  const [gammaBoostedRewardsIsActive, setGammaBoostedRewardsIsActive] = useState<boolean>(true)
  const [userCache, setUserCache] = useState<USER_CONFIG_CACHE>(getOrCreateCache())
  const [termsOfServiceVisible, setTermsOfServiceVisible] = useState<boolean>(false)
  const [featureFlags, setFeatureFlags] = useState<FeatureFlags>({
    tokenFeed: true
  })
  const [endpointName, setEndpointName] = useState<EndPointName>(() =>
    userCache.endpointName ? userCache.endpointName : DEFAULT_ENDPOINT_NAME
  )
  const [priorityFee, setPriorityFee] = useState<PriorityFeeName>(userCache.priorityFee || 'Default')
  const setCache = useCallback((cache: USER_CONFIG_CACHE) => {
    setUserCache(cache)
  }, [])
  const [cacheUpdateQueue, setCacheUpdateQueue] = useState<Partial<USER_CONFIG_CACHE>>({})

  const updateUserCache = useCallback((cache: Partial<USER_CONFIG_CACHE>) => {
    // predicts multiple sets to prevent race condition overwriting sets instead takes latest and merges
    setCacheUpdateQueue((prevCache) => ({ ...prevCache, ...cache }))
  }, [])
  useLayoutEffect(() => {
    // each feature flag
    console.log('MODE', import.meta.env.MODE)
    if (import.meta.env.MODE == 'production') {
      setFeatureFlags({
        tokenFeed: false
      })
    }
  }, [])
  useEffect(() => {
    if (Object.keys(cacheUpdateQueue).length === 0) return
    const timeout = setTimeout(() => {
      setUserCache((prevCache) => {
        // redundant updates
        if (JSON.stringify(cacheUpdateQueue) == JSON.stringify(prevCache)) return prevCache

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
    }, 200)
    return () => {
      clearTimeout(timeout)
    }
  }, [cacheUpdateQueue])

  const { priorityFeeInstruction, priorityFeeValue } = useMemo(() => {
    let fee = 0.0
    switch (priorityFee) {
      case 'Fast':
        fee = 200000
        break
      case 'Turbo':
        fee = 500000
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

  const chainId = useMemo(() => RPCs[endpointName ?? DEFAULT_ENDPOINT_NAME].chainId, [endpointName])
  const network = useMemo(() => RPCs[endpointName ?? DEFAULT_ENDPOINT_NAME].network, [endpointName])
  const endpoint = useMemo(
    () => (userCache.endpoint !== null ? userCache.endpoint : RPCs[endpointName].endpoint),
    [endpointName, userCache.endpoint]
  )

  useEffect(() => {
    const payload: Partial<USER_CONFIG_CACHE> = {}
    // WHY?! -_- .. need smarter way to handle this
    if (priorityFee !== userCache.priorityFee) {
      payload.priorityFee = priorityFee
    }
    if (Object.keys(payload).length > 0) {
      updateUserCache(payload)
    }
  }, [priorityFee])

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
  }, [endpoint])
  const latencyQuery = useQuery({
    queryKey: [QUERY_KEY, 'latency', endpoint],
    queryFn: async () => {
      const start = Date.now()
      await connection.getLatestBlockhashAndContext({
        commitment: 'confirmed'
      })
      const end = Date.now()
      return end - start
    },
    staleTime: INTERVALS.SECOND * 30
  })

  useEffect(() => {
    if (endpointName === null) {
      setEndpointName(
        userCache.endpointName === null || userCache.endpoint === null ? RPCs[endpointName].name : 'Custom'
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

      // sets gammaBoostedRewardsIsActive flag
      fetchGammaBoostedRewards().then((gammaBoostedRewardsIsActive: boolean) =>
        setGammaBoostedRewardsIsActive(gammaBoostedRewardsIsActive)
      )
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
        latency: latencyQuery.data,
        priorityFeeValue,
        userCache,
        setUserCache: setCache,
        updateUserCache,
        gammaBoostedRewardsIsActive,
        setTermsOfServiceVisible,
        termsOfServiceVisible,
         featureFlags
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export async function getPriorityFeeEstimate(
  connection: Connection,
  txn: Transaction | VersionedTransaction
): Promise<PriorityFeeEstimateResponse | null> {
  try {
    const response = await fetch(connection.rpcEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: `getPriorityFeeEstimate-${Date.now()}`,
        method: 'getPriorityFeeEstimate',
        params: [
          {
            transaction: bs58.encode(txn.serialize({ requireAllSignatures: false, verifySignatures: false })),
            options: {
              includeAllPriorityFeeLevels: true
            }
          }
        ]
      })
    })
    const data = await response.json()
    console.log('Fee in function for ', data)
    return data.result.priorityFeeLevels as PriorityFeeEstimateResponse
  } catch (error) {
    console.log('Failed to fetch getPriorityFeeEstimate', error.message)
    // default
    return {
      min: 1000,
      low: 50000,
      medium: 70000,
      high: 750000,
      veryHigh: 1000000,
      unsafeMax: 10000000
    }
  }
}

type PriorityFeeEstimateResponse = {
  min: number
  low: number
  medium: number
  high: number
  veryHigh: number
  unsafeMax: number
}

export function getPriorityFeeFromLevel(
  priorityFee: PriorityFeeName,
  priorityFeeLevels: PriorityFeeEstimateResponse
): number {
  switch (priorityFee) {
    case 'Default':
      return priorityFeeLevels.low
    case 'Fast':
      return priorityFeeLevels.medium
    case 'Turbo':
      return priorityFeeLevels.high
    default:
      return priorityFeeLevels.min
  }
}
