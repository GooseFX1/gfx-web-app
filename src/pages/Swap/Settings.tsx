import React, { BaseSyntheticEvent, FC, useEffect, useState } from 'react'
import { Input } from 'antd'
import styled, { css } from 'styled-components'
import { Tooltip } from '../../components'
import { useDarkMode, useSlippageConfig } from '../../context'
import { CenteredDiv } from '../../styles'

const BUTTON = styled.button`
  padding: ${({ theme }) => theme.margin(1.5)};
  border: none;
  ${({ theme }) => theme.roundedBorders}
  background-color: ${({ theme }) => theme.bg10};
  transition: background-color 200ms ease-in-out;

  &:hover,
  &:active {
    background-color: ${({ theme }) => theme.secondary2};
  }

  span {
    font-size: 18px;
    font-weight: 600;
  }
`

const SETTING_BUTTON = styled(BUTTON)<{ clicked: boolean }>`
  width: 166px;
  height: 50px;
  background-color: ${({ clicked, theme }) => (clicked ? theme.secondary2 : theme.bg10)};

  @media (max-width: 500px) {
    width: 83px;
    height: 45px;
    font-size: 18px;
  }
`

const SAVE_BUTTON = styled(BUTTON)`
  height: 50px;
  width: 222px;
  margin-top: 30px;

  &:hover {
    background-color: #5855ff;
  }
`

const TITLE = styled.span`
  font-size: 18px;
  color: ${({ theme }) => theme.text13};
`

const BUTTON_CONTAINER = styled(CenteredDiv)`
  justify-content: space-between;
  margin: 0 !important;
  padding: 24px 12px;

  @media (max-width: 500px) {
    width: 100%;
  }
`

const SETTING_INPUT = styled(Input)`
  padding: 1.5rem;
  height: 50px;
  margin: 1rem 0rem 1.5rem 0rem;
  background-color: ${({ theme }) => theme.bg10 + ' !important'};
  box-shadow: 0 0 0 0 !important;
`

export const Settings: FC<{ setVisible?: (x: boolean) => void }> = ({ setVisible }) => {
  const { mode } = useDarkMode()
  const { slippage, setSlippage } = useSlippageConfig()
  const [value, setValue] = useState(slippage * 100)

  useEffect(() => {
    setSlippage(value / 100)
  }, [value])

  const BODY = styled(CenteredDiv)`
    flex-direction: column;
    flex: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: Montserrat;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    margin-top: ${({ theme }) => theme.margin(4)};
    padding-bottom: ${({ theme }) => theme.margin(2.5)};

    > div {
      display: flex;
      align-items: center;
      width: 100%;

      &:nth-child(2) {
        margin: ${({ theme }) => theme.margin(3)} 0;
      }
    }

    .ant-input-affix-wrapper {
      position: relative;
      display: flex;
      flex: 5;
      align-items: center;
      height: 50px;
      border: ${slippage > 0.001 ? `2px solid ${slippage > 0.005 ? 'red' : 'orange'}` : 'none'} !important;
      background-color: ${mode === 'dark' ? '#474747' : '#808080'};
      box-shadow: 0 4px 15px 2px rgb(0, 0, 0, ${mode === 'dark' ? '0.25' : '0.1'});
    }

    .modal-close-icon > img {
      height: 24px;
      width: 24px;
    }
  `

  return (
    <BODY>
      <div>
        <TITLE>Slippage tolerance</TITLE>
        <Tooltip notInherit={true}>
          The minimum amount on how many tokens you will accept, in the event that the price increases or decreases.
        </Tooltip>
      </div>
      <BUTTON_CONTAINER>
        {[0.1, 0.5, 1].map((item, index) => (
          <SETTING_BUTTON
            key={index}
            clicked={item === value}
            onClick={() => {
              setValue(item)
            }}
          >
            <span>{item}%</span>
          </SETTING_BUTTON>
        ))}
      </BUTTON_CONTAINER>
      <div>
        <TITLE>Or input manually</TITLE>
      </div>
      <div>
        {/* <style>{localCSS}</style> */}
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
      <SAVE_BUTTON
        onClick={() => {
          setSlippage(value)
          setVisible(false)
        }}
      >
        <span>Save Settings</span>
      </SAVE_BUTTON>
    </BODY>
  )
}
