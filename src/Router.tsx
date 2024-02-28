import React, { FC, lazy, Suspense } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { AppLayout } from './layouts'
import {
  NavCollapseProvider,
  PriceFeedProvider,
  OrderBookProvider,
  PriceFeedFarmProvider,
  AccountsProvider,
  TokenRegistryProvider,
  RewardToggleProvider,
  OrderProvider,
  CryptoProvider,
  useConnectionConfig,
  useDarkMode
} from './context'
import { APP_DEFAULT_ROUTE } from './constants'
import Maintenance from './pages/Maintenance'
const Bridge = lazy(() => import('./pages/Bridge'))

const GenericNotFound = lazy(() => import('./pages/InvalidUrl'))
const CryptoContent = lazy(() => import('./pages/TradeV3/TradeContainer'))
const AnalyticsWrapper = lazy(() => import('./pages/Analytics/AnalyticsWrapper'))
const TradeAnalyticsWrapper = lazy(() => import('./pages/Analytics/trade/TradeAnalyticsWrapper'))
const SSLAnalyticsDashboard = lazy(() => import('./pages/Analytics/ssl/SSLAnalyticsDashboard'))
const LeaderBoard = lazy(() => import('./pages/Stats/LeaderBoard'))
const Farm = lazy(() => import('./pages/FarmV3/Farm'))
import { TraderProvider } from './context/trader_risk_group'
import { StatsProvider } from './context/stats'
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas'
const CoinGeckoPairs = lazy(() => import('./pages/Analytics/ssl/SSLPairs'))
const Account = lazy(() => import('./pages/Account/Account'))

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

export const Router: FC = () => {
  const { isUnderMaintenance } = useConnectionConfig()

  return (
    <BrowserRouter>
      {window.location.pathname === '/' && (
        <Redirect from="/" to={{ search: window.location.search, pathname: APP_DEFAULT_ROUTE }} />
      )}
      <TokenRegistryProvider>
        <AccountsProvider>
          <RewardToggleProvider>
            <CryptoProvider>
              <NavCollapseProvider>
                <RewardsProvider>
                  <AppLayout>
                    {isUnderMaintenance ? (
                      <Maintenance />
                    ) : (
                      <Suspense fallback={<PageLoader />}>
                        <Switch>
                          {/*
                              <Route exact path="/swap/:tradePair?">
                                <Swap />
                              </Route> 
                            */}
                        <Route exact path="/swap">
                          <Bridge />
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
                        <Route exact path={['/farm', '/farm/temp-withdraw']}>
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
                        <Route exact path="/analytics/ssl">
                          <SSLAnalyticsDashboard />
                        </Route>
                        <Route exact path="/analytics/ssl/pairdata">
                          <PriceFeedFarmProvider>
                            <CoinGeckoPairs />
                          </PriceFeedFarmProvider>
                        </Route>
                        <Route exact path="/account">
                          <PriceFeedProvider>
                            <OrderProvider>
                              <TraderProvider>
                                <OrderBookProvider>
                                  <Account />
                                </OrderBookProvider>
                              </TraderProvider>
                            </OrderProvider>
                          </PriceFeedProvider>
                        </Route>
                        <Route>
                          <GenericNotFound />
                        </Route>
                      </Switch>
                    </Suspense>
                  )}
                </AppLayout>
              </RewardsProvider>
              </NavCollapseProvider>
            </CryptoProvider>
          </RewardToggleProvider>
        </AccountsProvider>
      </TokenRegistryProvider>
    </BrowserRouter>
  )
}
