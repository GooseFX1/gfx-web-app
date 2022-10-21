import React, { Dispatch, FC, ReactNode, SetStateAction, useContext, useMemo, useState } from 'react'
import { ENV } from '@solana/spl-token-registry'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { Connection } from '@solana/web3.js'
// import { useLocalStorageState } from '../utils'

export enum GFX_RPCS {
  QUICKNODE = 'QuickNode Pro',
  SOLANA_RPC = 'Solana',
  SERUM = 'Project Serum',
  GENGO = 'GenesysGo',
  SYNDICA = 'Syndica'
}

export const DEFAULT_MAINNET_RPC = GFX_RPCS.SYNDICA

type RPC = {
  chainId: ENV
  name: string
  endpoint: string
  network: WalletAdapterNetwork
}

type ENDPOINTS = { [key: string]: RPC }

export const ENDPOINTS: ENDPOINTS = {
  [GFX_RPCS.QUICKNODE]: {
    chainId: ENV.MainnetBeta,
    name: GFX_RPCS.QUICKNODE,
    endpoint: `https://green-little-wind.solana-mainnet.quiknode.pro/${process.env.REACT_APP_QUICKNODE_TOKEN}`,
    network: WalletAdapterNetwork.Mainnet
  },
  [GFX_RPCS.SOLANA_RPC]: {
    chainId: ENV.Devnet,
    name: GFX_RPCS.SOLANA_RPC,
    endpoint: 'https://api.devnet.solana.com',
    network: WalletAdapterNetwork.Devnet
  },
  [GFX_RPCS.SERUM]: {
    chainId: ENV.MainnetBeta,
    name: GFX_RPCS.SERUM,
    endpoint: 'https://solana-api.projectserum.com',
    network: WalletAdapterNetwork.Mainnet
  },
  [GFX_RPCS.GENGO]: {
    chainId: ENV.MainnetBeta,
    name: GFX_RPCS.GENGO,
    endpoint: 'https://ssc-dao.genesysgo.net',
    network: WalletAdapterNetwork.Mainnet
  },
  [GFX_RPCS.SYNDICA]: {
    chainId: ENV.MainnetBeta,
    name: GFX_RPCS.SYNDICA,
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
  setSlippage: Dispatch<SetStateAction<number>>
  slippage: number
}

export const DEFAULT_SLIPPAGE = '0.0015'

const SettingsContext = React.createContext<ISettingsConfig | null>(null)

export function useSlippageConfig() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('Missing settings context')
  }

  const { slippage, setSlippage } = context
  return { slippage, setSlippage }
}

export function useConnectionConfig() {
  const context = useContext(SettingsContext)
  if (!context) {
    throw new Error('Missing settings context')
  }

  const { chainId, connection, endpoint, network, endpointName, setEndpointName } = context
  return { chainId, connection, endpoint, network, endpointName, setEndpointName }
}

type RPC_CACHE = null | { endpointName: string; endpoint: string | null }

export const SettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE)

  const init = (): string => {
    const existingUserPreference: RPC_CACHE = JSON.parse(window.localStorage.getItem('gfx-user-rpc'))

    if (existingUserPreference === null) {
      return process.env.NODE_ENV === 'production' ? DEFAULT_MAINNET_RPC : GFX_RPCS.SERUM
    } else if (existingUserPreference.endpoint === null) {
      return existingUserPreference.endpointName
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

  const connection = useMemo(() => new Connection(endpoint, 'confirmed'), [endpoint])

  return (
    <SettingsContext.Provider
      value={{
        chainId,
        connection,
        endpoint,
        network,
        endpointName,
        setEndpointName,
        setSlippage: (val) => setSlippage(val.toString()),
        slippage: parseFloat(slippage)
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
