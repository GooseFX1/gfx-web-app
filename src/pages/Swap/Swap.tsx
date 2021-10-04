import React, { FC, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { Rate } from './Rate'
import { Settings } from './Settings'
import { SwapButton } from './SwapButton'
import { SwapFrom } from './SwapFrom'
import { SwapTo } from './SwapTo'
import { Switch } from './Switch'
import { SwapProvider, useDarkMode, useSwap } from '../../context'
import { addAnalytics } from '../../utils'
import { Expand, Modal } from '../../components'
import { CenteredImg, SpaceBetweenDiv } from '../../styles'

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

const WRAPPER = styled.div`
  position: relative;
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
  const { refreshRates } = useSwap()
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
      <Expand />
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
        <Switch />
        <SwapTo height={height} />
      </BODY>
      <SwapButton />
    </WRAPPER>
  )
}

export const Swap: FC = () => {
  return (
    <SwapProvider>
      <SwapContent />
    </SwapProvider>
  )
}
