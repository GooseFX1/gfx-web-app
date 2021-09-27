import React, { FC } from 'react'
import styled from 'styled-components'
import { PairStats } from './PairStats'
import { FEATURED_PAIRS_LIST } from '../../context'

const WRAPPER = styled.div`
  display: flex;
  width: calc(100% + ${({ theme }) => theme.margins['3x']});
  margin: ${({ theme }) => theme.margins['3x']} 0;
`

export const Pairs: FC = () => {
  return (
    <WRAPPER>
      {FEATURED_PAIRS_LIST.map(({ decimals, market, symbol }, index) => (
        <PairStats key={index} decimals={decimals} market={market} symbol={symbol} />
      ))}
    </WRAPPER>
  )
}
