import React, { FC } from 'react'
import styled from 'styled-components'
import { PairStats } from './PairStats'
import { FEATURED_PAIRS_LIST } from '../../context'

const WRAPPER = styled.div`
  display: -webkit-box;
  width: calc(100% + ${({ theme }) => theme.margins['3x']});
  margin: ${({ theme }) => theme.margins['3x']} 0;
  overflow: scroll;
  -ms-overflow-style: none;
  scrollbar-width: none;
  -webkit-overflow-scrolling: touch;

  &:after {
    content: '';
    display: block;
    width: 0.1px;
  }

  &::-webkit-scrollbar {
    display: none;
  }

  > div {
    margin-right: ${({ theme }) => theme.margins['3x']};
  }
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
