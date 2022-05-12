import React, { FC } from 'react'
import { useRouteMatch, Route, Switch, useLocation, useParams } from 'react-router-dom'
import { LandingPage } from './pages/LandingPage'
import { SingleCollection } from './pages/SingleCollection'

export const Launchpad: FC = () => {
  const { path } = useRouteMatch()

  return (
    <Switch>
      <Route exact path={path}>
        <LandingPage />
      </Route>
      <Route exact path="/NFTs/launchpad/:collectionId">
        <SingleCollection />
      </Route>
    </Switch>
  )
}
