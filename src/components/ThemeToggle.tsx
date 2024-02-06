import { FC } from 'react'
import styled from 'styled-components'
import { useDarkMode } from '../context'
import { CenteredImg, CenteredDiv, SpaceBetweenDiv } from '../styles'
import tw from 'twin.macro'

const WRAPPER = styled(SpaceBetweenDiv)`
  ${tw`pb-0.5 w-max`}
`

const Toggle = styled(CenteredDiv)<{ $mode: boolean }>`
  ${tw`h-[25px] w-12.5 sm:h-[35px] sm:w-[70px] mx-[12px] rounded-[40px] cursor-pointer`}
  border-radius: 30px;
  background-color: ${({ theme }) => theme.themeToggleButton};

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

const MODE_ICON = styled(CenteredImg)`
  .moon-image {
    ${tw`h-[22px] w-[22px] sm:h-[24px] sm:w-[24px] mr-[8px]`}
  }

  .brightnessImage {
    ${tw`h-[22px] w-[22px] sm:h-[26px] sm:w-[26px]`}
  }
`

export const ThemeToggle: FC = () => {
  const { mode, toggleMode } = useDarkMode()

  return (
    <WRAPPER>
      <MODE_ICON>
        <img className="moon-image" src={`/img/mainnav/moon_${mode}_mode.svg`} alt="moon" />
      </MODE_ICON>

      <Toggle $mode={mode === 'dark'} onClick={toggleMode}>
        <div />
      </Toggle>

      <MODE_ICON>
        <img className="brightnessImage" src={`/img/mainnav/sun_${mode}_mode.svg`} alt="sun" />
      </MODE_ICON>
    </WRAPPER>
  )
}
