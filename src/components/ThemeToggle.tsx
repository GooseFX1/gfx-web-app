import { FC } from 'react'
import styled from 'styled-components'
import { useDarkMode } from '../context/dark_mode'
import { CenteredImg, CenteredDiv, SpaceBetweenDiv, SVGToBlack } from '../styles'
import tw from 'twin.macro'

const WRAPPER = styled(SpaceBetweenDiv)`
  ${tw`pb-0.5`}
`

const Toggle = styled(CenteredDiv)<{ $mode: boolean }>`
  ${tw`h-[25px] w-[50px] mx-[12px] rounded-[40px]`}
  border-radius: 30px;
  background-color: ${({ theme }) => theme.appLayoutFooterToggle};
  &:hover {
    cursor: pointer;
  }

  > div {
    ${tw`h-[20px] w-[20px]`}
    ${({ theme }) => theme.roundedBorders}
    background: ${({ $mode }) =>
      $mode
        ? 'linear-gradient(96.79deg, #5855FF 4.25%, #DC1FFF 97.61%);'
        : 'linear-gradient(96.79deg, #F7931A 4.25%, #AC1CC7 97.61%);'};

    transform: translateX(${({ $mode }) => ($mode ? '-12px' : '12px')});
`

const MODE_ICON = styled(CenteredImg)<{ $mode: boolean }>`
  ${tw`h-[16px] w-[16px]`}

  img {
    filter: ${({ $mode }) => ($mode ? 'invert(100%)' : 'opacity(0.4)')};
  }

  .moon-image {
    ${tw`h-[16px] w-[16px] mr-[8px]`}
  }

  .brightnessImage {
    ${tw`h-[19px] w-[19px]`}
  }
`

export const ThemeToggle: FC = () => {
  const { mode, toggleMode } = useDarkMode()

  return (
    <WRAPPER>
      <MODE_ICON $mode={mode === 'dark'}>
        <img className="moon-image" src={`/img/assets/lite_mode.svg`} alt="" />
      </MODE_ICON>

      <Toggle $mode={mode === 'dark'} onClick={toggleMode}>
        <div />
      </Toggle>

      <MODE_ICON $mode={mode === 'dark'}>
        <img className="brightnessImage" src={`/img/assets/dark_mode.svg`} alt="" />
      </MODE_ICON>
    </WRAPPER>
  )
}
