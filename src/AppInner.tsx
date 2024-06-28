import React, { useEffect } from 'react'
import { Router } from './Router'
import { DarkModeProvider, SettingsProvider, WalletProvider } from './context'
import ThemeProvider from './theme'
import { USER_CONFIG_CACHE } from './types/app_params'
import queryString from 'query-string'
import WalletBalanceProvider from '@/context/walletBalanceContext'
export default function AppInner(): JSX.Element {
  const existingUserCache: USER_CONFIG_CACHE | null = JSON.parse(window.localStorage.getItem('gfx-user-cache'))

  useEffect(() => {
    if (existingUserCache === null || existingUserCache.farm === undefined) {
      console.log('** GFX Application Init **')
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
  }, [])

  return (
    existingUserCache !== null && (
      <DarkModeProvider>
        <ThemeProvider>
          <SettingsProvider>
            <WalletProvider>
              <WalletBalanceProvider>
                <Router />
              </WalletBalanceProvider>
            </WalletProvider>
          </SettingsProvider>
        </ThemeProvider>
      </DarkModeProvider>
    )
  )
}
