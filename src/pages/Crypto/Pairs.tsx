import React, { FC } from 'react'
import styled from 'styled-components'
import { PairStats } from './PairStats'
import { FEATURED_PAIRS_LIST } from '../../context'

const WRAPPER = styled.div`
  display: -webkit-box;
  width: calc(100% + 2 * ${({ theme }) => theme.margin(3)});
  margin: 0 -${({ theme }) => theme.margin(3)} ${({ theme }) => theme.margin(3)};
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
    margin-left: ${({ theme }) => theme.margin(3)};

    &:last-child {
      margin-right: ${({ theme }) => theme.margin(3)};
    }
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    width: 100vw;
    margin-right: -${({ theme }) => theme.margin(1)};
    margin-left: -${({ theme }) => theme.margin(1)};
  `}
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
