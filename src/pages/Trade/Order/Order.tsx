import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { Header, Side } from './Header'

const WRAPPER = styled.div`
  margin: ${({ theme }) => theme.margins['3x']} 0;
  background-color: ${({ theme }) => theme.bg3};
`

export const Order: FC = () => {
  const [side, setSide] = useState<Side>('buy')

  return (
    <WRAPPER>
      <Header setSide={setSide} side={side} />
    </WRAPPER>
  )
}
