import React, { FC } from 'react'
import styled from 'styled-components'
import { TableList } from './TableList'
import { FarmHeader } from './FarmHeader'

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
  height: 100vh;
  width: 100vw;
  ${({ theme }) => theme.largeBorderRadius};
  box-shadow: 0 7px 15px 9px rgba(13, 13, 13, 0.25);
  background-color: ${({ theme }) => theme.bg3};
  position: relative;
  display: flex;
  flex-direction: column;
  overflow-x: overlay;
  background: #181818;
`

const SCROLLING_OVERLAY = styled.div`
  overflow-y: overlay;
  overflow-x: overlay;
  width: 101%;
  position: relative;
  overflow: overlay;
`

export const Farm: FC = () => {
  return (
    <WRAPPER>
      <div>
        <BODY_NFT>
          <SCROLLING_OVERLAY />
          <FarmHeader />
          <TableList />
          <SCROLLING_OVERLAY />
        </BODY_NFT>
      </div>
    </WRAPPER>
  )
}
