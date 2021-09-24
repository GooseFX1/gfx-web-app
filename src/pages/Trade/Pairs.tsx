import React, { FC } from 'react'
import styled from 'styled-components'
import { Swiper, SwiperSlide } from 'swiper/react'
import { PairStats } from './PairStats'
import 'swiper/swiper.less'

const PAIRS_LIST = [
  { symbol: 'BTC/USDC', type: 'crypto' },
  { symbol: 'ETH/USDC', type: 'crypto' },
  { symbol: 'SOL/USDC', type: 'crypto' },
  { symbol: 'SRM/USDC', type: 'crypto' },
  { symbol: 'ALEPH/USDC', type: 'crypto' },
  // { symbol: 'LTC/USDC', type: 'crypto' },
  { symbol: 'LINK/USDC', type: 'crypto' }
  // { symbol: 'AAPL', type: 'stock' },
  // { symbol: 'TSLA', type: 'stock' }
]

const WRAPPER = styled(Swiper)`
  margin: ${({ theme }) => theme.margins['3x']} 0;
`

export const Pairs: FC = () => {
  return (
    <WRAPPER spaceBetween={24} slidesPerView={5}>
      {PAIRS_LIST.map(({ symbol, type }, index) => (
        <SwiperSlide>
          <PairStats key={index} symbol={symbol} type={type} />
        </SwiperSlide>
      ))}
    </WRAPPER>
  )
}
