import React, { FC } from 'react'
import styled from 'styled-components'
import { useDarkMode, useRates } from '../../context'
import { CenteredDiv, CenteredImg, MainText, SpaceBetweenDiv, SVGToWhite } from '../../styles'

const MODE_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['2x'])};
`

const REFRESH_RATE = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['4x'])};
  cursor: pointer;
`

const TEXT = MainText(styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.text2};
`)

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
  padding: ${({ theme }) => theme.margins['2x']};
  border-top: 1px solid ${({ theme }) => theme.appLayoutFooterBorder};
  background-color: ${({ theme }) => theme.bg2};

  > div > div:first-child {
    margin-right: ${({ theme }) => theme.margins['6x']};
  }

  div > div > div {
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
  const { refreshRates } = useRates()

  return (
    <WRAPPER>
      <TEXT>
        Copyright © 2021 Goose Labs, Inc. All rights reserved. Please trade with your own discretion and according to
        your location’s laws and regulations.
      </TEXT>
      <SpaceBetweenDiv>
        <SpaceBetweenDiv>
          <TEXT>Refresh Rate</TEXT>
          <REFRESH_RATE onClick={refreshRates}>
            <img src={`${process.env.PUBLIC_URL}/img/assets/refresh_rate.svg`} alt="" />
          </REFRESH_RATE>
        </SpaceBetweenDiv>
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
      </SpaceBetweenDiv>
    </WRAPPER>
  )
}
