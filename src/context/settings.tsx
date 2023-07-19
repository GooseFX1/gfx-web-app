import React, { Dispatch, ReactNode, SetStateAction, useEffect, useContext, useMemo, useState, FC } from 'react'
import { ENV } from '@solana/spl-token-registry'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { Connection } from '@solana/web3.js'
import { USER_CONFIG_CACHE } from '../types/app_params'
// import { useLocalStorageState } from '../utils'

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
  endpoint: `https://rpc-pool.goosefx.io/rpc`,
  network: WalletAdapterNetwork.Mainnet
}

type IRPC_CACHE = null | USER_CONFIG_CACHE

interface ISettingsConfig {
  chainId: ENV
  connection: Connection
  perpsConnection: Connection
  perpsDevnetConnection: Connection
  endpoint: string
  endpointName: string
  network: WalletAdapterNetwork
  setEndpointName: Dispatch<SetStateAction<string>>
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

  const {
    chainId,
    connection,
    endpoint,
    network,
    endpointName,
    setEndpointName,
    perpsConnection,
    perpsDevnetConnection
  } = context
  return {
    chainId,
    connection,
    endpoint,
    network,
    endpointName,
    setEndpointName,
    perpsConnection,
    perpsDevnetConnection
  }
}

export const SettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [slippage, setSlippage] = useState<number>(DEFAULT_SLIPPAGE)

  const existingUserCache: IRPC_CACHE = JSON.parse(window.localStorage.getItem('gfx-user-cache'))

  const [endpointName, setEndpointName] = useState<string | null>(null)

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

  const perpsDevnetConnection = useMemo(
    () =>
      // sets rpc info to cache
      // creates connection - temp ws url
      new Connection(
        'https://omniscient-frequent-wish.solana-devnet.quiknode.pro/8b6a255ef55a6dbe95332ebe4f6d1545eae4d128/',
        {
          commitment: 'processed',
          httpAgent: false,
          disableRetryOnRateLimit: true
        }
      ),
    []
  )

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
  //fetchMiddleware:

  useEffect(() => {
    if (endpointName === null) {
      setEndpointName(
        existingUserCache.endpointName === null || existingUserCache.endpoint === null ? APP_RPC.name : 'Custom'
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
        perpsDevnetConnection
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
