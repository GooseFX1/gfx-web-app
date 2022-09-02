import React, { FC } from 'react'
import { Checkbox } from 'antd'
import styled from 'styled-components'
import { useOrder } from '../../context'

const TYPES = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: ${({ theme }) => theme.margin(0.5)};
  padding: 0 ${({ theme }) => theme.margin(0.5)};
  margin-bottom: 20px;
  .label {
    font-size: 16px;
    color: ${({ theme }) => theme.text7};
  }

  > div {
    &:first-child {
      margin-right: 50px;
    }

    span:first-child {
      margin-right: 10px;
      font-size: 15px;
      font-weight: bold;
      color: ${({ theme }) => theme.text2};
    }
    .ant-checkbox-inner {
      height: 20px;
      width: 20px;
    }
    .ant-checkbox {
      background: ${({ theme }) => theme.bg13};
    }
    .ant-checkbox.ant-checkbox-checked {
      .ant-checkbox-inner {
        background: #5855ff;
        border: 1px solid #ffffff;
      }
    }
  }
`

export const PostIocBanner: FC = () => {
  const { order, setOrder } = useOrder()
  const onChangeIOC = (event) =>
    setOrder((prevState) => ({ ...prevState, type: event.target.checked ? 'ioc' : 'limit' }))
  const onChangePost = (event) =>
    setOrder((prevState) => ({ ...prevState, type: event.target.checked ? 'postOnly' : 'limit' }))
  const isPostChecked = order.type === 'postOnly',
    isIocChecked = order.type === 'ioc'
  return (
    <TYPES>
      <div>
        <Checkbox checked={isPostChecked} onChange={onChangePost} />
        <span className="label">Post</span>
      </div>
      <div>
        <Checkbox checked={isIocChecked} onChange={onChangeIOC} />
        <span className="label">IOC</span>
      </div>
    </TYPES>
  )
}
