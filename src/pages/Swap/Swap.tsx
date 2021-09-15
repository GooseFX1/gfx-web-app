import React, { FC, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { Rate } from './Rate'
import { Settings } from './Settings'
import { SwapButton } from './SwapButton'
import { SwapFrom } from './SwapFrom'
import { SwapTo } from './SwapTo'
import { Switch } from './Switch'
import { SwapProvider, useDarkMode } from '../../context'
import { addAnalytics } from '../../utils'
import { Modal } from '../../components'
import { CenteredImg, MainText, SpaceBetweenDiv } from '../../styles'

const BODY = styled.div`
  position: relative;
  ${({ theme }) => theme.flexColumnNoWrap}
  justify-content: space-between;
  ${({ theme }) => theme.measurements('100%')}
  margin: ${({ theme }) => theme.margins['4x']} 0;
`

const HEADER_TITLE = MainText(styled.span`
  font-size: 20px;
  font-weight: bold;
`)

const HEADER_WRAPPER = styled(SpaceBetweenDiv)<{ $iconSize: string }>`
  width: 100%;
  > div {
    ${({ $iconSize, theme }) => theme.measurements($iconSize)}
    cursor: pointer;
  }
`

const WRAPPER = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  align-items: center;
  min-height: 430px;
  width: 400px;
  padding: ${({ theme }) => theme.margins['4x']};
  ${({ theme }) => theme.largeBorderRadius}
  background-color: ${({ theme }) => theme.bg3};
  ${({ theme }) => theme.largeShadow}
`

export const Swap: FC = () => {
  const { mode } = useDarkMode()
  const [settingsModalVisible, setSettingsModalVisible] = useState(false)

  useEffect(() => {
    addAnalytics()
  }, [])

  const onClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
    setSettingsModalVisible(true)
  }

  const height = '55px'
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
    <SwapProvider>
      <WRAPPER>
        <Modal
          setVisible={setSettingsModalVisible}
          style={{ width: '400px !important' }}
          title="Settings"
          visible={settingsModalVisible}
        >
          <Settings />
        </Modal>
        <HEADER_WRAPPER $iconSize="24px">
          <HEADER_TITLE>Swap</HEADER_TITLE>
          <CenteredImg onClick={onClick}>
            <img src={`${process.env.PUBLIC_URL}/img/assets/settings_${mode}_mode.svg`} alt="settings" />
          </CenteredImg>
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
    </SwapProvider>
  )
}
