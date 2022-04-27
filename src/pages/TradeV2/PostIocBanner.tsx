import React, { BaseSyntheticEvent, FC, useMemo } from 'react'
import { Input, Switch, Checkbox } from 'antd'
import styled, { css } from 'styled-components'
import { useOrder } from '../../context'

const TYPES = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: ${({ theme }) => theme.margin(0.5)};
  padding: 0 ${({ theme }) => theme.margin(0.5)};
  margin-bottom: 20px;

  > div {
    &:first-child {
      margin-right: ${({ theme }) => theme.margin(2)};
    }

    span {
      margin-right: ${({ theme }) => theme.margin(1)};
      font-size: 15px;
      font-weight: bold;
      color: ${({ theme }) => theme.text2};
    }
  }
`

export const PostIocBanner: FC = () => {
  const { order, setOrder } = useOrder()
  const onChangeIOC = (event) =>
    setOrder((prevState) => ({ ...prevState, type: event.target.checked ? 'ioc' : 'limit' }))
  const onChangePost = (event) =>
    setOrder((prevState) => ({ ...prevState, type: event.target.checked ? 'postOnly' : 'limit' }))
  let isPostChecked = order.type === 'postOnly',
    isIocChecked = order.type === 'ioc'
  return (
    <TYPES>
      <div>
        <Checkbox checked={isPostChecked} onChange={onChangePost} />
        <span>Post</span>
      </div>
      <div>
        <Checkbox checked={isIocChecked} onChange={onChangeIOC} />
        <span>IOC</span>
      </div>
    </TYPES>
  )
}
