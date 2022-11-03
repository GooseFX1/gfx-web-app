import React, { FC } from 'react'
import styled from 'styled-components'
import { GofxHolders } from './GofxHolders'
import SwapVolume from './SwapVolume'
import { TotalLiquidityVolume } from './TotalLiquidityVolume'

const WRAPPER = styled.div`
  font-size: 25px;
  font-weight: 600;
  color: #eeeeee;
`

export const AnalyticsStats: FC = () => (
  <WRAPPER>
    <TotalLiquidityVolume />
    <GofxHolders />
    <SwapVolume />
  </WRAPPER>
)
