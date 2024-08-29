import React, { createContext, FC, ReactNode, useContext, useEffect, useState } from 'react'
import {
  fetchAggregateStats,
  fetchGAMMAConfig,
  fetchLpPositions,
  fetchPools,
  fetchPortfolioStats,
  fetchUser
} from '../api/gamma'
import {
  GAMMAConfig,
  // GAMMAPool,
  GAMMAProtocolStats,
  GAMMAUser,
  UserPortfolioLPPosition,
  UserPortfolioStats
} from '../types/gamma'
  import { useWalletBalance } from '@/context/walletBalanceContext'

interface GAMMADataModel {
  gammaConfig: GAMMAConfig
  aggregateStats: GAMMAProtocolStats
  pools: any[]
  user: GAMMAUser
  portfolioStats: UserPortfolioStats
  lpPositions: UserPortfolioLPPosition[]
  GAMMA_SORT_CONFIG: { id: string, name: string }[]
}

const GAMMAContext = createContext<GAMMADataModel | null>(null)

export const GammaProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { publicKey: publicKey } = useWalletBalance()
  const [gammaConfig, setGammaConfig] = useState<GAMMAConfig | null>(null)
  const [aggregateStats, setAggregateStats] = useState<GAMMAProtocolStats | null>(null)
  const [pools, setPools] = useState<any[] | null>(null)
  const [user, setUser] = useState<GAMMAUser | null>(null)
  const [portfolioStats, setPortfolioStats] = useState<UserPortfolioStats | null>(null)
  const [lpPositions, setLpPositions] = useState<UserPortfolioLPPosition[] | null>(null)
  const GAMMA_SORT_CONFIG = [
    { id: '1', name: 'Liquidity: High' },
    { id: '2', name: 'Liquidity: Low' },
    { id: '3', name: 'Volume: High' },
    { id: '4', name: 'Volume: Low' },
    { id: '5', name: 'Fees: High' },
    { id: '6', name: 'Fees: Low' },
    { id: '7', name: 'APR: High' },
    { id: '8', name: 'APR: Low' }
  ]

  useEffect(() => {
    fetchGAMMAConfig().then((config) => {
      if (config) setGammaConfig(config)
    })
  }, [fetchGAMMAConfig])

  useEffect(() => {
    fetchAggregateStats().then((stats) => {
      if (stats) setAggregateStats(stats)
    })
  }, [fetchAggregateStats])

  useEffect(() => {
    fetchPools().then((poolsData) => {
      if (poolsData) setPools(poolsData)
    })
  }, [fetchPools])

  useEffect(() => {
    if (publicKey !== null) {
      fetchUser(publicKey.toBase58()).then((userData) => {
        if (userData) setUser(userData)
      })
    }
  }, [fetchUser, user])

  useEffect(() => {
    if (user) {
      fetchPortfolioStats(user.id).then((stats) => {
        if (stats) setPortfolioStats(stats)
      })
    }
  }, [fetchPortfolioStats, user])

  useEffect(() => {
    if (user) {
      fetchLpPositions(user.id).then((positions) => {
        if (positions) setLpPositions(positions)
      })
    }
  }, [fetchLpPositions, user])

  return (
    <GAMMAContext.Provider
      value={{
        gammaConfig,
        aggregateStats,
        pools,
        user,
        portfolioStats,
        lpPositions,
        GAMMA_SORT_CONFIG
      }}
    >
      {children}
    </GAMMAContext.Provider>
  )
}

export const useGamma = (): GAMMADataModel => {
  const context = useContext(GAMMAContext)
  if (!context) {
    throw new Error('Missing gamma context')
  }

  return context
}
