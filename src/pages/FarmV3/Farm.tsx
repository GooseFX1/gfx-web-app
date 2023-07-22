/* eslint-disable */
import { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { FarmHeader } from './FarmHeader'
import { useConnectionConfig, usePriceFeedFarm } from '../../context'
import 'styled-components/macro'
import { FarmTable } from './FarmTable'
import { Faqs } from './Faqs'

const WRAPPER = styled.div`
  ${tw`py-5 px-[30px] dark:bg-black-1 bg-grey-5 sm:pt-4 sm:pb-[30px] sm:pl-[15px] sm:pr-0`}
  * {
    font-family: Montserrat;
  }
  ${({ theme }) => theme.customScrollBar('0px')};
`

export const Farm: FC = () => {
  const [filter, setFilter] = useState<string>('')
  const { setEndpointName, network } = useConnectionConfig()
  const { refreshTokenData } = usePriceFeedFarm()

  // initial load of all the prices
  useEffect(() => {
    refreshTokenData()
  }, [])
  return (
    <WRAPPER>
      <FarmHeader />
      <FarmTable />
      <Faqs />
    </WRAPPER>
  )
}
