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
  GAMMAPool,
  GAMMAProtocolStats,
  GAMMAUser,
  UserPortfolioLPPosition,
  UserPortfolioStats
} from '../types/gamma'

interface GAMMADataModel {
  gammaConfig: GAMMAConfig
  aggregateStats: GAMMAProtocolStats
  pools: GAMMAPool[]
  user: GAMMAUser
  portfolioStats: UserPortfolioStats
  lpPositions: UserPortfolioLPPosition[]
}

const GAMMAContext = createContext<GAMMADataModel | null>(null)

export const DarkModeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [gammaConfig, setGammaConfig] = useState<GAMMAConfig | null>(null)
  const [aggregateStats, setAggregateStats] = useState<GAMMAProtocolStats | null>(null)
  const [pools, setPools] = useState<GAMMAPool[] | null>(null)
  const [user, setUser] = useState<GAMMAUser | null>(null)
  const [portfolioStats, setPortfolioStats] = useState<UserPortfolioStats | null>(null)
  const [lpPositions, setLpPositions] = useState<UserPortfolioLPPosition[] | null>(null)

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
    if (user === null) {
      fetchUser(user.id).then((userData) => {
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
        lpPositions
      }}
    >
      {children}
    </GAMMAContext.Provider>
  )
}

export const useDarkMode = (): GAMMADataModel => {
  const context = useContext(GAMMAContext)
  if (!context) {
    throw new Error('Missing dark mode context')
  }

  return context
}
