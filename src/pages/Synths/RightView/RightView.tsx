import { FC } from 'react'
import styled from 'styled-components'
import { Header } from './Header'
import AreaChart from './AreaChart'
import { Timeline } from './Timeline'
import { MyStats } from './MyStats'

const WRAPPER = styled.div`
  padding: 0;
  margin: 0;
  color: ${({ theme }) => theme.text1};
`

export const RightView: FC = () => {
  return (
    <WRAPPER>
      <Header></Header>
      <AreaChart></AreaChart>
      <Timeline></Timeline>
      <MyStats></MyStats>
    </WRAPPER>
  )
}
