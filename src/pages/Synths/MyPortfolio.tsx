import { FC } from 'react'
import styled from 'styled-components'
import { MyPortfolioHeader } from './MyPorfolioHeader'

const WRAPPER = styled.div`
  color: ${({ theme }) => theme.text1};
`

export const MyPortfolio: FC = () => {
  return (
    <WRAPPER>
      <MyPortfolioHeader></MyPortfolioHeader>
    </WRAPPER>
  )
}
