import React, { FC } from 'react'
import { useRouteMatch, Route, Switch } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { SingleCollection } from './pages/SingleCollection'
import { NFTLaunchpadProvider, NFTLPSelectedProvider } from '../../../context/nft_launchpad'

export const Launchpad: FC = () => {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <Route exact path={path}>
        <NFTLaunchpadProvider>
          <LandingPage />
        </NFTLaunchpadProvider>
      </Route>
      <Route exact path="/NFTs/launchpad/:urlName">
        <NFTLPSelectedProvider>
          <SingleCollection />
        </NFTLPSelectedProvider>
      </Route>
    </Switch>
  )
}
