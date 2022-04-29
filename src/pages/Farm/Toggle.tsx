import React from 'react'
import styled from 'styled-components'
import { Switch } from 'antd'
import { useFarmContext } from '../../context/farm'

const STYLED_TOGGLE = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  .ant-switch-checked {
    &:focus {
      box-shadow: none;
    }
  }
  .ant-switch {
    height: 30px;
    background: ${({ theme }) => theme.walletModalWallet};
    border: none;
    &.ant-switch-checked {
      background: linear-gradient(267.85deg, #dc1fff 18.13%, #f7931a 98.67%);
      opacity: ${({ theme }) => theme.opacity};
    }
  }
  .gray {
    width: 62px;
    .ant-switch-handle {
      top: 0;
      left: 0;
      width: 30px;
      height: 30px;
      transition: all 0.3s ease;
      &:before {
        background: linear-gradient(to bottom, #606060, #636363, #1c1b1b);
        border-radius: 50%;
      }
    }
    &.ant-switch-checked {
      .ant-switch-handle {
        left: calc(100% - 30px);
        transition: all 0.3s ease;
      }
    }
  }

  .purple {
    width: 142px;
    .ant-switch-inner {
      width: 89px;
      height: 45px;
      line-height: 43px;
      font-family: Montserrat;
      font-size: 14px;
      font-weight: 600;
      text-align: center;
      color: #fff;
      background: #3735bb;
      border-color: #3735bb;
      border-radius: 45px;
      margin-left: 0;
      transition: margin 0.3s ease;
    }
    .ant-switch-handle {
      display: none;
    }
    &.ant-switch-checked {
      background: black;
      .ant-switch-inner {
        background: #bb3535;
        margin-right: 0;
        margin-left: auto;
        transition: margin 0.3s ease;
        background: #bb3535;
        border-color: #bb3535;
      }
    }
  }

  .text {
    font-family: Montserrat;
    font-size: 14px;
    font-weight: 600;
    text-align: left;
    color: ${({ theme }) => theme.text4};
    margin-left: ${({ theme }) => theme.margin(2)};
    max-width: 77px;
  }
`
interface IToggle {
  text?: string
  defaultChecked?: boolean
  checkedChildren?: string
  unCheckedChildren?: string
  className?: string
  [x: string]: any
}

export const Toggle = ({ text, defaultChecked, checkedChildren, unCheckedChildren, className, ...rest }: IToggle) => {
  const { toggleDeposited } = useFarmContext()
  return (
    <STYLED_TOGGLE>
      <Switch
        className={`${className} ${text ? 'gray' : 'purple'}`}
        defaultChecked={defaultChecked}
        checkedChildren={checkedChildren}
        unCheckedChildren={unCheckedChildren}
        onChange={(e) => toggleDeposited(e)}
      />
      {text && <div className="text">{text}</div>}
    </STYLED_TOGGLE>
  )
}
