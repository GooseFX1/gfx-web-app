import React, { Dispatch, FC, ReactNode, SetStateAction, useContext, useMemo, useState } from 'react'
import { ENV } from '@solana/spl-token-registry'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { Connection } from '@solana/web3.js'
import { useLocalStorageState } from '../utils'

interface IEndpoint {
  chainId: ENV
  endpoint: string
  name: string
  network: WalletAdapterNetwork
}

export const ENDPOINTS: IEndpoint[] = [
  {
    chainId: ENV.MainnetBeta,
    name: 'GenesysGo',
    endpoint: 'https://ssc-dao.genesysgo.net',
    network: WalletAdapterNetwork.Mainnet
  },
  {
    chainId: ENV.Devnet,
    name: 'QuickNode',
    endpoint: 'https://muddy-rough-leaf.solana-devnet.quiknode.pro/542f5d1429c8b5bfaaf947ca4be72847c2e24859/',
    network: WalletAdapterNetwork.Devnet
  },
  {
    chainId: ENV.MainnetBeta,
    name: 'Project Serum',
    endpoint: 'https://solana-api.projectserum.com',
    network: WalletAdapterNetwork.Mainnet
  },
  {
    chainId: ENV.MainnetBeta,
    name: 'QuickNode Pro',
    endpoint: 'https://green-little-wind.solana-mainnet.quiknode.pro/0e3bb9a62cf850ee8a4cf68dbb92aef6d4c97d0b/',
    network: WalletAdapterNetwork.Mainnet
  }
]

interface ISettingsConfig {
  chainId: ENV
  connection: Connection
  endpoint: string
  endpointName: string
  network: WalletAdapterNetwork
  setEndpoint: Dispatch<SetStateAction<string>>
  setSlippage: Dispatch<SetStateAction<number>>
  slippage: number
}

export const DEFAULT_SLIPPAGE = 0.0025

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

  const { chainId, connection, endpoint, network, endpointName, setEndpoint } = context
  return { chainId, connection, endpoint, network, endpointName, setEndpoint }
}

export const SettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [endpoint, setEndpoint] = useState(ENDPOINTS[0].endpoint)
  const [slippage, setSlippage] = useLocalStorageState('slippage', DEFAULT_SLIPPAGE.toString())

  const connection = useMemo(() => new Connection(endpoint, 'recent'), [endpoint])
  const chainId = useMemo(() => ENDPOINTS.find((e) => e.endpoint === endpoint)!.chainId, [endpoint])
  const network = useMemo(() => ENDPOINTS.find((e) => e.endpoint === endpoint)!.network, [endpoint])
  const endpointName = useMemo(() => ENDPOINTS.find((e) => e.endpoint === endpoint)!.name, [endpoint])

  return (
    <SettingsContext.Provider
      value={{
        chainId,
        connection,
        endpoint,
        network,
        endpointName,
        setEndpoint,
        setSlippage: (val) => setSlippage(val.toString()),
        slippage: parseFloat(slippage)
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
