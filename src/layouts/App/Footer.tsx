import React, { FC, useCallback, useState } from 'react'
import styled from 'styled-components'
import { PrivacyPolicy } from './PrivacyPolicy'
import { TermsOfService } from './TermsOfService'
import { useDarkMode } from '../../context'
import {
  APP_LAYOUT_FOOTER_HEIGHT,
  APP_LAYOUT_FOOTER_HEIGHT_MOBILE,
  CenteredDiv,
  CenteredImg,
  SpaceBetweenDiv,
  SVGToWhite
} from '../../styles'

const MODE_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['2x'])};
  .moon-image {
    width: 18px;
    height: 18px;
    margin-right: ${({ theme }) => theme.margins['1x']};
  }
  .brightness-image {
    width: 22px;
    height: 22px;
  }
`
const REFRESH_ICON = styled.div`
  margin-right: ${({ theme }) => theme.margins['6x']};

  span {
    font-size: 11px;
    margin-right: ${({ theme }) => theme.margins['1x']};
    color: ${({ theme }) => theme.text2};
  }
  img {
    width: 37px;
    height: 37px;
  }
`

const TEXT = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.text2};
  margin-right: ${({ theme }) => theme.margins['1x']};

  span {
    color: ${({ theme }) => theme.text3};
    cursor: pointer;
  }
`

const TOGGLE = styled(CenteredDiv)<{ $mode: string }>`
  height: 30px;
  width: 60px;
  border-radius: 30px;
  margin-right: ${({ theme }) => theme.margins['5x']};
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
  padding: ${({ theme }) => theme.margins['5x']};
  border-top: 1px solid ${({ theme }) => theme.appLayoutFooterBorder};
  background-color: ${({ theme }) => theme.bg2};

  div > div {
    &:nth-child(2) {
      margin-right: ${({ theme }) => theme.margins['1x']};
    }
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: ${APP_LAYOUT_FOOTER_HEIGHT_MOBILE};
    padding: ${({ theme }) => theme.margins['1x']};
  `}
`

export const Footer: FC = () => {
  const { mode, toggleMode } = useDarkMode()
  const [privacyPolicyVisible, setPrivacyPolicyVisible] = useState(false)
  const [termsOfServiceVisible, setTermsOfServiceVisible] = useState(false)

  const handlePrivacyPolicy = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!event.defaultPrevented) setPrivacyPolicyVisible(true)
    },
    [setPrivacyPolicyVisible]
  )

  const handleTOS = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!event.defaultPrevented) setTermsOfServiceVisible(true)
    },
    [setTermsOfServiceVisible]
  )

  return (
    <WRAPPER>
      <PrivacyPolicy setVisible={setPrivacyPolicyVisible} visible={privacyPolicyVisible} />
      <TermsOfService setVisible={setTermsOfServiceVisible} visible={termsOfServiceVisible} />
      <TEXT>
        Copyright © 2021 Goose Labs, Inc. All rights reserved. Please trade with your own discretion and according to
        your location’s laws and regulations.
      </TEXT>
      <SpaceBetweenDiv>
        <REFRESH_ICON>
          <span>Refresh Rate</span>
          <img src={`${process.env.PUBLIC_URL}/img/assets/refresh-icon.png`} alt="" />
        </REFRESH_ICON>
        <MODE_ICON>
          {mode === 'dark' ? (
            <SVGToWhite className="moon-image" src={`${process.env.PUBLIC_URL}/img/assets/lite_mode.svg`} alt="" />
          ) : (
            <img className="moon-image" src={`${process.env.PUBLIC_URL}/img/assets/lite_mode.svg`} alt="" />
          )}
        </MODE_ICON>
        <TOGGLE $mode={mode} onClick={toggleMode}>
          <div />
        </TOGGLE>
        <MODE_ICON>
          {mode === 'dark' ? (
            <SVGToWhite
              className="brightness-image"
              src={`${process.env.PUBLIC_URL}/img/assets/dark_mode.svg`}
              alt=""
            />
          ) : (
            <img className="brightness-image" src={`${process.env.PUBLIC_URL}/img/assets/dark_mode.svg`} alt="" />
          )}
        </MODE_ICON>
      </SpaceBetweenDiv>
    </WRAPPER>
  )
}
