import React, { FC } from 'react'
import tw, { styled } from 'twin.macro'

const HEADER = styled.div`
  ${tw`h-[31px] w-full p-0 text-xs h-7`}
  border-bottom: 1px solid ${({ theme }) => theme.tokenBorder};
  & div {
    ${tw`flex justify-between items-center h-full px-2 dark:text-grey-2 text-grey-1`}
    span {
      ${tw`inline-block w-1/3 text-tiny font-medium`}
    }
    span:nth-child(2) {
      ${tw`text-center`}
    }
    span:nth-child(3) {
      ${tw`text-right`}
    }
    div:nth-child(3) {
      ${tw`text-right w-1/3 justify-end`}
    }
  }
`

const WRAPPER = styled.div`
  position: relative;
  width: 100%;
  padding: 0px 0px 0px 0px;
  overflow: auto;
`
const TRADES = styled.div`
  ${tw`h-[31px] w-full p-0 text-xs h-7`}
  & div {
    ${tw`flex justify-between items-center h-full px-2 dark:text-grey-2 text-grey-1`}
    span {
      ${tw`inline-block w-1/3 text-tiny font-medium`}
    }
    span:nth-child(2) {
      ${tw`text-center`}
    }
    span:nth-child(3) {
      ${tw`text-right`}
    }
    div:nth-child(3) {
      ${tw`text-right w-1/3 justify-end`}
    }
    .bid {
        ${tw`text-green-500`}
    }
    .ask {
        ${tw`text-red-500`}
    }
`
export const RecentTrades: FC = () => {
  const data = [
    {
      _id: 'a',
      order_id: 'a',
      market: 'ExyWP65F2zsALQkC2wSQKfR7vrXyPWAG4SLWExVzgbaW',
      name: 'SOL-PERP',
      side: 'Bid',
      taker: 'xyz',
      maker: 'yzjs',
      qty: 1,
      time: 1691559253,
      price: 24.53,
      is_mainnet: false
    },
    {
      _id: 'b',
      order_id: 'b',
      market: 'ExyWP65F2zsALQkC2wSQKfR7vrXyPWAG4SLWExVzgbaW',
      name: 'SOL-PERP',
      side: 'Ask',
      taker: 'xyz',
      maker: 'yzjs',
      qty: 1,
      time: 1691774672737,
      price: 24.53,
      is_mainnet: false
    }
  ]

  for (let i = 0; i < 20; i++) {
    const newItem = {
      _id: `id_${i}`,
      order_id: `order_${i}`,
      market: 'ExyWP65F2zsALQkC2wSQKfR7vrXyPWAG4SLWExVzgbaW',
      name: 'SOL-PERP',
      side: i % 2 === 0 ? 'Bid' : 'Ask', // Alternating between 'Bid' and 'Ask'
      taker: 'xyz',
      maker: 'yzjs',
      qty: 1,
      time: Date.now(),
      price: 24.53,
      is_mainnet: false
    }

    data.push(newItem)
  }

  function unixTimestampToHHMMSS(unixTimestamp: number) {
    const date = new Date(unixTimestamp * 1000) // Convert to milliseconds
    const hours = String(date.getUTCHours()).padStart(2, '0')
    const minutes = String(date.getUTCMinutes()).padStart(2, '0')
    const seconds = String(date.getUTCSeconds()).padStart(2, '0')

    return `${hours}:${minutes}:${seconds}`
  }
  return (
    <WRAPPER>
      <HEADER>
        <div>
          <span>Size (SOL)</span>
          <span> Price (USDC)</span>
          <span>Time</span>
        </div>
      </HEADER>
      <TRADES>
        {data.map((trade) => (
          <div key={trade._id}>
            <span className={trade.side === 'Bid' ? 'bid' : 'ask'}>{trade.price}</span>
            <span>{trade.qty}</span>
            <span>{unixTimestampToHHMMSS(trade.time)}</span>
          </div>
        ))}
      </TRADES>
    </WRAPPER>
  )
}
