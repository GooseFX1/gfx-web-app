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
  ${tw`p-5 dark:bg-black-1 bg-grey-5 sm:pt-3.75 sm:pb-3.75 sm:pl-2.5 sm:pr-0 h-auto overflow-auto`}
  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  & {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }

  ${({ theme }) => theme.customScrollBar('0px')};

  .ant-drawer-content-wrapper {
    ${tw`rounded-tl-half rounded-tr-half`}
  }
  .ant-drawer-content {
    ${tw`rounded-tl-half rounded-tr-half dark:bg-black-2 bg-white`}
  }
`

const Farm: FC = () => {
  const { refreshTokenData } = usePriceFeedFarm()

  // initial load of all the prices
  useEffect(() => {
    refreshTokenData()
  }, [])

  return (
    <SSLProvider>
      <WRAPPER id="farm-container">
        <FarmHeader />
        <FarmTable />
        <Faqs />
      </WRAPPER>
    </SSLProvider>
  )
}
export default Farm
