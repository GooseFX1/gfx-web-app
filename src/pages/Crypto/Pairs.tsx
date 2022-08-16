import React, { FC } from 'react'
import styled from 'styled-components'
import { PairStats } from './PairStats'
import { useCrypto } from '../../context'

const WRAPPER = styled.div`
  display: -webkit-box;
  width: calc(100% + 2 * ${({ theme }) => theme.margin(3)});
  margin: 0 -${({ theme }) => theme.margin(2)} ${({ theme }) => theme.margin(2)};
  overflow: scroll;
  padding-bottom: 15px;
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
  const { pairs } = useCrypto()
  return (
    <WRAPPER>
      {pairs.map(({ pair, type, marketAddress }, index) => (
        <PairStats key={index} pair={pair} type={type} marketAddress={marketAddress} />
      ))}
    </WRAPPER>
  )
}
