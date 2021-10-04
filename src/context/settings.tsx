import React, { Dispatch, FC, ReactNode, SetStateAction, useContext, useMemo } from 'react'
import { ENV } from '@solana/spl-token-registry'
import { clusterApiUrl, Connection } from '@solana/web3.js'
import { useLocalStorageState } from '../utils'
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'

interface IEndpoint {
  chainId: ENV
  endpoint: string
  network: WalletAdapterNetwork
}

export const ENDPOINTS: IEndpoint[] = [
  { chainId: ENV.MainnetBeta, endpoint: clusterApiUrl('mainnet-beta'), network: WalletAdapterNetwork.Mainnet },
  { chainId: ENV.Devnet, endpoint: clusterApiUrl('devnet'), network: WalletAdapterNetwork.Devnet }
]

interface ISettingsConfig {
  chainId: ENV
  connection: Connection
  endpoint: string
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

  const { chainId, connection, endpoint, network, setEndpoint } = context
  return { chainId, connection, endpoint, network, setEndpoint }
}

export const SettingsProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [endpoint, setEndpoint] = useLocalStorageState('endpoint', ENDPOINTS[0].endpoint)
  const [slippage, setSlippage] = useLocalStorageState('slippage', DEFAULT_SLIPPAGE.toString())

  const connection = useMemo(() => new Connection(endpoint, 'recent'), [endpoint])
  const chainId = useMemo(() => ENDPOINTS.find((e) => e.endpoint === endpoint)!.chainId, [endpoint])
  const network = useMemo(() => ENDPOINTS.find((e) => e.endpoint === endpoint)!.network, [endpoint])

  return (
    <SettingsContext.Provider
      value={{
        chainId,
        connection,
        endpoint,
        network,
        setEndpoint,
        slippage: parseFloat(slippage),
        setSlippage: (val) => setSlippage(val.toString())
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}
