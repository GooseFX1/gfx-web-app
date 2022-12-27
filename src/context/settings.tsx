import React, { Dispatch, ReactNode, SetStateAction, useContext, useMemo, useState, FC } from 'react'
import { ENV } from '@solana/spl-token-registry'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { Connection, clusterApiUrl } from '@solana/web3.js'
import { useRPCContext } from './rpc_context'
// import { useLocalStorageState } from '../utils'

export enum GFX_RPC_NAMES {
  QUICKNODE = 'QuickNode Pro',
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

  const { chainId, connection, endpoint, network, endpointName, setEndpointName } = context
  return { chainId, connection, endpoint, network, endpointName, setEndpointName }
}

type RPC_CACHE = null | { endpointName: string; endpoint: string | null }

export const SettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [slippage, setSlippage] = useState<number>(DEFAULT_SLIPPAGE)
  const { rpcHealth } = useRPCContext()

  // returns endpoint name id as string
  const init = (): string => {
    const existingUserPreference: RPC_CACHE = JSON.parse(window.localStorage.getItem('gfx-user-rpc'))
    const healthyRPCS: string[] = rpcHealth.map((rpc) => rpc.name)

    if (existingUserPreference === null) {
      return healthyRPCS.includes(DEFAULT_MAINNET_RPC) ? DEFAULT_MAINNET_RPC : healthyRPCS[0]
    } else if (existingUserPreference.endpoint === null) {
      return healthyRPCS.includes(existingUserPreference.endpointName)
        ? existingUserPreference.endpointName
        : healthyRPCS[0]
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
    // checks cache for persisted custom endpoint
    const existingUserPreference: RPC_CACHE = JSON.parse(window.localStorage.getItem('gfx-user-rpc'))

    if (existingUserPreference !== null && existingUserPreference.endpoint !== null) {
      return existingUserPreference.endpoint
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

  const connection = useMemo(
    () =>
      new Connection(
        // eslint-disable-next-line max-len
        'https://monke9e00d723218b4f1bbb2e80ecb49f360a.xyz2.hyperplane.dev/',
        'confirmed'
      ),
    [endpoint]
  )

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
        slippage: slippage
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
