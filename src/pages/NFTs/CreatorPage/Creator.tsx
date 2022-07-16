import React, { FC } from 'react'
import { Switch, useRouteMatch, Route } from 'react-router-dom'
import { NFTCreatorProvider } from '../../../context/nft_creator'
import { CreatorWrapper } from './components/CreatorWrapper'

export const Creator: FC = () => {
  const { path } = useRouteMatch()
  return (
    <Switch>
      <Route exact path="/NFTs/Creator/:walletAddress">
        <NFTCreatorProvider>
          <CreatorWrapper />
        </NFTCreatorProvider>
      </Route>
    </Switch>
  )
}
