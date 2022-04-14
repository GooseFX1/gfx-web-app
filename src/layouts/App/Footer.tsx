import React, { FC, useCallback, useState } from 'react'
import styled from 'styled-components'
import { Row, Col } from 'antd'
import { PrivacyPolicy } from './PrivacyPolicy'
import { TermsOfService } from './TermsOfService'
import { useConnectionConfig } from '../../context'
import { APP_LAYOUT_FOOTER_HEIGHT, APP_LAYOUT_FOOTER_HEIGHT_MOBILE, SpaceBetweenDiv } from '../../styles'
import { SOCIAL_MEDIAS } from '../../constants'
import { SVGDynamicReverseMode } from '../../styles/utils'

const SOCIAL_ICON = styled.button`
  background: transparent;
  border: none;

  img {
    width: 18px;
    height: auto;
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

      <Row justify="space-between" align="middle">
        <Col span={2}>
          <SOCIAL_ICON onClick={(e) => window.open(SOCIAL_MEDIAS.medium)}>
            <SVGDynamicReverseMode src="/img/assets/medium_small.svg" alt="domain-icon" />
          </SOCIAL_ICON>
        </Col>
        <Col span={2}>
          <SOCIAL_ICON onClick={(e) => window.open(SOCIAL_MEDIAS.discord)}>
            <SVGDynamicReverseMode src="/img/assets/discord_small.svg" alt="discord-icon" />
          </SOCIAL_ICON>
        </Col>
        <Col span={2}>
          <SOCIAL_ICON onClick={(e) => window.open(SOCIAL_MEDIAS.telegram)}>
            <SVGDynamicReverseMode src="/img/assets/telegram_small.svg" alt="domain-icon" />
          </SOCIAL_ICON>
        </Col>
        <Col span={2}>
          <SOCIAL_ICON onClick={(e) => window.open(SOCIAL_MEDIAS.twitter)}>
            <SVGDynamicReverseMode src="/img/assets/twitter_small.svg" alt="twitter-icon" />
          </SOCIAL_ICON>
        </Col>
      </Row>
    </WRAPPER>
  )
}
