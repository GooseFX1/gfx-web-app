import React, { FC } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { AppLayout } from './layouts'
import { Farm, NFTs, Swap } from './pages'
import {
  NavCollapseProvider,
  NFTProfileProvider,
  OrderProvider,
  PriceFeedProvider,
  TradeHistoryProvider,
  NFTAdminProvider
} from './context'
import Restricted from './pages/Restricted'
import { GenericNotFound } from './pages/InvalidUrl'
import { CryptoContent } from './pages/TradeV2/MovableContainer'
import useBlacklisted from './utils/useBlacklisted'
import { Launchpad } from './pages/NFTs/launchpad/Launchpad'
import { Creator } from './pages/NFTs/CreatorPage/Creator'
import { AdminWrapper } from './pages/NFTs/adminPage/components/AdminWrapper'

export const Router: FC = () => {
  const blacklisted = useBlacklisted()
  console.log('blacklisted', blacklisted, process.env.NODE_ENV)

  return (
    <BrowserRouter>
      {window.location.pathname === '/' && <Redirect from="/" to="/swap" />}

      <NavCollapseProvider>
        <AppLayout>
          <Switch>
            <Route exact path="/swap/:tradePair?">
              {blacklisted ? <Restricted /> : <Swap />}
            </Route>
            <Route exact path="/trade">
              {blacklisted ? (
                <Restricted />
              ) : (
                <PriceFeedProvider>
                  <TradeHistoryProvider>
                    <OrderProvider>
                      <CryptoContent />
                    </OrderProvider>
                  </TradeHistoryProvider>
                </PriceFeedProvider>
              )}
            </Route>
            <Route path="/NFTs/launchpad">
              <Launchpad />
            </Route>
            <Route path="/NFTs/Creator">
              <Creator />
            </Route>
            <Route path="/NFTs/admin">
              <NFTAdminProvider>
                <AdminWrapper />
              </NFTAdminProvider>
            </Route>
            <Route path="/NFTs">
              <NFTProfileProvider>
                <NFTs />
              </NFTProfileProvider>
            </Route>
            <Route exact path="/farm">
              {blacklisted ? <Restricted /> : <Farm />}
            </Route>
            <Route>
              <GenericNotFound />
            </Route>
          </Switch>
        </AppLayout>
      </NavCollapseProvider>
    </BrowserRouter>
  )
}
