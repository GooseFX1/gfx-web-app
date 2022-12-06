import React, { FC, ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { getWorkingRPCEndpoints } from '../api/analytics'

interface IDarkModeConfig {
  endpoints: any
}

const WorkingRPCContext = createContext<IDarkModeConfig | null>(null)

export const WorkingRPCProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [hasBeenCalled, setHasBeenCalled] = useState(false)
  const [endpoints, setEndpoints] = useState<any>(null)

  const getRPCEndpoints = async (setHasBeenCalled, hasBeenCalled, setEndpoints) => {
    if (hasBeenCalled) return
    const { data } = await getWorkingRPCEndpoints()
    setEndpoints(data)
    setHasBeenCalled(true)
  }

  useEffect(() => {
    getRPCEndpoints(setHasBeenCalled, hasBeenCalled, setEndpoints)
  }, [])
  return (
    <WorkingRPCContext.Provider
      value={{
        endpoints
      }}
    >
      {children}
    </WorkingRPCContext.Provider>
  )
}

export const useRPCContext = (): IDarkModeConfig => {
  const context = useContext(WorkingRPCContext)
  if (!context) {
    throw new Error('Missing dark mode context')
  }

  const { endpoints } = context
  return { endpoints }
}
