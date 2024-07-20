import { useState, FC } from 'react'
import { CenteredImg, SpaceBetweenDiv, CenteredDiv } from '../styles'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'

const TOGGLE_WRAPPER = styled.div<{ position: number }>`
  cursor: pointer;

  .background {
    ${tw`w-[50px] h-[26px] max-sm:h-[35px] max-sm:mr-3 max-sm:w-[65px] rounded-[33px] duration-500 flex items-center`}
    background: linear-gradient(90.95deg, #F7931A 25.41%, #AC1CC7 99.19%);
  }
  .pinkGradient {
    ${tw`items-center`}
    background: ${({ position }) =>
      position === 1 ? 'linear-gradient(90.95deg, #F7931A 25.41%, #AC1CC7 99.19%)' : 'pink'}
  }
  .tokenImg {
    ${tw`h-[26px] max-sm:w-[35px] max-sm:h-[35px] w-[26px] rounded-[50%] duration-500`}
    margin-left: ${({ position }) => (position ? '24px' : '-1px')};
    @media (max-width: 500px) {
      margin-left: ${({ position }) => (position ? '35px' : '-1px')};
    }
  }
`
const WRAPPER = styled(SpaceBetweenDiv)`
  ${tw`px-[8px] py-[12px] rounded-[12px]`}
  background-color: ${({ theme }) => theme.bg1};
`

const LABEL = styled(CenteredDiv)`
  font-weight: 600;
  ${tw`text-[16px]`}
`

const ICON = styled(CenteredDiv)`
  font-weight: 600;
  ${tw`text-[16px]`}
`

const Toggle = styled(CenteredImg)<{ $mode: number }>`
  ${tw`relative mx-[12px] h-[25px] w-12.5 rounded-[40px]`}

  background: ${({ $mode }) =>
    $mode === 0
      ? 'linear-gradient(96.79deg, #F7931A 4.25%, #AC1CC7 97.61%);'
      : 'linear-gradient(96.79deg, #5855FF 4.25%, #DC1FFF 97.61%);'};
  > div {
    ${tw`h-[20px] w-[20px]`}
    ${({ theme }) => theme.roundedBorders}
    background-color: #fff;
    transform: translateX(${({ $mode }) => ($mode === 0 ? '-12px' : '12px')});
  }
`

interface ITokenToggle {
  tokenA?: string
  tokenB?: string
  toggleToken: (token?: string) => void
  icons?: boolean
}

export const TokenToggle: FC<ITokenToggle> = ({ tokenA, tokenB, toggleToken, icons }: ITokenToggle) => {
  const [position, setPosition] = useState<number>(0)

  const handleToggle = () => {
    toggleToken(position === 0 ? tokenB : tokenA)
    setPosition((prev) => (prev === 0 ? 1 : 0))
  }

  return (
    <WRAPPER>
      {icons ? <ICON>{tokenA}</ICON> : <LABEL>{tokenA}</LABEL>}

      <Toggle $mode={position} onClick={handleToggle}>
        <div />
      </Toggle>

      {icons ? <ICON>{tokenB}</ICON> : <LABEL>{tokenB}</LABEL>}
    </WRAPPER>
  )
}

export const ShowDepositedToggle: FC<{ enabled: boolean; setEnable: any }> = ({ enabled, setEnable }) => (
  <TOGGLE_WRAPPER position={enabled ? 1 : 0} onClick={() => setEnable()}>
    <div
      tw="!rounded-[35px] !w-[75px] max-sm:!w-[70px] !h-8.75 
       max-sm:ml-0 duration-500 dark:bg-black-3 bg-grey-4 border border-solid dark:border-white border-grey-2"
      className={enabled && 'pinkGradient'}
    >
      <div
        css={[enabled ? tw`ml-[2.3rem]` : tw`max-sm:ml-1`]}
        tw="!h-8.75 !w-8.75 z-[10] !bg-black-4 rounded-[50%] duration-200"
      />
    </div>
  </TOGGLE_WRAPPER>
)
