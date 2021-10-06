import React, { FC } from 'react'
import styled, { css } from 'styled-components'
import { Header } from './Header'
import { LimitPrice } from './LimitPrice'
import { PlaceOrder } from './PlaceOrder'
import { Size } from './Size'
import { Total } from './Total'
import { TypeSelector } from './TypeSelector'
import { useOrder } from '../../../context'

const CONTENT = styled.div<{ $display: boolean }>`
  position: relative;
  opacity: ${({ $display }) => ($display ? '1' : '0')};
  max-height: ${({ $display }) => ($display ? '1000px' : '0')};
  overflow: hidden;
  transition: all ${({ theme }) => theme.mainTransitionTime} ease-in-out;

  > div {
    &:first-child {
      margin: ${({ theme }) => theme.margins['3.5x']} 0 ${({ theme }) => theme.margins['1.5x']};
    }

    &:nth-child(2),
    &:nth-child(4) {
      margin-bottom: ${({ theme }) => theme.margins['1.5x']};
    }
  }
`

const WRAPPER = styled.div`
  margin: ${({ theme }) => theme.margins['3x']} 0;
  padding: ${({ theme }) => theme.margins['2x']} ${({ theme }) => theme.margins['2x']}
    ${({ theme }) => theme.margins['1.5x']};
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg3};
`

export const Order: FC = () => {
  const { order } = useOrder()

  const localCSS = css`
    .ant-input-affix-wrapper {
      height: 39px;
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
        <Size />
        <LimitPrice />
        <Total />
        <PlaceOrder />
        <style>{localCSS}</style>
      </CONTENT>
    </WRAPPER>
  )
}
