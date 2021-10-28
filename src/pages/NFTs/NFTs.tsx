import React, { FC } from 'react'
import styled from 'styled-components'
import HeaderNFT from './HeaderNFT'
import NFTCarousel from './NFTCarousel'
import NFTFooter from './NFTFooter'
import { Profile } from './Profile/Profile'
import { useRouteMatch, Route, Switch } from 'react-router-dom'

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
  width: 90%;
  height: 686px;
  border-radius: 20px;
  margin-top: 60px;
  margin-bottom: 60px;
  box-shadow: 0 7px 15px 9px rgba(13, 13, 13, 0.25);
  background-color: ${({ theme }) => theme.bg3};
  position: relative;
  display: flex;
  flex-direction: column;
`

const SCROLLING_CONTENT = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
`

export const NFTs: FC = () => {
  const { path } = useRouteMatch()
  return (
    <WRAPPER>
      <BODY_NFT>
        <Switch>
          <Route exact path={path}>
            <>
              <HeaderNFT />
              <SCROLLING_CONTENT>
                <NFTCarousel showTopArrow isLaunch />
                <NFTCarousel />
                <NFTFooter />
              </SCROLLING_CONTENT>
            </>
          </Route>
          <Route exact path="/NFTs/profile">
            <SCROLLING_CONTENT>
              <Profile />
            </SCROLLING_CONTENT>
          </Route>
        </Switch>
      </BODY_NFT>
    </WRAPPER>
  )
}
