/* eslint-disable @typescript-eslint/no-unused-vars */
import { useState, FC, useMemo } from 'react'
import styled from 'styled-components'
import { CenteredImg, SpaceBetweenDiv, CenteredDiv } from '../styles'
import tw from 'twin.macro'

const TOGGLE_WRAPPER = styled.div<{ position: number }>`
  .background {
    ${tw`w-[50px] h-[26px] rounded-[33px] duration-500 flex cursor-pointer items-center`}
    background: linear-gradient(90.95deg, #F7931A 25.41%, #AC1CC7 99.19%);
  }
  .tokenImg {
    ${tw`h-[27px] w-[27px] rounded-[50%] duration-500`}
    margin-left: ${({ position }) => (position ? '24px' : 0)};
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
  ${tw`relative mx-[12px] h-[25px] w-[50px] rounded-[40px]`}

  background: ${({ $mode }) =>
    $mode === 0
      ? 'linear-gradient(96.79deg, #F7931A 4.25%, #AC1CC7 97.61%);'
      : 'linear-gradient(96.79deg, #5855FF 4.25%, #DC1FFF 97.61%);'};

  &:hover {
    cursor: pointer;
  }

  > div {
    ${tw`h-[20px] w-[20px]`}
    ${({ theme }) => theme.roundedBorders}
    background-color: #fff;
    transform: translateX(${({ $mode }) => ($mode === 0 ? '-12px' : '12px')});
  }
`

interface ITokenToggle {
  tokenA: string
  tokenB: string
  toggleToken: (token: string) => void
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

export const TokenToggleNFT: FC<ITokenToggle> = ({ tokenA, tokenB, toggleToken, icons }: ITokenToggle) => {
  const [position, setPosition] = useState<number>(0)
  const currentToken = useMemo(() => (position === 0 ? tokenA : tokenB), [position])

  const handleToggle = () => {
    toggleToken(position === 0 ? tokenA : tokenB)
    setPosition((prev) => (prev === 0 ? 1 : 0))
  }
  return (
    <TOGGLE_WRAPPER position={position} onClick={handleToggle}>
      <div className="background">
        <img src={`/img/crypto/${currentToken}.svg`} className="tokenImg" />
      </div>
    </TOGGLE_WRAPPER>
  )
}
