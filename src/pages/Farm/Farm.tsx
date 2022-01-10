import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { TableList } from './TableList'
import { FarmHeader } from './FarmHeader'
import { mockDataSource } from './mockData'

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

  overflow-y: scroll;
  overflow-x: scroll;
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
  const [dataSource, setDataSource] = useState(mockDataSource)
  const onFilter = (val) => {
    if (val === 'All pools') {
      setDataSource(mockDataSource)
      return
    }
    const tmp = JSON.parse(JSON.stringify(mockDataSource))
    const filteredData = tmp.filter((item) => item.type === val)
    setDataSource(filteredData)
  }
  return (
    <WRAPPER>
      <div>
        <BODY_NFT>
          <SCROLLING_OVERLAY />
          <meta name="viewport" content="user-scalable=no, width=device-width, initial-scale=1.0" />
          <meta name="apple-mobile-web-app-capable" content="yes" />
          <FarmHeader onFilter={onFilter} />
          <TableList dataSource={dataSource} />
          <SCROLLING_OVERLAY />
        </BODY_NFT>
      </div>
    </WRAPPER>
  )
}
