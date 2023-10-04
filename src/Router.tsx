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
  CryptoProvider,
  useDarkMode
} from './context'

const GenericNotFound = lazy(() => import('./pages/InvalidUrl'))
const CryptoContent = lazy(() => import('./pages/TradeV3/TradeContainer'))
const Creator = lazy(() => import('./pages/NFTs/CreatorPage/Creator'))
const AdminWrapper = lazy(() => import('./pages/NFTs/adminPage/components/AdminWrapper'))
const AnalyticsWrapper = lazy(() => import('./pages/Analytics/AnalyticsWrapper'))
const NFTAgg = lazy(() => import('./pages/NFTs/NFTAgg'))
const TradeAnalyticsWrapper = lazy(() => import('./pages/Analytics/trade/TradeAnalyticsWrapper'))
const LeaderBoard = lazy(() => import('./pages/Stats/LeaderBoard'))
const Farm = lazy(() => import('./pages/FarmV3/Farm'))
import { TraderProvider } from './context/trader_risk_group'
import { StatsProvider } from './context/stats'
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas'

function PageLoader() {
  const { mode } = useDarkMode()
  const { RiveComponent } = useRive({
    src: `/rive/pageLoader_${mode}.riv`,
    autoplay: true,
    stateMachines: ['State Machine 1'],
    layout: new Layout({
      fit: Fit.Cover,
      alignment: Alignment.Center
    })
  })

  return (
    <div
      style={{
        flex: '1',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: 'calc(100dvh - 56px)'
      }}
    >
      <div style={{ width: '500px', height: '500px' }}>
        <RiveComponent />
      </div>
    </div>
  )
}

export const Router: FC = () => (
  <BrowserRouter>
    {window.location.pathname === '/' && (
      <Redirect from="/" to={{ search: window.location.search, pathname: '/trade' }} />
    )}
    <TokenRegistryProvider>
      <AccountsProvider>
        <RewardToggleProvider>
          <CryptoProvider>
            <NFTDetailsProvider>
              <NFTAggregatorProvider>
                <NavCollapseProvider>
                  <AppLayout>
                    <Suspense fallback={<PageLoader />}>
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
                    </Suspense>
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
