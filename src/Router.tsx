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
  NFTAdminProvider,
  OrderBookProvider
} from './context'
import Restricted from './pages/Restricted'
import { GenericNotFound } from './pages/InvalidUrl'
import { CryptoContent } from './pages/TradeV3/TradeContainer'
import useBlacklisted from './utils/useBlacklisted'
import { Launchpad } from './pages/NFTs/launchpad/Launchpad'
import { Creator } from './pages/NFTs/CreatorPage/Creator'
import { AdminWrapper } from './pages/NFTs/adminPage/components/AdminWrapper'
import { AnalyticsWrapper } from './pages/Analytics/AnalyticsWrapper'
import { TraderProvider } from './context/trader_risk_group'

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
              <Swap />
            </Route>
            <Route path="/trade">
              {blacklisted ? (
                <Restricted />
              ) : (
                <PriceFeedProvider>
                  <TradeHistoryProvider>
                    <OrderProvider>
                      <TraderProvider>
                        <OrderBookProvider>
                          <CryptoContent />
                        </OrderBookProvider>
                      </TraderProvider>
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
              <Farm />
            </Route>
            <Route exact path="/analytics">
              <AnalyticsWrapper />
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
