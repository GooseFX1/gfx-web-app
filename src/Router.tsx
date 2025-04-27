import { CSSProperties, FC, lazy, Suspense } from 'react'
import { BrowserRouter, Redirect, Route, Switch } from 'react-router-dom'
import { AppLayout } from './layouts'
import {
  AccountsProvider,
  GammaProvider,
  NavCollapseProvider,
  PriceFeedFarmProvider,
  RewardToggleProvider,
  TokenRegistryProvider,
  useConnectionConfig,
  useDarkMode
} from './context'
import { APP_DEFAULT_ROUTE } from './constants'
import Maintenance from './pages/Maintenance'
import { StatsProvider } from './context/stats'
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas'
import { Toaster } from 'gfx-component-lib'
import { RewardsProvider } from '@/context/rewardsContext'
import { Swap } from '@/pages/Swap'
import { SwapProvider } from '@/context/newSwap'
import { BoostedRewardsProvider } from './context/boostedRewardsContext'

const Bridge = lazy(() => import('./pages/Bridge'))
const GenericNotFound = lazy(() => import('./pages/InvalidUrl'))
const AnalyticsWrapper = lazy(() => import('./pages/Analytics/AnalyticsWrapper'))
const SSLAnalyticsDashboard = lazy(() => import('./pages/Analytics/ssl/SSLAnalyticsDashboard'))
const LeaderBoard = lazy(() => import('./pages/Stats/LeaderBoard'))
const Farm = lazy(() => import('./pages/FarmV3/Farm'))
const FarmV4 = lazy(() => import('./pages/FarmV4/Farm'))

const CoinGeckoPairs = lazy(() => import('./pages/Analytics/ssl/SSLPairs'))

const WRAPPER_STYLES: CSSProperties = {
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: 'calc(100dvh - 56px)'
}

const INNER_STYLES: CSSProperties = { width: '500px', height: '500px' }
// route and used in query enabling
export const ROUTES = {
  GAMMA: '/gamma'
} as const

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
    <div style={WRAPPER_STYLES}>
      <div style={INNER_STYLES}>
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
            <NavCollapseProvider>
              <RewardsProvider>
                <PriceFeedFarmProvider>
                  <AppLayout>
                    <Toaster duration={5000} />
                    {isUnderMaintenance ? (
                      <Maintenance />
                    ) : (
                      <Suspense fallback={<PageLoader />}>
                        <Switch>
                          <Route exact path="/bridge">
                            <Bridge />
                          </Route>
                          <Route exact path="/leaderboard">
                            <StatsProvider>
                              <LeaderBoard />
                            </StatsProvider>
                          </Route>
                          <Route exact path={['/ssl', '/ssl/temp-withdraw']}>
                            <Farm />
                          </Route>
                          <Route exact path={[ROUTES.GAMMA, `${ROUTES.GAMMA}/:typeA([^-/]+)-:typeB([^-/]+)`]}>
                            <GammaProvider>
                              <BoostedRewardsProvider>
                                <FarmV4 />
                              </BoostedRewardsProvider>
                            </GammaProvider>
                          </Route>
                          <Route exact path={['/swap']}>
                            <SwapProvider>
                              <Swap />
                            </SwapProvider>
                          </Route>
                          <Route exact path="/analytics">
                            <AnalyticsWrapper />
                          </Route>
                          <Route exact path="/analytics/ssl">
                            <SSLAnalyticsDashboard />
                          </Route>
                          <Route exact path="/analytics/ssl/pairdata">
                            <CoinGeckoPairs />
                          </Route>
                          <Route>
                            <GenericNotFound />
                          </Route>
                        </Switch>
                      </Suspense>
                    )}
                  </AppLayout>
                </PriceFeedFarmProvider>
              </RewardsProvider>
            </NavCollapseProvider>
          </RewardToggleProvider>
        </AccountsProvider>
      </TokenRegistryProvider>
    </BrowserRouter>
  )
}
