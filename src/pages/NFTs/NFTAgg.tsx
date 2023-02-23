import React, { ReactElement } from 'react'
import { Route, Switch, useRouteMatch } from 'react-router-dom'
import styled from 'styled-components'
import { NFTAggregatorProvider, NFTDetailsProvider, NFTProfileProvider, useNavCollapse } from '../../context'
import CollectionV2 from './Collection/CollectionV2'
import NFTLandingPageV2 from './Home/NFTLandingPageV2'
import { Profile } from './Profile'

const BODY_NFT = styled.div<{ $navCollapsed: boolean }>`
  position: relative;
  width: 100vw;
  min-height: 100vh;
  overflow-y: hidden;
  overflow-x: hidden;
  padding-top: calc(80px - ${({ $navCollapsed }) => ($navCollapsed ? '80px' : '0px')});
  * {
    font-family: Montserrat;
  }
`
const NFTAgg = (): ReactElement => {
  const { isCollapsed } = useNavCollapse()
  const { path } = useRouteMatch()

  return (
    <BODY_NFT $navCollapsed={isCollapsed}>
      <NFTDetailsProvider>
        <NFTAggregatorProvider>
          <NFTProfileProvider>
            <Switch>
              <Route exact path={path}>
                <NFTLandingPageV2 />
              </Route>
              <Route exact path="/NFTAgg/collection/:collectionName">
                <CollectionV2 />
              </Route>
              <Route exact path={['/NFTAgg/profile', '/NFTAgg/profile/:userAddress']}>
                <Profile />
              </Route>
            </Switch>
          </NFTProfileProvider>
        </NFTAggregatorProvider>
      </NFTDetailsProvider>
    </BODY_NFT>
  )
}

export default NFTAgg
