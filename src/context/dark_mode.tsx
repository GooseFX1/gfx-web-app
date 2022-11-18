import React, { FC, ReactNode, createContext, useContext } from 'react'
import { useLocalStorageState } from '../utils'

interface IDarkModeConfig {
  mode: string
  toggleMode: () => void
}

const DarkModeContext = createContext<IDarkModeConfig | null>(null)

export const DarkModeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useLocalStorageState('darkMode', 'dark')

  return (
    <DarkModeContext.Provider
      value={{
        mode,
        toggleMode: () => setMode(() => (mode === 'dark' ? 'lite' : 'dark'))
      }}
    >
      {children}
    </DarkModeContext.Provider>
  )
}

export const useDarkMode = (): IDarkModeConfig => {
  const context = useContext(DarkModeContext)
  if (!context) {
    throw new Error('Missing dark mode context')
  }

  const { mode, toggleMode } = context
  return { mode, toggleMode }
}
