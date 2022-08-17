import React from 'react'
import styled from 'styled-components'
import Lottie from 'lottie-react'
import MorePools from '../../animations/MorePools_dark.json'
import MorePoolsLite from '../../animations/MorePools_lite.json'
import { useDarkMode } from '../../context'
import tw from 'twin.macro'

const CONTAINER = styled.div`
  ${tw`flex flex-col items-center w-full min-h-[30vh]`}
  background: ${({ theme }) => theme.bg17};
`
const MorePoolImg = styled.div`
  .animation-404 {
    ${tw`w-[188px] h-[120px] mt-[70px]`}
  }
`
const MoreText = styled.div`
  ${tw`not-italic font-semibold text-xl mt-[30px] mb-[50px]`}
  color: ${({ theme }) => theme.text19};
`

export const MorePoolsSoon = () => {
  const { mode } = useDarkMode()
  return (
    <CONTAINER>
      <MorePoolImg>
        <Lottie animationData={mode == 'dark' ? MorePools : MorePoolsLite} className="animation-404" />
      </MorePoolImg>
      <MoreText>More pools coming soon</MoreText>
    </CONTAINER>
  )
}
