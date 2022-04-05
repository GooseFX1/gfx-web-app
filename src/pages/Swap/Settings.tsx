import React, { BaseSyntheticEvent, FC, useEffect, useState } from 'react'
import { Input } from 'antd'
import styled, { css } from 'styled-components'
import { Tooltip } from '../../components'
import { DEFAULT_SLIPPAGE, useDarkMode, useSlippageConfig } from '../../context'
import { CenteredDiv } from '../../styles'

const BODY = styled(CenteredDiv)`
  flex-direction: column;
  flex: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
  margin: ${({ theme }) => theme.margin(4)} 0;

  > div {
    display: flex;
    align-items: center;
    width: 100%;

    &:nth-child(2) {
      margin: ${({ theme }) => theme.margin(3)} 0;
    }
  }
`

const BUTTON = styled.button`
  flex: 2;
  padding: ${({ theme }) => theme.margin(1.5)};
  border: none;
  ${({ theme }) => theme.roundedBorders}
  ${({ theme }) => theme.smallShadow}
  background-color: ${({ theme }) => theme.bg10};
  cursor: pointer;
  transition: background-color 200ms ease-in-out;

  &:not(:first-child) {
    margin-left: ${({ theme }) => theme.margin(3)};
  }

  &:hover {
    background-color: ${({ theme }) => theme.secondary2};
  }

  span {
    font-size: 18px;
    font-weight: 600;
  }
`

const TITLE = styled.span`
  font-size: 18px;
  color: ${({ theme }) => theme.text1};
`

export const Settings: FC<{ setVisible?: (x: boolean) => void }> = ({ setVisible }) => {
  const { mode } = useDarkMode()
  const { slippage, setSlippage } = useSlippageConfig()
  const [value, setValue] = useState(slippage * 100)

  useEffect(() => {
    setSlippage(value / 100)
  }, [value])

  const localCSS = css`
    .ant-input-affix-wrapper {
      position: relative;
      display: flex;
      flex: 5;
      align-items: center;
      height: 38px;
      border: ${slippage > 0.0025 ? `2px solid ${slippage > 0.005 ? 'red' : 'orange'}` : 'none'} !important;
      background-color: ${mode === 'dark' ? '#474747' : '#808080'};
      box-shadow: 0 4px 15px 2px rgb(0, 0, 0, ${mode === 'dark' ? '0.25' : '0.1'});
    }
  `

  const SETTING_INPUT = styled(Input)`
    padding: 1.5rem;
    margin: 1rem 0rem 1.5rem 0rem;
    background-color: ${({ theme }) => theme.bg10 + ' !important'};
  `

  return (
    <BODY>
      <div>
        <TITLE>Slippage tolerance</TITLE>
        <Tooltip>
          The minimum amount on how many tokens you will accept, in the event that the price increases or decreases.
        </Tooltip>
      </div>
      <div>
        {[0.1, 0.5, 1].map((item, index) => (
          <BUTTON
            key={index}
            onClick={() => {
              setValue(item)
            }}
          >
            <span>{item}%</span>
          </BUTTON>
        ))}
      </div>
      <div>
        <TITLE>Or input manually</TITLE>
      </div>
      <div>
        <style>{localCSS}</style>
        <SETTING_INPUT
          maxLength={6}
          onChange={(x: BaseSyntheticEvent) =>
            !isNaN(x.target.value) && setValue(x.target.value >= 25 ? 25 : x.target.value)
          }
          pattern="\d+(\.\d+)?"
          placeholder={value.toString()}
          suffix={<span>%</span>}
          value={value}
        />
      </div>
      <BUTTON
        onClick={() => {
          setSlippage(value)
          setVisible(false)
        }}
      >
        <span style={{ padding: '2rem' }}>Save Settings</span>
      </BUTTON>
    </BODY>
  )
}
