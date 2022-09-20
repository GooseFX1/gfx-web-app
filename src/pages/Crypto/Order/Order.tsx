import React, { FC } from 'react'
import styled, { css } from 'styled-components'
import { Header } from './Header'
import { LimitPrice } from './LimitPrice'
import { PlaceOrder } from './PlaceOrder'
import { Size } from './Size'
import { Total } from './Total'
import { TypeSelector } from './TypeSelector'
import { useOrder } from '../../../context'
import { PostIocBanner } from '../../TradeV2/PostIocBanner'

const CONTENT = styled.div<{ $display: boolean }>`
  position: relative;
  overflow: hidden;
  transition: all ${({ theme }) => theme.mainTransitionTime} ease-in-out;

  > div {
    &:first-child {
      margin: ${({ theme }) => theme.margin(3.5)} 0 ${({ theme }) => theme.margin(1.5)};
    }
  }

  .color-style > span {
    color: #7d7d7d;
  }
`

const WRAPPER = styled.div`
  margin-bottom: ${({ theme }) => theme.margin(3)};
  padding: ${({ theme }) => theme.margin(2)} ${({ theme }) => theme.margin(2)};
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg3};
  height: 100%;
`

export const Order: FC = () => {
  const { order } = useOrder()

  const localCSS = css`
    .ant-input-affix-wrapper {
      height: 50px;
      border: none;
      border-radius: 8px;
    }

    .ant-input-affix-wrapper > input.ant-input {
      text-align: left;
    }
  `

  return (
    <WRAPPER>
      <Header />
      <CONTENT $display={!order.isHidden}>
        <TypeSelector />
        <LimitPrice />
        <Size />
        <Total />
        <PostIocBanner />
        <PlaceOrder />
        <style>{localCSS}</style>
      </CONTENT>
    </WRAPPER>
  )
}
