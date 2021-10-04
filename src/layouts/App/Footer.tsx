import React, { FC } from 'react'
import styled from 'styled-components'
import { useDarkMode } from '../../context'
import { APP_LAYOUT_FOOTER_HEIGHT, CenteredDiv, CenteredImg, SpaceBetweenDiv, SVGToWhite } from '../../styles'

const MODE_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['2x'])};
`

const TEXT = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.text2};
`

const TOGGLE = styled(CenteredDiv)<{ $mode: string }>`
  height: ${({ theme }) => theme.margins['3x']};
  width: ${({ theme }) => theme.margins['6x']};
  border-radius: 30px;
  background-color: ${({ theme }) => theme.appLayoutFooterToggle};
  &:hover {
    cursor: pointer;
  }
  > div {
    ${({ theme }) => theme.measurements(theme.margins['2.5x'])}
    ${({ theme }) => theme.roundedBorders}
    background-color: ${({ theme }) => theme.secondary2};
    transform: translateX(${({ $mode }) => ($mode === 'dark' ? '-' : '')}${({ theme }) => theme.margins['1.5x']});
  }
`

const WRAPPER = styled(SpaceBetweenDiv)`
  height: ${APP_LAYOUT_FOOTER_HEIGHT};
  padding: ${({ theme }) => theme.margins['2x']};
  border-top: 1px solid ${({ theme }) => theme.appLayoutFooterBorder};
  background-color: ${({ theme }) => theme.bg2};

  div > div {
    &:first-child {
      margin-right: ${({ theme }) => theme.margins['1x']};
    }

    &:last-child {
      margin-left: ${({ theme }) => theme.margins['1x']};
    }
  }
`

export const Footer: FC = () => {
  const { mode, toggleMode } = useDarkMode()

  return (
    <WRAPPER>
      <TEXT>
        Copyright © 2021 GooseFX. All rights reserved. Please trade with your own discretion and according to your
        location’s laws and regulations.
      </TEXT>
      <SpaceBetweenDiv>
        <MODE_ICON>
          {mode === 'dark' ? (
            <SVGToWhite src={`${process.env.PUBLIC_URL}/img/assets/lite_mode.svg`} alt="" />
          ) : (
            <img src={`${process.env.PUBLIC_URL}/img/assets/lite_mode.svg`} alt="" />
          )}
        </MODE_ICON>
        <TOGGLE $mode={mode} onClick={toggleMode}>
          <div />
        </TOGGLE>
        <MODE_ICON>
          {mode === 'dark' ? (
            <SVGToWhite src={`${process.env.PUBLIC_URL}/img/assets/dark_mode.svg`} alt="" />
          ) : (
            <img src={`${process.env.PUBLIC_URL}/img/assets/dark_mode.svg`} alt="" />
          )}
        </MODE_ICON>
      </SpaceBetweenDiv>
    </WRAPPER>
  )
}
