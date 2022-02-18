import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { TableList } from './TableList'
import { FarmHeader } from './FarmHeader'
import { mockDataSource } from './mockData'
import { useNavCollapse } from '../../context'

const WRAPPER = styled.div<{ $navCollapsed: boolean }>`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100vw;

  padding-top: calc(80px - ${({ $navCollapsed }) => ($navCollapsed ? '80px' : '0px')});
  padding-left: ${({ theme }) => theme.margin(3)};
  padding-right: ${({ theme }) => theme.margin(3)};
  color: ${({ theme }) => theme.text1};
  overflow-y: scroll;
  overflow-x: hidden;

  * {
    font-family: Montserrat;
  }

  ${({ theme }) => theme.customScrollBar('6px')};
`

const BODY = styled.div`
  padding: ${({ theme }) => theme.margin(8)};
`

export const Farm: FC = () => {
  const [dataSource, setDataSource] = useState(mockDataSource)
  const { isCollapsed } = useNavCollapse()

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
    <WRAPPER $navCollapsed={isCollapsed}>
      <BODY>
        <FarmHeader onFilter={onFilter} />
        <TableList dataSource={dataSource} />
      </BODY>
    </WRAPPER>
  )
}
