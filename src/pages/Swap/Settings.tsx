import React, { BaseSyntheticEvent, FC, useEffect, useState } from 'react'
import { Input, Tooltip } from 'antd'
import styled, { css } from 'styled-components'
import { DEFAULT_SLIPPAGE, useDarkMode, useSlippageConfig } from '../../context'
import { CenteredDiv, CenteredImg, MainText } from '../../styles'

const BODY = styled(CenteredDiv)`
  flex-direction: column;
  flex: 1;
  width: 100%;
  margin: ${({ theme }) => theme.margins['4x']} 0;

  > div {
    display: flex;
    align-items: center;
    width: 100%;

    &:nth-child(2) {
      margin: ${({ theme }) => theme.margins['3x']} 0;
    }
  }
`

const BUTTON = styled.button`
  flex: 2;
  padding: ${({ theme }) => theme.margins['1x']};
  border: none;
  ${({ theme }) => theme.roundedBorders}
  ${({ theme }) => theme.smallShadow}
  background-color: ${({ theme }) => theme.secondary2};
  cursor: pointer;
  transition: background-color 200ms ease-in-out;

  &:not(:first-child) {
    margin-left: ${({ theme }) => theme.margins['3x']};
  }

  &:hover {
    background-color: ${({ theme }) => theme.secondary3};
  }

  span {
    font-size: 12px;
    font-weight: 600;
  }
`

const TITLE = MainText(styled.span`
  font-size: 12px;
`)

const TOOLTIP_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['1.5x'])}
  margin-left: ${({ theme }) => theme.margins['1x']};
`

const TOOLTIP_TEXT = MainText(
  styled.span`
    font-size: 9px;
  `,
  'white'
)

export const Settings: FC = () => {
  const { mode } = useDarkMode()
  const { slippage, setSlippage } = useSlippageConfig()
  const [value, setValue] = useState(slippage * 100)

  useEffect(() => setSlippage(value / 100), [setSlippage, value])

  const localCSS = css`
    .ant-input-affix-wrapper {
      position: relative;
      display: flex;
      flex: 5;
      height: 38px;
      align-items: center;
      border: ${slippage > 0.05 ? `2px solid ${slippage > 0.15 ? 'red' : 'orange'}` : 'none'} !important;
      background-color: ${mode === 'dark' ? '#474747' : '#808080'};
      box-shadow: 0 4px 15px 2px rgb(0, 0, 0, ${mode === 'dark' ? '0.25' : '0.1'});
    }
  `

  return (
    <BODY>
      <div>
        <TITLE>Slippage tolerance</TITLE>
        <Tooltip
          arrowPointAtCenter
          color="#121212"
          overlayInnerStyle={{ borderRadius: '8px', display: 'flex', alignItems: 'center', padding: '8px' }}
          placement="topLeft"
          title={
            <TOOLTIP_TEXT>
              The minimum amount on how many tokens you will accept, in the event that the price increases or decreases.
            </TOOLTIP_TEXT>
          }
        >
          <TOOLTIP_ICON>
            <img src={`${process.env.PUBLIC_URL}/img/assets/tooltip_${mode}_mode_icon.svg`} alt="tooltip" />
          </TOOLTIP_ICON>
        </Tooltip>
      </div>
      <div>
        <style>{localCSS}</style>
        <Input
          maxLength={6}
          onChange={(x: BaseSyntheticEvent) => {
            const {
              target: { value }
            } = x
            if (!isNaN(value)) {
              setValue(value >= 25 ? 25 : value)
            }
          }}
          pattern="\d+(\.\d+)?"
          placeholder={value.toString()}
          suffix={<span>%</span>}
          value={value}
        />
        <BUTTON onClick={() => setValue(DEFAULT_SLIPPAGE * 100)}>
          <span>Auto</span>
        </BUTTON>
      </div>
      <div>
        {[0.1, 0.5, 1].map((item, index) => (
          <BUTTON key={index} onClick={() => setValue(item)}>
            <span>{item}%</span>
          </BUTTON>
        ))}
      </div>
    </BODY>
  )
}
