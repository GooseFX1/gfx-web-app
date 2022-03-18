import React, { FC, useCallback, useState } from 'react'
import styled from 'styled-components'
import { PrivacyPolicy } from './PrivacyPolicy'
import { TermsOfService } from './TermsOfService'
import { useConnectionConfig } from '../../context'
import { APP_LAYOUT_FOOTER_HEIGHT, APP_LAYOUT_FOOTER_HEIGHT_MOBILE, SpaceBetweenDiv } from '../../styles'

const REFRESH_ICON = styled.div`
  margin-right: ${({ theme }) => theme.margin(6)};

  span {
    font-size: 11px;
    margin-right: ${({ theme }) => theme.margin(1)};
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
  margin-right: ${({ theme }) => theme.margin(1)};

  span {
    color: ${({ theme }) => theme.text3};
    cursor: pointer;
  }
`

const CURRENT_NETWORK = styled.span`
  color: ${({ theme }) => theme.text1};
  .network {
    text-transform: capitolize;
    color: ${({ theme }) => theme.secondary2};
  }
`

const WRAPPER = styled(SpaceBetweenDiv)`
  height: ${APP_LAYOUT_FOOTER_HEIGHT};
  padding: 0 ${({ theme }) => theme.margin(4)};
  border-top: 1px solid ${({ theme }) => theme.appLayoutFooterBorder};
  background-color: ${({ theme }) => theme.bg2};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: ${APP_LAYOUT_FOOTER_HEIGHT_MOBILE};
    padding: ${({ theme }) => theme.margin(1)};
  `}
`

export const Footer: FC = () => {
  const { network } = useConnectionConfig()
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
        Copyright © 2022 Goose Labs, Inc. All rights reserved. Please trade with your own discretion and according to
        your location’s laws and regulations.
      </TEXT>
      <CURRENT_NETWORK>
        SOL Network:
        <span className={'network'}>{' ' + network}</span>
      </CURRENT_NETWORK>
    </WRAPPER>
  )
}
