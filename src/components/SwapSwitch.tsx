import React, { FC } from 'react'
import styled from 'styled-components'
import { useDarkMode, useSwap } from './../context'
import { CenteredImg } from './../styles'

const SWITCH = styled(CenteredImg)<{ measurements: number }>`
  position: absolute;
  top: calc(50% - ${({ measurements }) => measurements}px / 2 + ${({ theme }) => theme.margins['2x']});
  left: calc(50% - ${({ measurements }) => measurements}px / 2);
  ${({ measurements, theme }) => theme.measurements(measurements + 'px')}
  z-index: 1;
  cursor: pointer;
  width: '100%';
`

export const SwapSwitch: FC = () => {
  const { mode } = useDarkMode()

  const width = 80

  return (
    <SWITCH measurements={width} onClick={() => {}}>
      <img src={`${process.env.PUBLIC_URL}/img/assets/swap_switch_${mode}_mode.svg`} alt="switch" />
    </SWITCH>
  )
}
