import React, { ReactElement } from 'react'
import { useDarkMode } from '../../../context'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { GradientText } from '../../../components/GradientText'

const WRAPPER = styled.div`
  font-family: Montserrat !important;

  ${tw`flex flex-col items-center justify-center mt-[180px]`}
  .commingSoon {
    ${tw`dark:text-[#b5b5b5] mt-4 text-[#636363] text-[18px] font-semibold`}
  }
  .desc {
    ${tw`dark:text-[#b5b5b5] mt-[47px] text-[#636363] text-[28px] font-semibold`}
  }
`

const AggCommingSoon = (): ReactElement => {
  const { mode } = useDarkMode()
  return (
    <WRAPPER>
      <GradientText text={'NFT Aggregator'} fontSize={28} fontWeight={600} />
      <div className="commingSoon">Coming Soon...</div>
      <img tw="mt-10 w-[579px] h-[361px] mt-14" src={`${`/img/assets/Aggregator/aggCommingSoon${mode}.webp`}`} />

      <div className="desc">For collectors, investors, and enthusiasts</div>
    </WRAPPER>
  )
}

export default AggCommingSoon
