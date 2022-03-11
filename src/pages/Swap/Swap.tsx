import React, { FC, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { Rate } from './Rate'
import { Settings } from './Settings'
import { SwapButton } from './SwapButton'
import { SwapFrom } from './SwapFrom'
import { SwapTo } from './SwapTo'
import { Modal } from '../../components'
import { useDarkMode, useSwap, SwapProvider } from '../../context'
import { CenteredImg, SpaceBetweenDiv } from '../../styles'
import { addAnalytics } from '../../utils'

const WRAPPER = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.text1};
  height: calc(100vh - 81px);
  width: 100vw;
`

const BODY = styled.div`
  position: relative;
  ${({ theme }) => theme.flexColumnNoWrap}
  justify-content: space-between;
  width: 100%;
  margin: ${({ theme }) => theme.margin(5)} 0 ${({ theme }) => theme.margin(4)};
  ${({ theme }) => theme.customScrollBar('6px')};
  ${({ theme }) => theme.measurements('100%')}
`

const HEADER_TITLE = styled.span`
  font-weight: 600;
  font-size: 30px;
  line-height: 37px;
  color: ${({ theme }) => theme.text1};
`

const HEADER_WRAPPER = styled(SpaceBetweenDiv)<{ $iconSize: string }>`
  width: 100%;

  > div {
    display: flex;
    align-items: center;
  }

  .header-icon {
    height: ${({ $iconSize }) => $iconSize};
    cursor: pointer;
  }
`

const SWITCH = styled(CenteredImg)<{ measurements: number }>`
  position: absolute;
  top: calc(50% - ${({ measurements }) => measurements}px / 2 + ${({ theme }) => theme.margin(2)});
  left: calc(50% - ${({ measurements }) => measurements}px / 2);
  ${({ measurements, theme }) => theme.measurements(measurements + 'px')}
  z-index: 1;
  cursor: pointer;
`

const SWAP_CONTENT = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  align-items: center;
  min-height: 430px;
  width: 450px;
  padding: ${({ theme }) => theme.margin(4)};
  ${({ theme }) => theme.largeBorderRadius}
  background-color: ${({ theme }) => theme.bg9};
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

  const height = '80px'
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
    <SWAP_CONTENT>
      <Modal setVisible={setSettingsModalVisible} title="Settings" visible={settingsModalVisible}>
        <Settings />
      </Modal>
      <HEADER_WRAPPER $iconSize="30px">
        <HEADER_TITLE>Swap</HEADER_TITLE>
        <div>
          <div onClick={refreshRates}>
            <img src={`/img/assets/refresh_rate.svg`} alt="refresh-icon" className={'header-icon'} />
          </div>
          <CenteredImg onClick={onClick} style={{ margin: '8px 0 0 8px' }}>
            <img src={`/img/assets/settings_${mode}_mode.svg`} alt="settings" className={'header-icon'} />
          </CenteredImg>
        </div>
      </HEADER_WRAPPER>
      <Rate />
      <BODY>
        <style>{localCSS}</style>
        <SwapFrom height={height} />
        <SWITCH
          measurements={100}
          onClick={() => {
            setFocused('from')
            switchTokens()
          }}
        >
          <img src={`/img/assets/swap_switch_${mode}_mode.svg`} alt="switch" />
        </SWITCH>
        <SwapTo height={height} />
      </BODY>
      <SwapButton />
    </SWAP_CONTENT>
  )
}

export const Swap: FC = () => {
  return (
    <SwapProvider>
      <WRAPPER>
        <SwapContent />
      </WRAPPER>
    </SwapProvider>
  )
}
