import { FC } from 'react'
import styled from 'styled-components'
import { useDarkMode } from '../context/dark_mode'
import { MODE_ICON, SpaceBetweenDiv, SVGToWhite, TOGGLE } from '../styles'

const WRAPPER = styled(SpaceBetweenDiv)`
  padding: 0 0 2px 0;

  div {
    &:nth-child(2) {
      margin-inline: ${({ theme }) => theme.margin(1)};
    }
  }
`

const Toggle = styled(TOGGLE)`
  height: 25px;
  width: 50px;
  border-radius: 40px;
`

export const ThemeToggle: FC = () => {
  const { mode, toggleMode } = useDarkMode()

  return (
    <WRAPPER>
      <MODE_ICON>
        {mode === 'dark' ? (
          <SVGToWhite className="moon-image" src={`/img/assets/lite_mode.svg`} alt="" />
        ) : (
          <img className="moon-image" src={`/img/assets/lite_mode.svg`} alt="" />
        )}
      </MODE_ICON>

      <Toggle $mode={mode} onClick={toggleMode}>
        <div />
      </Toggle>

      <MODE_ICON>
        {mode === 'dark' ? (
          <SVGToWhite className="brightness-image" src={`/img/assets/dark_mode.svg`} alt="" />
        ) : (
          <img className="brightness-image" src={`/img/assets/dark_mode.svg`} alt="" />
        )}
      </MODE_ICON>
    </WRAPPER>
  )
}
