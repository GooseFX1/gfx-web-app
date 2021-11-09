import React, { FC } from 'react'
import styled from 'styled-components'
import NFTHome from './Home/NFTHome'
import { MyCreatedNFT } from './CreateNFT'
import { Profile } from './Profile'
import { Collection } from './Collection'
import { LiveAuctionNFT } from './LiveAuctionNFT'
import { useRouteMatch, Route, Switch } from 'react-router-dom'
import { NFTDetailsProvider } from '../../context'

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
    <WRAPPER>
      <BODY_NFT>
        <Switch>
          <Route exact path={path}>
            <NFTHome />
          </Route>
          <Route exact path="/NFTs/profile">
            <SCROLLING_CONTENT>
              <Profile />
            </SCROLLING_CONTENT>
          </Route>
          <Route exact path="/NFTs/profile/my-created-NFT">
            <SCROLLING_CONTENT>
              <MyCreatedNFT />
            </SCROLLING_CONTENT>
          </Route>
        </Switch>
      </BODY_NFT>
    </WRAPPER>
  )
}
