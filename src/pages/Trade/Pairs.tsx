import React, { FC } from 'react'
import { PairStats } from './PairStats'

const PAIRS_LIST = [
  { symbol: 'BTC/USDC', type: 'crypto' },
  { symbol: 'ETH/USDC', type: 'crypto' },
  { symbol: 'SOL/USDC', type: 'crypto' },
  // { symbol: 'LTC/USDC', type: 'crypto' },
  { symbol: 'LINK/USDC', type: 'crypto' },
  // { symbol: 'AAPL', type: 'stock' },
  // { symbol: 'TSLA', type: 'stock' }
]

export const Pairs: FC = () => {
  return (
    <div>
      {PAIRS_LIST.map(({ symbol, type }, index) => <PairStats key={index} symbol={symbol} type={type} />)}
    </div>
  )
}
