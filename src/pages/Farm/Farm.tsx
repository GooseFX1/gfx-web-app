import React, { FC, useState, useEffect } from 'react'
import styled from 'styled-components'
import { logEvent } from 'firebase/analytics'
import analytics from '../../analytics'
import { TableList } from './TableList'
import { FarmHeader } from './FarmHeader'
import { useNavCollapse, FarmProvider, useConnectionConfig, ENDPOINTS, PriceFeedFarmProvider } from '../../context'
import { notify, checkMobile } from '../../utils'

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

  @media (max-width: 500px){
    padding-left: 0px;
    padding-right: 0px;
  }
`

const BODY = styled.div<{ $navCollapsed: boolean }>`
  height: calc(85vh + ${({ $navCollapsed }) => ($navCollapsed ? '80px' : '0px')});
  padding: ${({ theme }) => theme.margin(8)};
  padding-top: 43px !important;
  padding-bottom: 0px !important;

  @media (max-width: 500px){
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 17px !important;
  }
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
        <PriceFeedFarmProvider>
          <BODY $navCollapsed={isCollapsed}>
            <FarmHeader onFilter={onFilter} />
            <TableList filter={filter} />
          </BODY>
        </PriceFeedFarmProvider>
      </FarmProvider>
    </WRAPPER>
  )
}
