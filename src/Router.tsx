import React, { FC } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { AppLayout } from './layouts'
import { Crypto, Farm, NFTs, Swap } from './pages'
import { CryptoProvider, NavCollapseProvider, NFTProfileProvider, PriceFeedProvider } from './context'
import { GenericNotFound } from './pages/InvalidUrl'
import { CryptoContent } from './pages/TradeV2/MovableContainer'

export const Router: FC = () => {
  return (
    <BrowserRouter>
      {window.location.pathname === '/' && <Redirect from="/" to="/swap" />}

      <NavCollapseProvider>
        <AppLayout>
          <Switch>
            <Route exact path="/swap" component={Swap} />
            <Route exact path="/trade" component={Crypto} />
            <Route exact path="/trade">
              <CryptoProvider>
                <PriceFeedProvider>
                  <CryptoContent />
                </PriceFeedProvider>
              </CryptoProvider>
            </Route>
            <Route path="/NFTs">
              <NFTProfileProvider>
                <NFTs />
              </NFTProfileProvider>
            </Route>
            <Route exact path="/farm" component={Farm} />
            {window.location.href && !window.location.href.includes('/NFTs/') && (
              <Route>
                <GenericNotFound />
              </Route>
            )}
          </Switch>
        </AppLayout>
      </NavCollapseProvider>
    </BrowserRouter>
  )
}
