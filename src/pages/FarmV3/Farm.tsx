import { FC, useEffect } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { FarmHeader } from './FarmHeader'
import { usePriceFeedFarm } from '../../context'
import 'styled-components/macro'
import { FarmTable } from './FarmTable'
import { Faqs } from './Faqs'
import { SSLProvider } from '../../context'

const WRAPPER = styled.div`
  ${tw`p-5 dark:bg-black-1 bg-grey-5 sm:pt-3.75 sm:pb-3.75 sm:pl-2.5 sm:pr-0 h-[calc(100vh - 56px)] overflow-auto`}
  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  & {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  ${({ theme }) => theme.customScrollBar('0px')};
`

const Farm: FC = () => {
  const { refreshTokenData } = usePriceFeedFarm()

  // initial load of all the prices
  useEffect(() => {
    refreshTokenData()
  }, [])

  return (
    <SSLProvider>
      <WRAPPER>
        <FarmHeader />
        <FarmTable />
        <Faqs />
      </WRAPPER>
    </SSLProvider>
  )
}
export default Farm
