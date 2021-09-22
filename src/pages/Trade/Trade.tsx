import React, { FC } from 'react'
import styled from 'styled-components'
import { TVChartContainer } from './TradingView'
import { PairStats } from './PairStats'

const WRAPPER = styled.div`
  color: ${({ theme }) => theme.text1};
`

export const Trade: FC = () => {
  return (
    <WRAPPER>
      <TVChartContainer interval='D' symbol='SRM/USDC' />
      <PairStats symbol="ETH/USDC" />
    </WRAPPER>
  )
}
