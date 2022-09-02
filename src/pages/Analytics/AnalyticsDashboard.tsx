import React from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { AnalyticsTable } from './AnalyticsTable'

const WRAPPER = styled.div`
  ${tw`flex`}
  min-height: 800px;
  padding-top: 60px;
  height: 90vh;
`

const AnalyticsDashboard = () => (
  <WRAPPER>
    <AnalyticsTable />
  </WRAPPER>
)

export default AnalyticsDashboard
