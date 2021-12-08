import React, { FC } from 'react'
import styled from 'styled-components'
import NFTHome from './Home/NFTHome'
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
import { useRouteMatch, Route, Switch } from 'react-router-dom'
import { NFTDetailsProvider } from '../../context'
import { OverlayProvider } from '../../context/overlay'

const WRAPPER = styled.div`
  color: ${({ theme }) => theme.text1};
  display: flex;
  flex: 1;
  position: relative;
  justify-content: center;
  min-height: 0px;
  min-width: 0px;
`

const BODY_NFT = styled.div`
  width: calc(100% - 8vw);
  height: 71vh;
  ${({ theme }) => theme.largeBorderRadius};
  box-shadow: 0 7px 15px 9px rgba(13, 13, 13, 0.25);
  background-color: ${({ theme }) => theme.bg3};
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const SCROLLING_CONTENT = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
  height: 200vh;
`

export const NFTs: FC = () => {
  const { path } = useRouteMatch()

  return (
    <OverlayProvider>
      <WRAPPER>
        <BODY_NFT>
          <NFTDetailsProvider>
            <Switch>
              <Route exact path={path}>
                <NFTHome />
              </Route>
              <Route exact path="/NFTs/profile">
                <SCROLLING_CONTENT>
                  <Profile />
                </SCROLLING_CONTENT>
              </Route>
              <Route exact path="/NFTs/profile/explore">
                <SCROLLING_CONTENT>
                  <Explore />
                </SCROLLING_CONTENT>
              </Route>
              <Route exact path="/NFTs/profile/my-created-NFT">
                <SCROLLING_CONTENT>
                  <MyCreatedNFT type="created" />
                </SCROLLING_CONTENT>
              </Route>
              <Route exact path="/NFTs/profile/my-own-NFT">
                <SCROLLING_CONTENT>
                  <MyCreatedNFT type="own" />
                </SCROLLING_CONTENT>
              </Route>
              <Route exact path="/NFTs/profile/mint-NFT">
                <SCROLLING_CONTENT>
                  <MyCreatedNFT type="mint" />
                </SCROLLING_CONTENT>
              </Route>
              <Route exact path="/NFTs/collection">
                <SCROLLING_CONTENT>
                  <Collection />
                </SCROLLING_CONTENT>
              </Route>
              <Route exact path="/NFTs/live-auction/:id">
                <SCROLLING_CONTENT>
                  <LiveAuctionNFT />
                </SCROLLING_CONTENT>
              </Route>
              <Route exact path="/NFTs/fixed-price/:id">
                <SCROLLING_CONTENT>
                  <FixedPriceNFT />
                </SCROLLING_CONTENT>
              </Route>
              <Route exact path="/NFTs/open-bid/:id">
                <SCROLLING_CONTENT>
                  <OpenBidNFT />
                </SCROLLING_CONTENT>
              </Route>
              <Route exact path="/NFTs/create-a-collectible">
                <Collectible />
              </Route>
              <Route exact path="/NFTs/single-upload-your-file">
                <SCROLLING_CONTENT>
                  <UpLoadNFT />
                </SCROLLING_CONTENT>
              </Route>
              <Route exact path="/NFTs/live-auction">
                <SCROLLING_CONTENT>
                  <LiveAuction />
                </SCROLLING_CONTENT>
              </Route>
            </Switch>
          </NFTDetailsProvider>
        </BODY_NFT>
      </WRAPPER>
    </OverlayProvider>
  )
}
