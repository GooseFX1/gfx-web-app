import React, { FC, useState, useEffect } from 'react'
import styled from 'styled-components'
import { logEvent } from 'firebase/analytics'
import analytics from '../../analytics'
import { TableList } from './TableList'
import { FarmHeader } from './FarmHeader'
import { useNavCollapse, PriceFeedProvider, FarmProvider, useConnectionConfig, ENDPOINTS } from '../../context'
import { notify } from '../../utils'

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

const BODY = styled.div<{ $navCollapsed: boolean }>`
  min-height: calc(85vh + ${({ $navCollapsed }) => ($navCollapsed ? '80px' : '0px')});
  padding: ${({ theme }) => theme.margin(8)};
`

export const Farm: FC = () => {
  const [filter, setFilter] = useState<string>('')
  const { isCollapsed } = useNavCollapse()
  const { setEndpoint, network } = useConnectionConfig()

  useEffect(() => {
    const an = analytics()
    an !== null &&
      logEvent(an, 'screen_view', {
        firebase_screen: 'Yield Farm',
        firebase_screen_class: 'load'
      })

    if (network === 'devnet') {
      notify({ message: 'Switched to mainnet' })
      setEndpoint(ENDPOINTS[0].endpoint)
    }
  }, [])

  const onFilter = (val) => {
    // if (val === 'All pools') {
    //   setFilter('')
    //   return
    // }
    // const tmp = JSON.parse(JSON.stringify(supportedData))
    // const filteredData = tmp.filter((item) => item.type === val)
    // setFilter('')
  }

  return (
    <WRAPPER $navCollapsed={isCollapsed}>
      <FarmProvider>
        <PriceFeedProvider>
          <BODY $navCollapsed={isCollapsed}>
            <FarmHeader onFilter={onFilter} />
            <TableList filter={filter} />
          </BODY>
        </PriceFeedProvider>
      </FarmProvider>
    </WRAPPER>
  )
}
