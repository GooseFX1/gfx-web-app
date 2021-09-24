import React, { FC } from 'react'
import styled from 'styled-components'
import { TVChartContainer } from './TradingView'
import { Pairs } from './Pairs'

const WRAPPER = styled.div`
  height: 100%;
  width: 100vw;
  color: ${({ theme }) => theme.text1};
`

export const Trade: FC = () => {
  return (
    <WRAPPER>
      <Pairs />
      <TVChartContainer interval={'D'} symbol={'BTC/USD'} />
    </WRAPPER>
  )
}
