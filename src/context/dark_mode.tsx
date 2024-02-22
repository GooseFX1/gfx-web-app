import React, { FC, ReactNode, createContext, useContext, useCallback } from 'react'
import { useLocalStorageState } from '../utils'

interface IDarkModeConfig {
  mode: 'dark' | 'lite'
  toggleMode: () => void
}

const DarkModeContext = createContext<IDarkModeConfig | null>(null)

export const DarkModeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useLocalStorageState('darkMode', 'dark')
  const root = document.getElementsByTagName('body')[0]
  if (mode === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  const handleToggleMode = useCallback(() => setMode(mode === 'dark' ? 'lite' : 'dark'), [mode, setMode])

  return (
    <DarkModeContext.Provider
      value={{
        mode,
        toggleMode: handleToggleMode
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

  return context
}
