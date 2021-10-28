import React, { FC } from 'react'
import styled from 'styled-components'
import { PairStats } from './PairStats'
import { FEATURED_PAIRS_LIST } from '../../context'

const WRAPPER = styled.div`
  display: -webkit-box;
  width: calc(100% + 2 * ${({ theme }) => theme.margins['3x']});
  margin: 0 -${({ theme }) => theme.margins['3x']} ${({ theme }) => theme.margins['3x']};
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
    margin-left: ${({ theme }) => theme.margins['3x']};

    &:last-child {
      margin-right: ${({ theme }) => theme.margins['3x']};
    }
  }
`

export const Pairs: FC = () => {
  return (
    <WRAPPER>
      {FEATURED_PAIRS_LIST.map(({ decimals, pair, type }, index) => (
        <PairStats key={index} decimals={decimals} pair={pair} type={type} />
      ))}
    </WRAPPER>
  )
}
