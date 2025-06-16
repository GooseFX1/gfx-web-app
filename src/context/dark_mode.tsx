import React, { FC, ReactNode, createContext, useContext, useCallback, useEffect } from 'react'
import { useLocalStorageState } from '../utils'
import { useAppKitTheme } from '@/hooks/reownConfig'

export type ThemeMode = 'dark' | 'lite'
interface IDarkModeConfig {
  mode: ThemeMode
  toggleMode: () => void
  isDarkMode: boolean
}

const DarkModeContext = createContext<IDarkModeConfig | null>(null)

export const DarkModeProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useLocalStorageState('darkMode', 'dark')
  const { setThemeMode } = useAppKitTheme()
  
  useEffect(() => {
    const root = document.getElementsByTagName('body')[0]
    if (mode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [mode])

  const handleToggleMode = useCallback(() => {
    setMode(mode === 'dark' ? 'lite' : 'dark')
    setThemeMode(mode === 'dark' ? 'light' : 'dark')
  }, [mode, setMode])

  return (
    <DarkModeContext.Provider
      value={{
        mode,
        toggleMode: handleToggleMode,
        isDarkMode: mode === 'dark'
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
