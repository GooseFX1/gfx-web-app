import React, { Dispatch, ReactNode, SetStateAction, useEffect, useContext, useMemo, useState, FC } from 'react'
import { ENV } from '@solana/spl-token-registry'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { Connection } from '@solana/web3.js'
import { USER_CONFIG_CACHE } from '../types/app_params'
import { fetchBrowserCountryCode } from '../api/analytics'
import { fetchIsUnderMaintenance } from '../api/config'
import { ENVS } from '../constants'

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

export type RPC = {
  chainId: ENV
  name: string
  endpoint: string
  network: WalletAdapterNetwork
}

export const APP_RPC: RPC = {
  chainId: ENV.MainnetBeta,
  name: 'GooseFX',
  endpoint: `https://mainnet.helius-rpc.com/?api-key=097b6306-9cad-46db-86e5-8ed6787a71b7`,
  network: WalletAdapterNetwork.Mainnet
}

type IRPC_CACHE = null | USER_CONFIG_CACHE

interface ISettingsConfig {
  chainId: ENV
  connection: Connection
  perpsConnection: Connection
  endpoint: string
  endpointName: string
  network: WalletAdapterNetwork
  setEndpointName: Dispatch<SetStateAction<string>>
  blacklisted: boolean
  isUnderMaintenance: boolean
  setSlippage?: Dispatch<SetStateAction<number>>
  slippage?: number
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

export const SettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [slippage, setSlippage] = useState<number>(DEFAULT_SLIPPAGE)
  const [blacklisted, setBlacklisted] = useState<boolean>(false)
  const [isUnderMaintenance, setIsUnderMaintenance] = useState<boolean>(false)
  const existingUserCache: IRPC_CACHE = JSON.parse(window.localStorage.getItem('gfx-user-cache'))
  const [endpointName, setEndpointName] = useState<string | null>(null)

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

  const chainId = useMemo(() => APP_RPC.chainId, [endpointName])
  const network = useMemo(() => APP_RPC.network, [endpointName])

  const endpoint = useMemo(() => {
    if (existingUserCache.endpoint !== null) {
      return existingUserCache.endpoint
    } else {
      // asserts 'Custom' is cached with a null enpoint value - results in default reset
      if (endpointName === 'Custom') {
        setEndpointName(APP_RPC.name)
        return APP_RPC.endpoint
      } else {
        return APP_RPC.endpoint
      }
    }
  }, [endpointName])

  const perpsConnection = useMemo(() => {
    // sets rpc info to cache
    window.localStorage.setItem(
      'gfx-user-cache',
      JSON.stringify({
        ...existingUserCache,
        endpointName: endpointName,
        endpoint: existingUserCache.endpointName === 'Custom' ? endpoint : null
      })
    )

    // creates connection - temp ws url
    return new Connection(endpoint, {
      commitment: 'processed',
      httpAgent: false,
      disableRetryOnRateLimit: true
    })
  }, [endpointName, endpoint])

  const connection = useMemo(() => {
    // sets rpc info to cache
    window.localStorage.setItem(
      'gfx-user-cache',
      JSON.stringify({
        ...existingUserCache,
        endpointName: endpointName,
        endpoint: existingUserCache.endpointName === 'Custom' ? endpoint : null
      })
    )

    // creates connection - temp ws url
    return new Connection(endpoint, {
      commitment: 'confirmed',
      httpAgent: false,
      disableRetryOnRateLimit: true
    })
  }, [endpointName, endpoint])

  useEffect(() => {
    if (endpointName === null) {
      setEndpointName(
        existingUserCache.endpointName === null || existingUserCache.endpoint === null ? APP_RPC.name : 'Custom'
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
        isUnderMaintenance
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
