import { FC } from 'react'
import styled from 'styled-components'
import { MyPortfolioHeader } from './MyPorfolioHeader'
import MyPortfolioChart from './MyPortfolioChart'

const WRAPPER = styled.div`
  padding: 0;
  margin: 0;
  color: ${({ theme }) => theme.text1};
`

export const MyPortfolio: FC = () => {
  return (
    <WRAPPER>
      <MyPortfolioHeader></MyPortfolioHeader>
      <MyPortfolioChart></MyPortfolioChart>
    </WRAPPER>
  )
}
