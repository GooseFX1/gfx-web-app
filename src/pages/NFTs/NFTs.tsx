import React, { FC } from 'react'
import styled from 'styled-components'
import HeaderNFT from './HeaderNFT'
import NFTCarousel from './NFTCarousel'
import NFTFooter from './NFTFooter'

const WRAPPER = styled.div`
  color: ${({ theme }) => theme.text1};
  display: flex;
  flex: 1;
  position: relative;
  justify-content: center;
  min-height: 0px;
  min-width: 0px;
`

const BODYNFT = styled.div`
  width: 90%;
  height: 686px;
  border-radius: 20px;
  margin: 61px 0;
  box-shadow: 0 7px 15px 9px rgba(13, 13, 13, 0.25);
  background-color: ${({ theme }) => theme.bg4};
  position: relative;
  display: flex;
  flex-direction: column;
`

const ScrollingContent = styled.div`
  overflow-y: scroll;
  overflow-x: hidden;
`

export const NFTs: FC = () => {
  return (
    <WRAPPER>
      <BODYNFT>
        <HeaderNFT />
        <ScrollingContent>
          <NFTCarousel showTopArrow isLaunch />
          <NFTCarousel />
          <NFTFooter />
        </ScrollingContent>
      </BODYNFT>
    </WRAPPER>
  )
}
