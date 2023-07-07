/* eslint-disable */
import { FC, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { FarmHeader } from './FarmHeader'
import { useConnectionConfig } from '../../context'
import 'styled-components/macro'
import { FarmTable } from './FarmTable'
import { Faqs } from './Faqs'

const WRAPPER = styled.div`
  ${tw`py-5 px-[30px] dark:bg-black-1 bg-grey-5`}
  * {
    font-family: Montserrat;
  }
  ${({ theme }) => theme.customScrollBar('0px')};
`

export const Farm: FC = () => {
  const [filter, setFilter] = useState<string>('')
  const { setEndpointName, network } = useConnectionConfig()

  return (
    <WRAPPER>
      <FarmHeader />
      <FarmTable />
      <Faqs />
    </WRAPPER>
  )
}
