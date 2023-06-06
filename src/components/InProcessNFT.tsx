import { FC } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { Loader } from './Loader'
import { useDarkMode } from '../context'

const WRAPPER = styled.div`
  ${tw`w-full !h-full !pl-0 absolute z-[1000] duration-300 `}
  .backGround {
    ${tw`duration-500`}
    background: ${({ theme }) => theme.hoverGradient};
  }
  .loadingText {
    ${tw`font-semibold dark:text-white  text-black-4 text-[15px]`}
  }
`

export const InProcessNFT: FC<{ text?: string }> = ({ text = '' }) => {
  const { mode } = useDarkMode()
  return (
    <WRAPPER>
      <div
        className="backGround"
        tw="  h-[calc(100% - 120px)] sm:h-[calc(100% - 100px)] w-full opacity-100  z-[1001] rounded-[15px]  absolute"
      ></div>
      <div tw="absolute z-[1004]  justify-center flex flex-col items-center  h-full w-full">
        <div tw=" absolute mt-[-80px] ml-[-15px] w-auto h-auto">
          <Loader color={mode === 'dark' ? '#ffffff' : '#3C3C3C'} />
        </div>
        <div tw="mt-8">{text.length > 0 && <span className="loadingText">{text}</span>}</div>
      </div>
    </WRAPPER>
  )
}
