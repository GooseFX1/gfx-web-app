import React, { Dispatch, ReactNode, SetStateAction, useContext, useMemo, useState, FC } from 'react'
import { ENV } from '@solana/spl-token-registry'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { Connection, clusterApiUrl } from '@solana/web3.js'
import { useRPCContext } from './rpc_context'
import { USER_CONFIG_CACHE } from '../types/app_params'
// import { useLocalStorageState } from '../utils'

export enum GFX_RPC_NAMES {
  QUICKNODE = 'QuickNode Pro',
  MONKE_RPC = 'Monke DAO',
  SYNDICA = 'Syndica',
  TRITON = 'Triton',
  HELIUS = 'Helius',
  SOLANA_RPC_DEV = 'Solana'
}

export type RPC = {
  chainId: ENV
  name: string
  endpoint: string
  network: WalletAdapterNetwork
}

type ENDPOINTS = { [key: string]: RPC }

export const ENDPOINTS: ENDPOINTS = {
  [GFX_RPC_NAMES.SOLANA_RPC_DEV]: {
    chainId: ENV.Devnet,
    name: GFX_RPC_NAMES.SOLANA_RPC_DEV,
    endpoint: clusterApiUrl('devnet'),
    network: WalletAdapterNetwork.Devnet
  },
  [GFX_RPC_NAMES.QUICKNODE]: {
    chainId: ENV.MainnetBeta,
    name: GFX_RPC_NAMES.QUICKNODE,
    endpoint: `https://green-little-wind.solana-mainnet.quiknode.pro/${process.env.REACT_APP_QUICKNODE_TOKEN}`,
    network: WalletAdapterNetwork.Mainnet
  },
  [GFX_RPC_NAMES.MONKE_RPC]: {
    chainId: ENV.MainnetBeta,
    name: GFX_RPC_NAMES.MONKE_RPC,
    endpoint: `https://${process.env.REACT_APP_MONKE_RPC}.xyz2.hyperplane.dev`,
    network: WalletAdapterNetwork.Mainnet
  },
  [GFX_RPC_NAMES.TRITON]: {
    chainId: ENV.MainnetBeta,
    name: GFX_RPC_NAMES.TRITON,
    endpoint: `https://goosefx-mainnet-7f4e.mainnet.rpcpool.com/`,
    network: WalletAdapterNetwork.Mainnet
  },
  [GFX_RPC_NAMES.HELIUS]: {
    chainId: ENV.MainnetBeta,
    name: GFX_RPC_NAMES.HELIUS,
    endpoint: `https://rpc.helius.xyz/?api-key=${process.env.REACT_APP_HELUIS_TOKEN}`,
    network: WalletAdapterNetwork.Mainnet
  },
  [GFX_RPC_NAMES.SYNDICA]: {
    chainId: ENV.MainnetBeta,
    name: GFX_RPC_NAMES.SYNDICA,
    endpoint: `https://solana-api.syndica.io/access-token/${process.env.REACT_APP_SYNDICA_TOKEN}/rpc`,
    network: WalletAdapterNetwork.Mainnet
  }
}

interface ISettingsConfig {
  chainId: ENV
  connection: Connection
  devnetConnection: Connection
  endpoint: string
  endpointName: string
  network: WalletAdapterNetwork
  setEndpointName: Dispatch<SetStateAction<string>>
  setSlippage?: Dispatch<SetStateAction<number>>
  slippage?: number
}

export const DEFAULT_MAINNET_RPC = GFX_RPC_NAMES.SYNDICA
export const DEFAULT_SLIPPAGE = 0.005

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

  const { chainId, connection, endpoint, network, endpointName, setEndpointName, devnetConnection } = context
  return { chainId, connection, endpoint, network, endpointName, setEndpointName, devnetConnection }
}

type IRPC_CACHE = null | USER_CONFIG_CACHE

export const SettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [slippage, setSlippage] = useState<number>(DEFAULT_SLIPPAGE)
  const devnetConnection = new Connection(
    'https://omniscient-frequent-wish.solana-devnet.quiknode.pro/8b6a255ef55a6dbe95332ebe4f6d1545eae4d128/'
  )
  const { rpcHealth } = useRPCContext()
  const existingUserCache: IRPC_CACHE = JSON.parse(window.localStorage.getItem('gfx-user-cache'))

  // returns endpoint name id as string
  const init = (): string => {
    if (process.env.NODE_ENV === 'development')
      return existingUserCache.endpoint === null ? DEFAULT_MAINNET_RPC : 'Custom'

    const healthyRPCS: string[] = rpcHealth.map((rpc) => rpc.name)

    if (healthyRPCS.includes(existingUserCache.endpointName)) {
      return existingUserCache.endpointName
    } else if (existingUserCache.endpointName === null || existingUserCache.endpoint === null) {
      return healthyRPCS.includes(DEFAULT_MAINNET_RPC) ? DEFAULT_MAINNET_RPC : healthyRPCS[0]
    } else {
      return 'Custom'
    }
  }

  const [endpointName, setEndpointName] = useState<string>(init())

  const chainId = useMemo(
    () => (endpointName in ENDPOINTS ? ENDPOINTS[endpointName].chainId : ENV.MainnetBeta),
    [endpointName]
  )

  const network = useMemo(
    () => (endpointName in ENDPOINTS ? ENDPOINTS[endpointName].network : WalletAdapterNetwork.Mainnet),
    [endpointName]
  )

  const endpoint = useMemo(() => {
    if (existingUserCache.endpoint !== null) {
      return existingUserCache.endpoint
    } else {
      // asserts 'Custom' is cached with a null enpoint value - results in default reset
      if (endpointName === 'Custom') {
        setEndpointName(DEFAULT_MAINNET_RPC)
        return ENDPOINTS[DEFAULT_MAINNET_RPC].endpoint
      } else {
        return ENDPOINTS[endpointName].endpoint
      }
    }
  }, [endpointName])

  const connection = useMemo(() => {
    // sets rpc info to cache
    window.localStorage.setItem(
      'gfx-user-cache',
      JSON.stringify({
        ...existingUserCache,
        endpoint: existingUserCache.endpointName === 'Custom' ? endpoint : null
      })
    )

    // creates connection
    return new Connection(endpoint, 'confirmed')
  }, [endpoint])

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
        devnetConnection
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
