import React, { FC } from 'react'
import styled from 'styled-components'
import { Header } from './Header'
import { LimitPrice } from './LimitPrice'
import { PlaceOrder } from './PlaceOrder'
import { Size } from './Size'
import { TypeSelector } from './TypeSelector'
import { useOrder } from '../../../context'

const CONTENT = styled.div<{ $display: boolean }>`
  max-height: ${({ $display }) => ($display ? '1000px' : '0')};
  opacity: ${({ $display }) => ($display ? '1' : '0')};
  overflow: hidden;
  transition: all ${({ theme }) => theme.mainTransitionTime} ease-in-out;

  > div {
    &:first-child {
      margin: ${({ theme }) => theme.margins['3.5x']} 0 ${({ theme }) => theme.margins['1.5x']};
    }

    &:nth-child(2) {
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

  return (
    <WRAPPER>
      <Header />
      <CONTENT $display={!order.isHidden}>
        <TypeSelector />
        <Size />
        <LimitPrice />
        <PlaceOrder />
      </CONTENT>
    </WRAPPER>
  )
}
