import React, { FC } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { AppLayout } from './layouts'
import { Crypto, Farm, NFTs, Synths, Swap } from './pages'
import useBlacklisted from './utils/useBlacklisted'
import { NavCollapseProvider, NFTProfileProvider } from './context'

export const Router: FC = () => {
  const blacklisted = useBlacklisted()
  console.log('blacklisted', blacklisted)

  return (
    <BrowserRouter>
      {window.location.pathname === '/' && <Redirect from="/" to="/crypto" />}
      <Switch>
        <NavCollapseProvider>
          <AppLayout>
            <Route exact path="/swap" component={Swap} />
            <Route exact path="/crypto" component={Crypto} />
            <Route
              exact
              path="/synths"
              component={() => {
                if (blacklisted) {
                  window.location.href = 'https://goosefx.io/restricted'
                  return null
                } else {
                  return <Synths />
                }
              }}
            />
            <Route path="/NFTs">
              <NFTProfileProvider>
                <NFTs />
              </NFTProfileProvider>
            </Route>
            <Route exact path="/farm" component={Farm} />
          </AppLayout>
        </NavCollapseProvider>
      </Switch>
    </BrowserRouter>
  )
}
