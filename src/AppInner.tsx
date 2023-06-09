import React, { useEffect, useState } from 'react'
import { Router } from './Router'
import { DarkModeProvider, SettingsProvider, WalletProvider } from './context'
import ThemeProvider from './theme'
import './App.less'
import { USER_CONFIG_CACHE } from './types/app_params'

export default function AppInner(): JSX.Element {
  const existingUserCache: USER_CONFIG_CACHE | null = JSON.parse(window.localStorage.getItem('gfx-user-cache'))
  const [init, setInit] = useState<boolean | null>(null)

  useEffect(() => {
    if (existingUserCache === null) {
      setInit(true)
      window.localStorage.setItem(
        'gfx-user-cache',
        JSON.stringify({
          hasDexOnboarded: false,
          hasAggOnboarded: false,
          hasSignedTC: false,
          endpointName: null,
          endpoint: null,
          jwtToken: null
        })
      )
    }
  }, [])

  useEffect(() => console.log('** GFX Application Init **'), [init])

  return (
    existingUserCache !== null && (
      <DarkModeProvider>
        <ThemeProvider>
          <SettingsProvider>
            <WalletProvider>
              <Router />
            </WalletProvider>
          </SettingsProvider>
        </ThemeProvider>
      </DarkModeProvider>
    )
  )
}
