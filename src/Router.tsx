import React, { FC } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { AppLayout } from './layouts'
import { Farm, Swap, FarmV2 } from './pages'
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
  CryptoProvider,
  OrderProvider
} from './context'
import { GenericNotFound } from './pages/InvalidUrl'
import { CryptoContent } from './pages/TradeV3/TradeContainer'
import { Creator } from './pages/NFTs/CreatorPage/Creator'
import { AdminWrapper } from './pages/NFTs/adminPage/components/AdminWrapper'
import { AnalyticsWrapper } from './pages/Analytics/AnalyticsWrapper'
import { TraderProvider } from './context/trader_risk_group'
import NFTAgg from './pages/NFTs/NFTAgg'
import { TradeAnalyticsWrapper } from './pages/Analytics/trade/TradeAnalyticsWrapper'
import { LeaderBoard } from './pages/Stats/LeaderBoard'
import { StatsProvider } from './context/stats'

export const Router: FC = () => (
  <BrowserRouter>
    {window.location.pathname === '/' && <Redirect from="/" to="/swap" />}
    <TokenRegistryProvider>
      <AccountsProvider>
        <RewardToggleProvider>
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
        </RewardToggleProvider>
      </AccountsProvider>
    </TokenRegistryProvider>
  </BrowserRouter>
)
