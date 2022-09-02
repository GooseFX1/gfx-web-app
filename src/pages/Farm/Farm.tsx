import React, { FC, useState, useEffect } from 'react'
import styled from 'styled-components'
import { logEvent } from 'firebase/analytics'
import analytics from '../../analytics'
import { TableList } from './TableList'
import { FarmHeader } from './FarmHeader'
import { useNavCollapse, FarmProvider, useConnectionConfig, ENDPOINTS, PriceFeedFarmProvider } from '../../context'
import { notify } from '../../utils'
import tw from 'twin.macro'
import { logData } from '../../api'

const WRAPPER = styled.div<{ $navCollapsed: boolean }>`
  ${tw`sm:px-0 relative flex flex-col w-screen px-6 overflow-y-scroll overflow-x-hidden`}
  padding-top: calc(80px - ${({ $navCollapsed }) => ($navCollapsed ? '80px' : '0px')});
  color: ${({ theme }) => theme.text1};
  * {
    font-family: Montserrat;
  }
  ${({ theme }) => theme.customScrollBar('6px')};

  @media (max-width: 500px) {
    padding-left: 0px;
    padding-right: 0px;
  }
`

const BODY = styled.div<{ $navCollapsed: boolean }>`
  ${tw`sm:px-0 sm:!pt-[17px] sm:h-full p-16 !pt-[43px] !pb-0`}
  height: calc(85vh + ${({ $navCollapsed }) => ($navCollapsed ? '80px' : '0px')});
  padding: ${({ theme }) => theme.margin(8)};
  padding-top: 43px !important;
  padding-bottom: 0px !important;

  @media (max-width: 500px) {
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 17px !important;
  }
`

export const Farm: FC = () => {
  //eslint-disable-next-line
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
    logData('farm_page')
    if (network === 'devnet') {
      notify({ message: 'Switched to mainnet' })
      setEndpoint(ENDPOINTS[0].endpoint)
    }
  }, [])

  const onFilter = () => {
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
