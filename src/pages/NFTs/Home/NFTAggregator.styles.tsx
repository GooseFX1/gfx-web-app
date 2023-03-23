/* eslint-disable @typescript-eslint/no-unused-vars */
import styled from 'styled-components'
import tw from 'twin.macro'

export const NFT_STATS_CONTAINER = styled.div`
  ${tw`h-[36px] mt-4 ml-6 flex`}
`

export const STATS_BTN = styled.div`
  ${tw`flex items-center rounded-full p-[2px] ml-1 mr-1`}
  background: linear-gradient(94deg, #f7931a 1%, #ac1cc7 100%);

  .innerCover {
    background: ${({ theme }) => theme.bg1};
    color: ${({ theme }) => theme.text28};
    height: 100%;
    ${tw` rounded-full p-1.5 font-semibold text-[15px] `}
  }
`
