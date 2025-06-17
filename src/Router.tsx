import { CSSProperties, FC, lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
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
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas'
import { Toaster } from 'gfx-component-lib'
import { RewardsProvider } from '@/context/rewardsContext'
import { Swap } from '@/pages/Swap'
import { SwapProvider } from '@/context/newSwap'
import { BoostedRewardsProvider } from './context/boostedRewardsContext'
import { KaminoProvider } from './context/kaminoContext'
const Bridge = lazy(() => import('./pages/Bridge'))
const GenericNotFound = lazy(() => import('./pages/InvalidUrl'))
const Farm = lazy(() => import('./pages/FarmV3/Farm'))
const FarmV4 = lazy(() => import('./pages/FarmV4/Farm'))

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
  GAMMA: '/gamma',
  GAMMA_PORTFOLIO: '/gamma/portfolio'
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
                        <Routes>
                          {window.location.pathname === '/' && (
                            <Route
                              path="/"
                              element={
                                <Navigate
                                  to={{ search: window.location.search, pathname: APP_DEFAULT_ROUTE }}
                                  replace
                                />
                              }
                            />
                          )}
                          <Route path="/bridge" element={<Bridge />} />
                          <Route path="/ssl" element={<Farm />} />
                          <Route path="/ssl/temp-withdraw" element={<Farm />} />
                          <Route
                            path={ROUTES.GAMMA}
                            element={
                              <GammaProvider>
                                <KaminoProvider>
                                  <BoostedRewardsProvider>
                                    <FarmV4 />
                                  </BoostedRewardsProvider>
                                </KaminoProvider>
                              </GammaProvider>
                            }
                          />
                          <Route
                            path={`/gamma/:gammaPoolPair`}
                            element={
                              <GammaProvider>
                                <KaminoProvider>
                                  <BoostedRewardsProvider>
                                    <FarmV4 />
                                  </BoostedRewardsProvider>
                                </KaminoProvider>
                              </GammaProvider>
                            }
                          />
                          <Route
                            path={ROUTES.GAMMA_PORTFOLIO}
                            element={
                              <GammaProvider>
                                <KaminoProvider>
                                  <BoostedRewardsProvider>
                                    <FarmV4 />
                                  </BoostedRewardsProvider>
                                </KaminoProvider>
                              </GammaProvider>
                            }
                          />
                          <Route
                            path={`/gamma/portfolio/:portfolioPoolPair`}
                            element={
                              <GammaProvider>
                                <KaminoProvider>
                                  <BoostedRewardsProvider>
                                    <FarmV4 />
                                  </BoostedRewardsProvider>
                                </KaminoProvider>
                              </GammaProvider>
                            }
                          />
                          <Route
                            path="/swap"
                            element={
                              <SwapProvider>
                                <Swap />
                              </SwapProvider>
                            }
                          />
                          <Route path="*" element={<GenericNotFound />} />
                        </Routes>
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
