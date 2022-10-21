import { FC } from 'react'
import styled from 'styled-components'
import { useDarkMode } from '../context/dark_mode'
import { CenteredImg, CenteredDiv, SpaceBetweenDiv } from '../styles'
import tw from 'twin.macro'

const WRAPPER = styled(SpaceBetweenDiv)`
  ${tw`pb-0.5`}
`

const Toggle = styled(CenteredDiv)<{ $mode: boolean }>`
  ${tw`h-[25px] w-[50px] sm:h-[35px] sm:w-[70px]  mx-[12px] rounded-[40px] cursor-pointer`}
  border-radius: 30px;
  background-color: ${({ theme }) => theme.appLayoutFooterToggle};

  > div {
    ${tw`h-[20px] w-[20px] sm:h-[25px] sm:w-[25px]`}
    ${({ theme }) => theme.roundedBorders}
    box-shadow: 0 3.5px 3.5px 0 rgba(0, 0, 0, 0.25);
    background: ${({ $mode }) =>
      $mode
        ? 'linear-gradient(96.79deg, #F7931A 4.25%, #AC1CC7 97.61%);'
        : 'linear-gradient(96.79deg, #5855FF 4.25%, #DC1FFF 97.61%);'};

    transform: translateX(${({ $mode }) => ($mode ? '-12px' : '12px')});

    ${({ theme, $mode }) => theme.mediaWidth.upToSmall`
      transform: translateX(${$mode ? '-17px' : '17px'});
    `}
    
`

const MODE_ICON = styled(CenteredImg)<{ $mode: boolean }>`
  ${tw`h-[16px] w-[16px]`}

  img {
    filter: ${({ $mode }) => ($mode ? 'invert(100%)' : 'opacity(0.4)')};
  }

  .moon-image {
    ${tw`h-[16px] w-[16px] sm:h-[24px] sm:w-[24px] mr-[8px]`}
  }

  .brightnessImage {
    ${tw`h-[19px] w-[19px] sm:h-[26px] sm:w-[26px]`}
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
