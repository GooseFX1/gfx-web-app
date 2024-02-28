import React, { useEffect, useState } from 'react'
import { Router } from './Router'
import { DarkModeProvider, SettingsProvider, WalletProvider } from './context'
import ThemeProvider from './theme'
import './App.less'
import { USER_CONFIG_CACHE } from './types/app_params'
import queryString from 'query-string'
import { Toaster } from 'gfx-component-lib'
export default function AppInner(): JSX.Element {
  const existingUserCache: USER_CONFIG_CACHE | null = JSON.parse(window.localStorage.getItem('gfx-user-cache'))
  const [init, setInit] = useState<boolean | null>(null)

  useEffect(() => {
    if (existingUserCache === null || existingUserCache.farm === undefined) {
      setInit(true)
      window.localStorage.setItem(
        'gfx-user-cache',
        JSON.stringify({
          hasDexOnboarded: false,
          farm: {
            hasFarmOnboarded: false,
            showDepositedFilter: false
          },
          hasSignedTC: existingUserCache !== null ? existingUserCache.hasSignedTC : false,
          endpointName: null,
          endpoint: null
        })
      )
    }

    const values = queryString.parse(window.location?.search)
    if (values.r && !localStorage.getItem('referrer')) {
      localStorage.setItem('referrer', values.r as string)
    }
  }, [])

  useEffect(() => {
    const values = queryString.parse(window.location?.search)

    console.log(window.location, values)
  }, [window.location.href])

  useEffect(() => {
    console.log('** GFX Application Init **')
  }, [init])

  return (
    existingUserCache !== null && (
      <DarkModeProvider>
        <Toaster />
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
