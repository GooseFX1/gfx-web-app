import React, { FC, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { Header } from './Header'
import { Rate } from './Rate'
import { Settings } from './Settings'
import { SwapButton } from './SwapButton'
import { SwapFrom } from './SwapFrom'
import { SwapTo } from './SwapTo'
import { Switch } from './Switch'
import { SwapProvider } from '../../context'
import { addAnalytics } from '../../utils'

const BODY = styled.div`
  position: relative;
  ${({ theme }) => theme.flexColumnNoWrap}
  justify-content: space-between;
  ${({ theme }) => theme.measurements('100%')}
  margin: ${({ theme }) => theme.margins['4x']} 0;
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
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    addAnalytics()
  }, [])

  const height = '55px'

  const localCSS = css`
    .ant-input {
      height: ${height};
      border-radius: 45px;
      border: none;
      padding: 0 20px 0 120px;
      font-size: 16px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `

  return (
    <SwapProvider>
      <WRAPPER>
        <Header showSettings={showSettings} setShowSettings={setShowSettings} />
        {showSettings ? (
          <Settings />
        ) : (
          <>
            <Rate />
            <BODY>
              <style>{localCSS}</style>
              <SwapFrom height={height} />
              <Switch />
              <SwapTo height={height} />
            </BODY>
            <SwapButton />
          </>
        )}
      </WRAPPER>
    </SwapProvider>
  )
}
