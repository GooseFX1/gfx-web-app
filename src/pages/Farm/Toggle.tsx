import React from 'react'
import styled from 'styled-components'
import { Switch } from 'antd'

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
    height: 45px;
    background: #000;
    border: none;
    &.ant-switch-checked {
      background: linear-gradient(to bottom, #9625ae, #411c48);
    }
  }
  .gray {
    width: 97px;
    .ant-switch-handle {
      top: 0;
      left: 0;
      width: 45px;
      height: 45px;
      transition: all 0.3s ease;
      &:before {
        background: linear-gradient(to bottom, #606060, #636363, #1c1b1b);
        border-radius: 50%;
      }
    }
    &.ant-switch-checked {
      .ant-switch-handle {
        left: calc(100% - 45px);
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
      }
    }
  }

  .text {
    font-family: Montserrat;
    font-size: 14px;
    font-weight: 600;
    text-align: left;
    color: #fff;
    margin-left: ${({ theme }) => theme.margins['2x']};
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

export const Toggle = ({ text, defaultChecked, checkedChildren, unCheckedChildren, className, ...rest }: IToggle) => (
  <STYLED_TOGGLE>
    <Switch
      className={`${className} ${text ? 'gray' : 'purple'}`}
      defaultChecked={defaultChecked}
      checkedChildren={checkedChildren}
      unCheckedChildren={unCheckedChildren}
      {...rest}
    />
    {text && <div className="text">{text}</div>}
  </STYLED_TOGGLE>
)
