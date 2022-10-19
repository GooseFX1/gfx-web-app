import React, { FC, useState, useEffect } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { FarmHeader } from './FarmHeader'
import { useNavCollapse, FarmProvider, useConnectionConfig, ENDPOINTS, PriceFeedFarmProvider } from '../../context'
import { notify, checkMobile } from '../../utils'
import { logData } from '../../api'
import CustomTableList from './CustomTableList'
import { Banner } from '../../components/Banner'
import { GFX_LINK } from '../../styles'

const WRAPPER = styled.div<{ $navCollapsed: boolean }>`
  ${tw`sm:px-0 relative flex flex-col w-screen px-6 overflow-y-auto overflow-x-hidden`}
  padding-top: calc(80px - ${({ $navCollapsed }) => ($navCollapsed ? '80px' : '0px')});
  color: ${({ theme }) => theme.text1};
  * {
    font-family: Montserrat;
  }
  ${({ theme }) => theme.customScrollBar('0px')};
  @media (max-width: 500px) {
    padding-left: 0px;
    padding-right: 0px;
  }
`

const BODY = styled.div<{ $navCollapsed: boolean }>`
  ${tw`sm:px-0 sm:!pt-[17px] sm:h-full p-16 !pt-[43px] !pb-0`}
  padding: ${({ theme }) => theme.margin(8)};
  padding-top: 43px !important;
  padding-bottom: 0px !important;
  @media (max-width: 500px) {
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 17px !important;
  }
`

const BETA_BANNER = styled.div`
  ${tw`fixed left-[42px] bottom-[42px]`}
  z-index: 10;
`

export const Farm: FC = () => {
  //eslint-disable-next-line
  const [filter, setFilter] = useState<string>('')
  const { isCollapsed } = useNavCollapse()
  const { setEndpoint, network } = useConnectionConfig()
  const [betaBanner, setBetaBanner] = useState<boolean>(true)

  useEffect(() => {
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
            <CustomTableList />
            {betaBanner && !checkMobile() && (
              <BETA_BANNER>
                <Banner
                  title="SSL Beta Testing"
                  support={
                    <span>
                      There may be significant APY fluctuations while SSL v1 pools are in testing phase. We are
                      implementing improvements for v2 coming soon. Deposit at your own risk. For more information
                      please visit{' '}
                      <GFX_LINK href="https://docs.goosefx.io" target="_blank" rel="noreferrer" fontSize={12}>
                        docs.goosefx.io
                      </GFX_LINK>
                    </span>
                  }
                  iconFileName={'info-icon.svg'}
                  handleDismiss={setBetaBanner}
                />
              </BETA_BANNER>
            )}
          </BODY>
        </PriceFeedFarmProvider>
      </FarmProvider>
    </WRAPPER>
  )
}
