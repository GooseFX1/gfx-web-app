import React, { FC } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { AppLayout } from './layouts'
import { Farm, Swap } from './pages'
import {
  NavCollapseProvider,
  OrderProvider,
  PriceFeedProvider,
  TradeHistoryProvider,
  NFTAdminProvider,
  OrderBookProvider,
  NFTDetailsProvider,
  NFTAggregatorProvider,
  NFTProfileProvider,
  NFTCollectionProvider,
  PriceFeedFarmProvider
} from './context'
import { GenericNotFound } from './pages/InvalidUrl'
import { CryptoContent } from './pages/TradeV3/TradeContainer'
import { Launchpad } from './pages/NFTs/launchpad/Launchpad'
import { Creator } from './pages/NFTs/CreatorPage/Creator'
import { AdminWrapper } from './pages/NFTs/adminPage/components/AdminWrapper'
import { AnalyticsWrapper } from './pages/Analytics/AnalyticsWrapper'
import { TraderProvider } from './context/trader_risk_group'
// import NFTLandingPageV2 from './pages/NFTs/Home/NFTLandingPageV2'
import NFTAgg from './pages/NFTs/NFTAgg'
import { NFTs } from './pages/NFTs/NFTs'

export const Router: FC = () => (
  <BrowserRouter>
    {window.location.pathname === '/' && <Redirect from="/" to="/swap" />}
    <NFTDetailsProvider>
      <NFTAggregatorProvider>
        <NavCollapseProvider>
          <AppLayout>
            <Switch>
              <Route exact path="/swap/:tradePair?">
                <Swap />
              </Route>
              <Route path="/trade">
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
              <Route path="/nfts-v1">
                <NFTProfileProvider>
                  <NFTs />
                </NFTProfileProvider>
              </Route>
              <Route path="/nfts">
                <NFTCollectionProvider>
                  <PriceFeedFarmProvider>
                    <NFTProfileProvider>
                      <NFTAgg />
                    </NFTProfileProvider>
                  </PriceFeedFarmProvider>
                </NFTCollectionProvider>
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
      </NFTAggregatorProvider>
    </NFTDetailsProvider>
  </BrowserRouter>
)
