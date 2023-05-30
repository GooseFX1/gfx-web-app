import React, { FC } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { AppLayout } from './layouts'
import { Farm, Swap, ComingSoon } from './pages'
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
  PriceFeedFarmProvider,
  AccountsProvider,
  TokenRegistryProvider,
  RewardToggleProvider,
  CryptoProvider
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
// import { NFTs } from './pages/NFTs/NFTs'
import { TradeAnalyticsWrapper } from './pages/Analytics/trade/TradeAnalyticsWrapper'

export const Router: FC = () => (
  <BrowserRouter>
    {window.location.pathname === '/' && <Redirect from="/" to="/swap" />}
    <TokenRegistryProvider>
      <AccountsProvider>
        <RewardToggleProvider>
          <CryptoProvider>
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
                        <ComingSoon />
                      </Route>
                      <Route exact path="/withdraw">
                        <Farm />
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
  </BrowserRouter>
)
