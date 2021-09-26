import React, { FC } from 'react'
import styled from 'styled-components'
import { PairStats } from './PairStats'

const PAIRS_LIST = [
  { decimals: 1, market: 'serum', symbol: 'BTC/USDC' },
  { decimals: 2, market: 'serum', symbol: 'ETH/USDC' },
  { decimals: 3, market: 'serum', symbol: 'SOL/USDC' },
  { decimals: 2, market: 'pyth', symbol: 'LTC/USD' },
  { decimals: 3, market: 'serum', symbol: 'LINK/USDC' },
  { decimals: 2, market: 'pyth', symbol: 'AAPL/USD' },
  { decimals: 2, market: 'pyth', symbol: 'TSLA/USD' }
]

const WRAPPER = styled.div`
  display: flex;
  width: calc(100% + ${({ theme }) => theme.margins['3x']});
  margin: ${({ theme }) => theme.margins['3x']} 0;
`

export const Pairs: FC = () => {
  return (
    <WRAPPER>
      {PAIRS_LIST.map(({ decimals, market, symbol }, index) => (
        <PairStats key={index} decimals={decimals} market={market} symbol={symbol} />
      ))}
    </WRAPPER>
  )
}
