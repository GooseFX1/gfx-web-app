import React, { FC, lazy, Suspense } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { AppLayout } from './layouts'
import {
  NavCollapseProvider,
  PriceFeedProvider,
  NFTAdminProvider,
  OrderBookProvider,
  NFTDetailsProvider,
  NFTAggregatorProvider,
  NFTProfileProvider,
  NFTCollectionProvider,
  PriceFeedFarmProvider,
  AccountsProvider,
  TokenRegistryProvider,
  RewardToggleProvider,
  OrderProvider,
  CryptoProvider
} from './context'

const GenericNotFound = lazy(() => import('./pages/InvalidUrl'))
const CryptoContent = lazy(() => import('./pages/TradeV3/TradeContainer'))
const Creator = lazy(() => import('./pages/NFTs/CreatorPage/Creator'))
const AdminWrapper = lazy(() => import('./pages/NFTs/adminPage/components/AdminWrapper'))
const AnalyticsWrapper = lazy(() => import('./pages/Analytics/AnalyticsWrapper'))
const NFTAgg = lazy(() => import('./pages/NFTs/NFTAgg'))
const TradeAnalyticsWrapper = lazy(() => import('./pages/Analytics/trade/TradeAnalyticsWrapper'))
const LeaderBoard = lazy(() => import('./pages/Stats/LeaderBoard'))
const Farm = lazy(() => import('./pages/Farm/Farm'))
const FarmV2 = lazy(() => import('./pages/FarmV3/Farm'))
import { TraderProvider } from './context/trader_risk_group'
import { StatsProvider } from './context/stats'

export const Router: FC = () => (
  <BrowserRouter>
    <Suspense fallback={<div>LOADING</div>}>
      {window.location.pathname === '/' && <Redirect from="/" to="/trade" />}
      <TokenRegistryProvider>
        <AccountsProvider>
          <RewardToggleProvider>
            <CryptoProvider>
              <NFTDetailsProvider>
                <NFTAggregatorProvider>
                  <NavCollapseProvider>
                    <AppLayout>
                      <Switch>
                        {/* <Route exact path="/swap/:tradePair?">
                        <Swap />
                      </Route> */}
                        <Route path="/trade">
                          <PriceFeedProvider>
                            <OrderProvider>
                              <TraderProvider>
                                <OrderBookProvider>
                                  <CryptoContent />
                                </OrderBookProvider>
                              </TraderProvider>
                            </OrderProvider>
                          </PriceFeedProvider>
                        </Route>
                        <Route exact path="/leaderboard">
                          <StatsProvider>
                            <LeaderBoard />
                          </StatsProvider>
                        </Route>
                        <Route path="/NFTs/Creator">
                          <Creator />
                        </Route>
                        <Route path="/NFTs/admin">
                          <NFTAdminProvider>
                            <AdminWrapper />
                          </NFTAdminProvider>
                        </Route>
                        {/* <Route path="/nfts-v1">
                        <NFTProfileProvider>
                          <NFTs />
                        </NFTProfileProvider>
                      </Route> */}
                        <Route path="/nfts">
                          <NFTProfileProvider>
                            <NFTCollectionProvider>
                              <PriceFeedFarmProvider>
                                <NFTAgg />
                              </PriceFeedFarmProvider>
                            </NFTCollectionProvider>
                          </NFTProfileProvider>
                        </Route>
                        <Route exact path="/farm">
                          <PriceFeedFarmProvider>
                            <Farm />
                          </PriceFeedFarmProvider>
                        </Route>
                        <Route exact path="/withdraw">
                          <FarmV2 />
                        </Route>
                        <Route exact path="/analytics">
                          <AnalyticsWrapper />
                        </Route>
                        <Route exact path="/analytics/trade">
                          <TradeAnalyticsWrapper />
                        </Route>
                        <Route>
                          <GenericNotFound />
                        </Route>
                      </Switch>
                    </AppLayout>
                  </NavCollapseProvider>
                </NFTAggregatorProvider>
              </NFTDetailsProvider>
            </CryptoProvider>
          </RewardToggleProvider>
        </AccountsProvider>
      </TokenRegistryProvider>
    </Suspense>
  </BrowserRouter>
)
