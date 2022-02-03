import React, { useEffect, FC } from 'react'
import { useRouteMatch, Route, Switch } from 'react-router-dom'
import styled from 'styled-components'
import NFTLandingPage from './Home/NFTHome'
import { MyCreatedNFT } from './CreateNFT'
import { Collectible } from './Collectible'
import { UpLoadNFT } from './Collectible/UpLoadNFT'
import { LiveAuction } from './Collectible/LiveAuction'
import { Profile } from './Profile'
import { Explore } from './Profile/Explore'
import { Collection } from './Collection'
import { LiveAuctionNFT } from './LiveAuctionNFT'
import { FixedPriceNFT } from './FixedPriceNFT'
import { OpenBidNFT } from './OpenBidNFT'
import { OverlayProvider } from '../../context/overlay'
import {
  NFTProfileProvider,
  NFTCollectionProvider,
  NFTDetailsProvider,
  ENDPOINTS,
  useConnectionConfig
} from '../../context'
import { notify } from '../../utils'

const WRAPPER = styled.div`
  color: ${({ theme }) => theme.text1};
  display: flex;
  flex: 1;
  position: relative;
  justify-content: center;
  min-height: 0px;
  min-width: 0px;
  font-family: Montserrat;
`

const BODY_NFT = styled.div`
  width: calc(100% - 8vw);
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const SCROLLING_CONTENT = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
`

const SCROLLING_OVERLAY = styled.div`
  overflow-y: overlay;
  overflow-x: hidden;
`

export const NFTs: FC = () => {
  const { path } = useRouteMatch()
  const { endpoint, setEndpoint } = useConnectionConfig()

  useEffect(() => {
    if (endpoint !== ENDPOINTS[1].endpoint) {
      notify({ message: `Switched to ${ENDPOINTS[1].network}` })
      setEndpoint(ENDPOINTS[1].endpoint)
    }
  }, [endpoint, setEndpoint])

  return (
    <OverlayProvider>
      <WRAPPER>
        <NFTProfileProvider>
          <NFTCollectionProvider>
            <NFTDetailsProvider>
              <BODY_NFT>
                <Switch>
                  <Route exact path={path}>
                    <NFTLandingPage />
                  </Route>
                  <Route exact path={['/NFTs/profile', '/NFTs/profile/:userId']}>
                    <SCROLLING_OVERLAY>
                      <Profile />
                    </SCROLLING_OVERLAY>
                  </Route>
                  <Route exact path="/NFTs/profile/explore">
                    <SCROLLING_CONTENT>
                      <Explore />
                    </SCROLLING_CONTENT>
                  </Route>
                  <Route exact path="/NFTs/collection/:collectionId">
                    <SCROLLING_OVERLAY>
                      <Collection />
                    </SCROLLING_OVERLAY>
                  </Route>
                  <Route exact path="/NFTs/live-auction/:nftId">
                    <SCROLLING_OVERLAY>
                      <LiveAuctionNFT />
                    </SCROLLING_OVERLAY>
                  </Route>
                  <Route exact path="/NFTs/fixed-price/:nftId">
                    <SCROLLING_OVERLAY>
                      <FixedPriceNFT />
                    </SCROLLING_OVERLAY>
                  </Route>
                  <Route exact path="/NFTs/open-bid/:nftId">
                    <SCROLLING_CONTENT>
                      <OpenBidNFT />
                    </SCROLLING_CONTENT>
                  </Route>
                  <Route exact path="/NFTs/create">
                    <Collectible />
                  </Route>
                  <Route exact path="/NFTs/create-single">
                    <SCROLLING_OVERLAY>
                      <UpLoadNFT />
                    </SCROLLING_OVERLAY>
                  </Route>
                  <Route exact path="/NFTs/sell">
                    <SCROLLING_OVERLAY>
                      <LiveAuction />
                    </SCROLLING_OVERLAY>
                  </Route>
                </Switch>
              </BODY_NFT>
            </NFTDetailsProvider>
          </NFTCollectionProvider>
        </NFTProfileProvider>
      </WRAPPER>
    </OverlayProvider>
  )
}
