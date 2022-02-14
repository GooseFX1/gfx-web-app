import React, { useEffect, FC } from 'react'
import { ILocationState } from '../../types/app_params.d'
import { useRouteMatch, Route, Switch, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import NFTLandingPage from './Home/NFTHome'
import { MyCreatedNFT } from './CreateNFT'
import { NFTDetails } from './NFTDetails'
import { Collectible } from './Collectible'
import { UpLoadNFT } from './Collectible/UpLoadNFT'
import { SellNFT } from './Collectible/SellNFT'
import { Profile } from './Profile'
import { Explore } from './Profile/Explore'
import { Collection } from './Collection/Collection'
import { LiveAuctionNFT } from './LiveAuctionNFT'
import { FixedPriceNFT } from './FixedPriceNFT'
import { OpenBidNFT } from './OpenBidNFT'
import { OverlayProvider } from '../../context/overlay'
import {
  CryptoProvider,
  NFTProfileProvider,
  NFTCollectionProvider,
  NFTDetailsProvider,
  useNavCollapse,
  ENDPOINTS,
  useConnectionConfig
} from '../../context'
import { notify } from '../../utils'

const BODY_NFT = styled.div<{ $navCollapsed: boolean }>`
  position: relative;
  width: 100vw;
  height: calc(100vh - ${({ $navCollapsed }) => ($navCollapsed ? '80px' : '80px')});
  overflow-y: scroll;
  overflow-x: hidden;
  padding-top: calc(80px - ${({ $navCollapsed }) => ($navCollapsed ? '80px' : '0px')});

  * {
    font-family: Montserrat;
  }
  ${({ theme }) => theme.customScrollBar('6px')};
`

const SCROLLING_OVERLAY = styled.div`
  overflow-y: overlay;
  overflow-x: hidden;
`

export const NFTs: FC = () => {
  const { isCollapsed } = useNavCollapse()
  const location = useLocation<ILocationState>()
  const { path } = useRouteMatch()
  const { endpoint, setEndpoint } = useConnectionConfig()

  useEffect(() => {
    // if (location.pathname === '/NFTs/create-single' && endpoint !== ENDPOINTS[1].endpoint) {
    //   notify({ message: `Switched to ${ENDPOINTS[1].network}` })
    //   setEndpoint(ENDPOINTS[1].endpoint)
    // } else
    if (endpoint !== ENDPOINTS[1].endpoint) {
      setEndpoint(ENDPOINTS[1].endpoint)
      notify({ message: `Switched to ${ENDPOINTS[1].network}` })
    }
  }, [location])

  return (
    <OverlayProvider>
      <CryptoProvider>
        <NFTProfileProvider>
          <NFTCollectionProvider>
            <NFTDetailsProvider>
              <BODY_NFT $navCollapsed={isCollapsed}>
                <Switch>
                  <Route exact path={path}>
                    <NFTLandingPage />
                  </Route>
                  <Route exact path={['/NFTs/profile', '/NFTs/profile/:userId']}>
                    <Profile />
                  </Route>
                  <Route exact path="/NFTs/profile/explore">
                    <Explore />
                  </Route>
                  <Route exact path="/NFTs/collection/:collectionId">
                    <Collection />
                  </Route>
                  <Route exact path={['/NFTs/details', '/NFTs/details/:nftMintAddress']}>
                    <NFTDetails />
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
                    <SCROLLING_OVERLAY>
                      <OpenBidNFT />
                    </SCROLLING_OVERLAY>
                  </Route>
                  <Route exact path="/NFTs/create">
                    <Collectible />
                  </Route>
                  <Route exact path="/NFTs/create-single">
                    <UpLoadNFT />
                  </Route>
                  <Route exact path="/NFTs/sell/:nftMintAddress">
                    <SellNFT />
                  </Route>
                </Switch>
              </BODY_NFT>
            </NFTDetailsProvider>
          </NFTCollectionProvider>
        </NFTProfileProvider>
      </CryptoProvider>
    </OverlayProvider>
  )
}
