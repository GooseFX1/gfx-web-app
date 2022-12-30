import React, { FC, ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { getWorkingRPCEndpoints } from '../api/analytics'
import { RPC_CACHE } from '../types/app_params'

export type RPC_HEALTH = {
  name: string
  health: boolean
  health_utc: string
}

interface IRPCHealthContext {
  rpcHealth: RPC_HEALTH[] | null
}

const RPCHealthContext = createContext<IRPCHealthContext | null>(null)

export const WorkingRPCProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [rpcHealth, setRPCHealth] = useState<RPC_HEALTH[] | null>(null)

  const fetchRPCHealthStatus = async (curHealth: RPC_HEALTH[] | null): Promise<RPC_HEALTH[]> => {
    if (curHealth !== null) return curHealth
    const { data } = await getWorkingRPCEndpoints()
    return data
  }

  useEffect(() => {
    initUserConfigCache()

    fetchRPCHealthStatus(rpcHealth).then((rpcHealthStats) => {
      setRPCHealth(rpcHealthStats)
    })
  }, [])

  const initUserConfigCache = () => {
    const existingUserCache: RPC_CACHE = JSON.parse(window.localStorage.getItem('gfx-user-cache') || null)

    if (existingUserCache === null) {
      window.localStorage.setItem(
        'gfx-user-cache',
        JSON.stringify({
          hasDexOnboarded: false,
          hasAggOnboarded: false,
          hasSignedTC: false,
          endpointName: null,
          endpoint: null
        })
      )
    }
  }

  return (
    <RPCHealthContext.Provider
      value={{
        rpcHealth
      }}
    >
      {children}
    </RPCHealthContext.Provider>
  )
}

export const useRPCContext = (): IRPCHealthContext => {
  const context = useContext(RPCHealthContext)
  if (!context) {
    throw new Error('Missing dark mode context')
  }

  const { rpcHealth } = context
  return { rpcHealth }
}
