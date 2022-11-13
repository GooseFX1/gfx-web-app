import React, { BaseSyntheticEvent, FC, useState } from 'react'
import { Input } from 'antd'
import styled from 'styled-components'
import { Tooltip } from '../../components'
import { useDarkMode, useSlippageConfig } from '../../context'
import { CenteredDiv } from '../../styles'

const BUTTON = styled.button`
  padding: ${({ theme }) => theme.margin(1.5)};
  border: none;
  ${({ theme }) => theme.roundedBorders}
  background-color: ${({ theme }) => theme.bg22};
  transition: background-color 200ms ease-in-out;
  height: 50px;

  &:active {
    background-image: linear-gradient(96deg, #f7931a 1%, #ac1cc7 99%);
  }

  span {
    font-size: 18px;
    font-weight: 600;
  }
`

const SETTING_BUTTON = styled(BUTTON)<{ $curSlippage: boolean }>`
  width: 166px;
  height: 50px;
  background: ${({ $curSlippage, theme }) =>
    $curSlippage ? 'linear-gradient(96deg, #f7931a 1%, #ac1cc7 99%)' : theme.bg22};

  span {
    color: ${({ theme, $curSlippage }) => ($curSlippage ? 'white' : theme.text9)};
  }

  @media (max-width: 500px) {
    width: 83px;
    height: 45px;
    font-size: 18px;
  }
`

const SAVE_BUTTON = styled(BUTTON)<{ $pendingUpdate: boolean }>`
  width: 222px;
  height: 50px;
  border-radius: 35px;
  background-color: ${({ theme, $pendingUpdate }) => ($pendingUpdate ? '#5855ff' : theme.bg22)};

  span {
    color: ${({ theme, $pendingUpdate }) => ($pendingUpdate ? 'white' : theme.text9)};
    font-size: 15px;
  }

  &:hover {
    background-color: #5855ff;
    span {
      color: white;
    }
  }
`

const TITLE = styled.span`
  font-size: 18px;
  font-weight: 600;
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
  height: 50px;
  font-size: 20px;
  margin: 20px 0rem 30px 0rem;
  padding: 0 20px;
  background-color: ${({ theme }) => theme.bg22 + ' !important'};
  box-shadow: 0 0 0 0 !important;
  color: ${({ theme }) => theme.text6};

  input,
  .ant-input-suffix {
    color: ${({ theme }) => theme.text6};
  }
`

export const Settings: FC<{ setVisible?: (x: boolean) => void }> = ({ setVisible }) => {
  const { mode } = useDarkMode()
  const { slippage, setSlippage } = useSlippageConfig()
  const [value, setValue] = useState<number>(slippage)

  const handleSlippageChange = (x: BaseSyntheticEvent) => {
    !isNaN(x.target.value) && setValue(parseFloat(x.target.value) / 100)
  }

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
    margin-top: 26px;

    > div {
      display: flex;
      align-items: center;
      width: 100%;

      &:nth-child(2) {
        margin: ${({ theme }) => theme.margin(3)} 0;
      }
    }

    .ant-input {
      font-weight: 600;
      font-size: 20px;
      line-height: 22px;
      text-align: left;
    }

    .ant-input-affix-wrapper {
      position: relative;
      display: flex;
      flex: 1;
      align-items: center;
      height: 50px;
      border: none;
      font-size: 20px;
      background-color: ${mode === 'dark' ? '#474747' : '#808080'};
      box-shadow: 0 4px 15px 2px rgb(0, 0, 0, ${mode === 'dark' ? '0.25' : '0.1'});
    }
  `

  return (
    <BODY>
      <div>
        <TITLE>Slippage tolerance</TITLE>
        <Tooltip notInherit={true} placement="top">
          The minimum amount on how many tokens you will accept, in the event that the price increases or
          decreases.
        </Tooltip>
      </div>
      <BUTTON_CONTAINER>
        {[0.001, 0.005, 0.01].map((slippage, index) => (
          <SETTING_BUTTON key={index} $curSlippage={slippage === value} onClick={() => setValue(slippage)}>
            <span>{slippage * 100}%</span>
          </SETTING_BUTTON>
        ))}
      </BUTTON_CONTAINER>
      <div>
        <TITLE>Or input manually</TITLE>
      </div>
      <div>
        <SETTING_INPUT
          maxLength={6}
          onChange={handleSlippageChange}
          pattern="\d+(\.\d+)?"
          placeholder={'0.00'}
          suffix={<span> % </span>}
          value={value > 0 ? value * 100 : ''}
        />
      </div>
      <SAVE_BUTTON
        $pendingUpdate={value !== slippage}
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
