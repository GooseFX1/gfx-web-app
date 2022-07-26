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
    name: 'QuickNode Pro',
    endpoint: `https://green-little-wind.solana-mainnet.quiknode.pro/${process.env.REACT_APP_QUICKNODE_TOKEN}`,
    network: WalletAdapterNetwork.Mainnet
  },
  {
    chainId: ENV.Devnet,
    name: 'Solana',
    endpoint: 'https://api.devnet.solana.com',
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
    name: 'GenesysGo',
    endpoint: 'https://ssc-dao.genesysgo.net',
    network: WalletAdapterNetwork.Mainnet
  },
  {
    chainId: ENV.MainnetBeta,
    name: 'Syndica',
    endpoint:
      'https://solana-api.syndica.io/access-token/IOYLJaEtvN43W024NvifG71Bw1rfvPGHi8JgmOzdMc7SKSb4ruSafhRUtFG9jMbS/rpc',
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

export const DEFAULT_SLIPPAGE = 0.0015

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
  const [endpoint, setEndpoint] = useState(ENDPOINTS[process.env.NODE_ENV === 'production' ? 0 : 1].endpoint)
  const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE.toString())

  // useLocalStorageState('slippage', DEFAULT_SLIPPAGE.toString())

  const connection = useMemo(() => new Connection(endpoint, 'confirmed'), [endpoint])

  const endpointObj = ENDPOINTS.find((e) => e.endpoint === endpoint)
  const chainId = useMemo(() => endpointObj?.chainId ?? ENV.MainnetBeta, [endpoint])
  const network = useMemo(() => endpointObj?.network ?? WalletAdapterNetwork.Mainnet, [endpoint])
  const endpointName = useMemo(() => endpointObj?.name ?? 'Custom', [endpoint])

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
