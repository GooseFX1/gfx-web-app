import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { Side, SideType } from './Side'

const WRAPPER = styled.div`
  margin: ${({ theme }) => theme.margins['3x']} 0;
  background-color: ${({ theme }) => theme.bg3};
`

export const Order: FC = () => {
  const [side, setSide] = useState<SideType>('buy')

  return (
    <WRAPPER>
      <Side setSide={setSide} side={side} />
    </WRAPPER>
  )
}
