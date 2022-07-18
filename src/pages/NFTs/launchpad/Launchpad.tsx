import React, { FC } from 'react'
import { useRouteMatch, Route, Switch } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { SingleCollection } from './pages/SingleCollection'
import { NFTLaunchpadProvider, NFTLPSelectedProvider, USDCToggleProvider } from '../../../context/nft_launchpad'
import { Whitelist } from './customSC/Whitelist'

export const Launchpad: FC = () => {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <USDCToggleProvider>
        <Route exact path={path}>
          <NFTLaunchpadProvider>
            <LandingPage />
          </NFTLaunchpadProvider>
        </Route>
        <Route path="/NFTs/launchpad/:urlName">
          <NFTLPSelectedProvider>
            <Switch>
              <Route exact path="/NFTs/launchpad/:urlName/whitelist">
                <Whitelist />
              </Route>
              <Route exact path="/NFTs/launchpad/:urlName">
                <SingleCollection />
              </Route>
            </Switch>
          </NFTLPSelectedProvider>
        </Route>
      </USDCToggleProvider>
    </Switch>
  )
}
