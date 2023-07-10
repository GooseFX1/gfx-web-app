import { useDarkMode } from '../../../../context'
import React, { FC } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import Lottie from 'lottie-react'
import MintAnimationLite from '../../../../animations/mint-animation-lite.json'
import MintAnimationDark from '../../../../animations/mint-animation-dark.json'

export const HOLD_TIGHT = styled.div`
  ${tw`flex flex-col overflow-hidden`}
  .ant-modal-close-x {
    img {
      ${tw`hidden`}
    }
  }

  .animationClass {
    @media (max-width: 500px) {
      transform: scale(1.6);
    }
  }
  &.ant-modal {
    ${tw`max-w-full sm:bottom-[-10px] sm:mt-auto sm:absolute sm:h-[600px]`}
    background-color: ${({ theme }) => theme.bg20};
  }
  color: ${({ theme }) => theme.text20};
  .holdTightText {
    color: ${({ theme }) => theme.text30};
    ${tw`text-[35px] sm:text-[25px] font-semibold mt-[-40px] sm:mt-[-5px]`}
  }
`

export const HoldTight: FC = () => {
  const { mode } = useDarkMode()

  return (
    <HOLD_TIGHT tw="flex flex-col mt-[10%] items-center justify-center">
      <div>
        {mode === 'dark' ? (
          <Lottie className="animationClass" animationData={MintAnimationDark} />
        ) : (
          <Lottie className="animationClass" animationData={MintAnimationLite} />
        )}
      </div>
      <div className="holdTightText">Hold tight!</div>
      <div tw="text-[25px] sm:text-[18px] font-semibold mt-4 ">We are almost there</div>
    </HOLD_TIGHT>
  )
}
