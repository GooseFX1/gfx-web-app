import React, { FC } from 'react'
import styled from 'styled-components'
import AreaChart from './AreaChart'
import { Header } from './Header'
import { Stats } from './Stats'
import { Timeline } from './Timeline'

const WRAPPER = styled.div`
  height: 100%;
  ${({ theme }) => theme.largeBorderRadius}
  ${({ theme }) => theme.largeShadow}
  background-color: ${({ theme }) => theme.bg3};
`

export const Portfolio: FC = () => {
  return (
    <WRAPPER>
      <Header />
      <AreaChart />
      <Timeline />
      <Stats />
    </WRAPPER>
  )
}
