import React, { FC } from 'react'
import styled from 'styled-components'

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
  height: 686px;
  border-radius: 20px;
  margin-top: 60px;
  margin-bottom: 60px;
  box-shadow: 0 7px 15px 9px rgba(13, 13, 13, 0.25);
  background-color: ${({ theme }) => theme.bg4};
  position: relative;
  display: flex;
  flex-direction: column;
`

const NFTWrapper: FC<{ children: any }> = ({ children }) => {
  return (
    <WRAPPER>
      <BODY_NFT>{children}</BODY_NFT>
    </WRAPPER>
  )
}

export default NFTWrapper
