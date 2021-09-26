import React, { FC, useState } from 'react'
import styled from 'styled-components'

const WRAPPER = styled.div`
  margin: ${({ theme }) => theme.margins['3x']} 0;
  background-color: ${({ theme }) => theme.bg3};
`

export const Order: FC = () => {
  const [type, setType] = useState<'buy' | 'sell'>('buy')

  return (
    <WRAPPER>
      Order
    </WRAPPER>
  )
}
