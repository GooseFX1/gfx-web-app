import React, { FC, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { Rate } from './Rate'
import { Settings } from './Settings'
import { SwapButton } from './SwapButton'
import { SwapFrom } from './SwapFrom'
import { SwapTo } from './SwapTo'
import { Modal } from '../../components'
import { ENDPOINTS, SwapProvider, useConnectionConfig, useDarkMode, useSwap } from '../../context'
import { CenteredImg, SpaceBetweenDiv } from '../../styles'
import { addAnalytics, notify } from '../../utils'

const BODY = styled.div`
  position: relative;
  ${({ theme }) => theme.flexColumnNoWrap}
  justify-content: space-between;
  ${({ theme }) => theme.measurements('100%')}
  margin: ${({ theme }) => theme.margins['4x']} 0;
`

const HEADER_TITLE = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.text1};
`

const HEADER_WRAPPER = styled(SpaceBetweenDiv)<{ $iconSize: string }>`
  width: 100%;

  > div {
    display: flex;

    > div {
      ${({ $iconSize, theme }) => theme.measurements($iconSize)}
      cursor: pointer;

      &:first-child {
        margin-right: ${({ theme }) => theme.margins['3x']};
      }

      &:last-child {
        padding-top: 6px;
      }
    }
  }
`

const REFRESH_RATE = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['4x'])};
  cursor: pointer;
`

const SWITCH = styled(CenteredImg)<{ measurements: number }>`
  position: absolute;
  top: calc(50% - ${({ measurements }) => measurements}px / 2 + ${({ theme }) => theme.margins['2x']});
  left: calc(50% - ${({ measurements }) => measurements}px / 2);
  ${({ measurements, theme }) => theme.measurements(measurements + 'px')}
  z-index: 1;
  cursor: pointer;
`

const WRAPPER = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  align-items: center;
  min-height: 430px;
  width: 450px;
  padding: ${({ theme }) => theme.margins['4x']};
  ${({ theme }) => theme.largeBorderRadius}
  background-color: ${({ theme }) => theme.bg3};
  ${({ theme }) => theme.largeShadow}
`

const SwapContent: FC = () => {
  const { mode } = useDarkMode()
  const { refreshRates, setFocused, switchTokens } = useSwap()
  const [settingsModalVisible, setSettingsModalVisible] = useState(false)

  useEffect(() => {
    addAnalytics()
  }, [])

  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setSettingsModalVisible(true)
  }

  const height = '65px'
  const localCSS = css`
    .ant-input {
      height: ${height};
      border-radius: 45px;
      border: none;
      padding-right: 20px;
      font-size: 16px;
    }
  `

  return (
    <WRAPPER>
      <Modal setVisible={setSettingsModalVisible} title="Settings" visible={settingsModalVisible}>
        <Settings />
      </Modal>
      <HEADER_WRAPPER $iconSize="24px">
        <HEADER_TITLE>Swap</HEADER_TITLE>
        <div>
          <REFRESH_RATE onClick={refreshRates}>
            <img src={`${process.env.PUBLIC_URL}/img/assets/refresh_rate.svg`} alt="" />
          </REFRESH_RATE>
          <CenteredImg onClick={onClick}>
            <img src={`${process.env.PUBLIC_URL}/img/assets/settings_${mode}_mode.svg`} alt="settings" />
          </CenteredImg>
        </div>
      </HEADER_WRAPPER>
      <Rate />
      <BODY>
        <style>{localCSS}</style>
        <SwapFrom height={height} />
        <SWITCH
          measurements={80}
          onClick={() => {
            setFocused('from')
            switchTokens()
          }}
        >
          <img src={`${process.env.PUBLIC_URL}/img/assets/swap_switch_${mode}_mode.svg`} alt="switch" />
        </SWITCH>
        <SwapTo height={height} />
      </BODY>
      <SwapButton />
    </WRAPPER>
  )
}

export const Swap: FC = () => {
  return <span>Coming Soon</span>

  /* const { endpoint, setEndpoint } = useConnectionConfig()

  useEffect(() => {
    if (endpoint !== ENDPOINTS[1].endpoint) {
      notify({ message: 'Swap is in alpha. Switched to devnet' })
      setEndpoint(ENDPOINTS[1].endpoint)
    }
  }, [endpoint, setEndpoint])

  return (
    <SwapProvider>
      <SwapContent />
    </SwapProvider>
  ) */
}
