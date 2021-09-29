import React, { FC } from 'react'
import styled from 'styled-components'
import { Header } from './Header'
import { OrderButton } from './OrderButton'
import { TypeSelector } from './TypeSelector'
import { OrderProvider } from '../../../context'

const WRAPPER = styled.div`
  margin: ${({ theme }) => theme.margins['3x']} 0;
  padding: ${({ theme }) => theme.margins['2x']} ${({ theme }) => theme.margins['2x']} ${({ theme }) => theme.margins['1.5x']};
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg3};
  
  > div:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.margins['1.5x']};
  }
`

export const Order: FC = () => {
  return (
    <OrderProvider>
      <WRAPPER>
        <Header />
        <TypeSelector />
        <OrderButton />
      </WRAPPER>
    </OrderProvider>
  )
}
