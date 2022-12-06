import React, { FC, ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { getWorkingRPCEndpoints } from '../api/analytics'

type RPC_HEALTH = {
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
    fetchRPCHealthStatus(rpcHealth).then((rpcHealthStats) => {
      setRPCHealth(rpcHealthStats)
    })
  }, [])

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
