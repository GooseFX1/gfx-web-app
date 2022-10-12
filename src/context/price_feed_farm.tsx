import React, { createContext, Dispatch, FC, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { getFarmTokenPrices } from '../api/SSL'
import { Program, Provider } from '@project-serum/anchor'
import { useWallet, WalletContextState } from '@solana/wallet-adapter-react'
import { CONTROLLER_IDL, SSL_IDL } from 'goosefx-ssl-sdk'
import { getNetworkConnection, getStakingAccountKey } from '../web3'
import { useConnectionConfig } from './settings'
import { PublicKey } from '@solana/web3.js'
import { ADDRESSES as SDK_ADDRESS } from 'goosefx-ssl-sdk'

// const minMaxSuffix = '/ohlc?vs_currency=usd&days=7'
interface IPrices {
  [x: string]: {
    current: number
  }
}
interface IChange {
  [x: string]: {
    change?: string
    volume?: string
    range?: {
      min: string
      max: string
    }
  }
}
interface IStats {
  tvl: number
  volume7dSum: number
  totalVolumeTrade?: number
}
interface IPriceFeedConfig {
  prices: IPrices
  tokenInfo?: IChange
  refreshTokenData: () => void
  priceFetched: boolean
  statsData: IStats
  setStatsData: Dispatch<IStats>
  stakeProgram: Program
  SSLProgram: Program
  stakeAccountKey: PublicKey
}

const PriceFeedFarmContext = createContext<IPriceFeedConfig | null>(null)

export const PriceFeedFarmProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [prices, setPrices] = useState<IPrices>({})
  const [priceFetched, setPriceFetched] = useState<boolean>(false)
  const [statsData, setStatsData] = useState<IStats | null>()
  const [stakeAccountKey, setAccountKey] = useState<PublicKey>()
  const wallet = useWallet()
  const { network, connection } = useConnectionConfig()
  const stakeProgram: Program = useMemo(
    () =>
      wallet.publicKey
        ? new Program(
            CONTROLLER_IDL as any,
            SDK_ADDRESS[getNetworkConnection(network)].CONTROLLER_PROGRAM_ID,
            new Provider(connection, wallet as WalletContextState, { commitment: 'finalized' })
          )
        : undefined,
    [connection, wallet.publicKey, network]
  )
  useEffect(() => {
    if (wallet.publicKey) {
      if (stakeAccountKey === undefined) {
        getStakingAccountKey(wallet, network).then((accountKey) => setAccountKey(accountKey))
      }
    } else {
      setAccountKey(undefined)
    }

    return null
  }, [wallet.publicKey, connection])

  const SSLProgram: Program = useMemo(
    () =>
      wallet.publicKey
        ? new Program(
            SSL_IDL as any,
            SDK_ADDRESS[getNetworkConnection(network)].SSL_PROGRAM_ID,
            new Provider(connection, wallet as WalletContextState, { commitment: 'finalized' })
          )
        : undefined,
    [connection, wallet.publicKey]
  )

  const refreshTokenData = async () => {
    ;(async () => {
      const { data } = await getFarmTokenPrices()
      setPrices(data)
      setPriceFetched(true)
    })()
  }

  return (
    <PriceFeedFarmContext.Provider
      value={{
        prices,
        refreshTokenData,
        priceFetched,
        statsData,
        setStatsData,
        stakeProgram,
        SSLProgram,
        stakeAccountKey
      }}
    >
      {children}
    </PriceFeedFarmContext.Provider>
  )
}

export const usePriceFeedFarm = (): IPriceFeedConfig => {
  const context = useContext(PriceFeedFarmContext)
  if (!context) {
    throw new Error('Missing crypto context')
  }

  return {
    prices: context.prices,
    refreshTokenData: context.refreshTokenData,
    priceFetched: context.priceFetched,
    statsData: context.statsData,
    setStatsData: context.setStatsData,
    stakeProgram: context.stakeProgram,
    SSLProgram: context.SSLProgram,
    stakeAccountKey: context.stakeAccountKey
  }
}
