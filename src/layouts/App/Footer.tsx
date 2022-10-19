import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { Row, Col } from 'antd'
import { PrivacyPolicy } from './PrivacyPolicy'
import { TermsOfService } from './TermsOfService'
import { APP_LAYOUT_FOOTER_HEIGHT, APP_LAYOUT_FOOTER_HEIGHT_MOBILE, SpaceBetweenDiv } from '../../styles'
import { SOCIAL_MEDIAS } from '../../constants'
import { SVGDynamicReverseMode } from '../../styles/utils'
import { checkMobile } from '../../utils'
import { useLocation } from 'react-router-dom'

const SOCIAL_ICON = styled.button`
  background: transparent;
  border: none;

  img {
    width: 18px;
    height: auto;

    @media (max-width: 500px) {
      width: 25px;
    }
  }
`

const TEXT = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.text26};
  margin-right: ${({ theme }) => theme.margin(1)};

  @media (max-width: 500px) {
    padding: 0.25rem;
    padding-bottom: 1rem;
    text-align: center;
    font-size: 9px;
  }
`

const AltRow = styled(Row)`
  @media (max-width: 500px) {
    width: 80%;
    padding: 1rem 0px 1rem 0px;
  }
`

const WRAPPER = styled(SpaceBetweenDiv)`
  height: ${APP_LAYOUT_FOOTER_HEIGHT};
  width: 100vw;
  padding: 0 ${({ theme }) => theme.margin(4)};
  border-top: 1px solid ${({ theme }) => theme.appLayoutFooterBorder};
  background-color: ${({ theme }) => theme.bg2};

  ${({ theme }) => theme.mediaWidth.upToSmall`
    height: ${APP_LAYOUT_FOOTER_HEIGHT_MOBILE};
    padding: ${({ theme }) => theme.margin(1)};
  `}

  @media(max-width:500px) {
    flex-direction: column;
    width: 100%;
  }
`

const LINK = styled.a`
  color: ${({ theme }) => theme.secondary4};
  text-decoration: underline;
  transition: color ${({ theme }) => theme.mainTransitionTime} ease-in-out;

  &:hover {
    color: #e180ff;
    text-decoration: underline;
  }
`

export const Footer: FC = () => {
  const [privacyPolicyVisible, setPrivacyPolicyVisible] = useState(false)
  const [termsOfServiceVisible, setTermsOfServiceVisible] = useState(false)
  const location = useLocation()
  const hideFooterArr = ['/NFTs/launchpad', '/farm', '/analytics']
  let hideFooter = false
  for (let i = 0; i < hideFooterArr.length; i++)
    hideFooter = hideFooter || location.pathname.startsWith(hideFooterArr[i])

  if ((checkMobile() && hideFooter) || hideFooter) {
    return <></>
  }
  if (checkMobile()) {
    return (
      <WRAPPER>
        <AltRow justify="space-between" align="middle">
          <Col span={2}>
            <SOCIAL_ICON onClick={() => window.open(SOCIAL_MEDIAS.medium)}>
              <SVGDynamicReverseMode src="/img/assets/medium_small.svg" alt="domain-icon" />
            </SOCIAL_ICON>
          </Col>
          <Col span={2}>
            <SOCIAL_ICON onClick={() => window.open(SOCIAL_MEDIAS.discord)}>
              <SVGDynamicReverseMode src="/img/assets/discord_small.svg" alt="discord-icon" />
            </SOCIAL_ICON>
          </Col>
          <Col span={2}>
            <SOCIAL_ICON onClick={() => window.open(SOCIAL_MEDIAS.telegram)}>
              <SVGDynamicReverseMode src="/img/assets/telegram_small.svg" alt="domain-icon" />
            </SOCIAL_ICON>
          </Col>
          <Col span={2}>
            <SOCIAL_ICON onClick={() => window.open(SOCIAL_MEDIAS.twitter)}>
              <SVGDynamicReverseMode src="/img/assets/twitter_small.svg" alt="twitter-icon" />
            </SOCIAL_ICON>
          </Col>
        </AltRow>
        <PrivacyPolicy setVisible={setPrivacyPolicyVisible} visible={privacyPolicyVisible} />
        <TermsOfService setVisible={setTermsOfServiceVisible} visible={termsOfServiceVisible} />
        <TEXT>
          Copyright © {new Date().getFullYear()} Goose Labs, Inc. All rights reserved. Please trade with your own
          discretion. Certain features may be unavailable to your geographic location. Please refer to our Terms of
          Service and Privacy Policy. Security audits by{' '}
          <LINK href="https://halborn.com" target="_blank" rel="noopener noreferrer">
            Halborn
          </LINK>
          , please use at your own risk
        </TEXT>
      </WRAPPER>
    )
  }
  return (
    <WRAPPER>
      <PrivacyPolicy setVisible={setPrivacyPolicyVisible} visible={privacyPolicyVisible} />
      <TermsOfService setVisible={setTermsOfServiceVisible} visible={termsOfServiceVisible} />
      <TEXT>
        Copyright © {new Date().getFullYear()} Goose Labs, Inc. All rights reserved. Please trade with your own
        discretion and according to your location’s laws and regulations. Security audits by{' '}
        <LINK href="https://halborn.com" target="_blank" rel="noopener noreferrer">
          Halborn
        </LINK>
        , please use at your own risk
      </TEXT>

      <Row justify="space-between" align="middle">
        <Col span={2}>
          <SOCIAL_ICON onClick={() => window.open(SOCIAL_MEDIAS.medium)}>
            <SVGDynamicReverseMode src="/img/assets/medium_small.svg" alt="domain-icon" />
          </SOCIAL_ICON>
        </Col>
        <Col span={2}>
          <SOCIAL_ICON onClick={() => window.open(SOCIAL_MEDIAS.discord)}>
            <SVGDynamicReverseMode src="/img/assets/discord_small.svg" alt="discord-icon" />
          </SOCIAL_ICON>
        </Col>
        <Col span={2}>
          <SOCIAL_ICON onClick={() => window.open(SOCIAL_MEDIAS.telegram)}>
            <SVGDynamicReverseMode src="/img/assets/telegram_small.svg" alt="domain-icon" />
          </SOCIAL_ICON>
        </Col>
        <Col span={2}>
          <SOCIAL_ICON onClick={() => window.open(SOCIAL_MEDIAS.twitter)}>
            <SVGDynamicReverseMode src="/img/assets/twitter_small.svg" alt="twitter-icon" />
          </SOCIAL_ICON>
        </Col>
      </Row>
    </WRAPPER>
  )
}
