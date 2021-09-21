import React, { FC } from 'react'
import styled from 'styled-components'
import { TVChartContainer } from '../components/TradingView'

const WRAPPER = styled.div`
  color: ${({ theme }) => theme.text1};
`

export const Trade: FC = () => {
  return (
    <WRAPPER>
      <TVChartContainer interval='D' symbol='SRM/USDC' />
    </WRAPPER>
  )
}
