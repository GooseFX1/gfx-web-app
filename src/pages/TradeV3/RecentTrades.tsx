import React, { FC, useEffect, useState } from 'react'
import tw, { styled } from 'twin.macro'
import { httpClient } from '../../api/'
import { useCrypto } from '../../context'

const HEADER = styled.div`
  ${tw`w-full p-0 text-xs h-7`}
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
  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  & {
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
  }
`
const TRADES = styled.div`
  ${tw`w-full p-0 text-xs overflow-auto`}
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
  }
`

const GET_TRADE_HISTORY = '/perps-apis/getTradeHistory'

export interface ITradesHistory {
  _id: string
  order_id: string
  market: string
  name: string
  side: string
  taker: string
  maker: string
  qty: number
  time: number
  price: number
  is_mainnet: boolean
}

export const RecentTrades: FC = () => {
  const { isDevnet } = useCrypto()
  const [tradeHistory, setTradeHistory] = useState<ITradesHistory[]>([])

  const getTradeHistory = async (isDevnet: boolean) => {
    const res = await httpClient('api-services').post(`${GET_TRADE_HISTORY}`, {
      devnet: isDevnet,
      pairName: 'SOL-PERP'
    })
    setTradeHistory(res.data.data)
  }

  useEffect(() => {
    getTradeHistory(isDevnet)
  }, [isDevnet])

  // time in the array of trades returned is a unix timestamp
  // this converts it into the hh:mm::ss format for display
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
          <span> Price (USDC)</span>
          <span>Size (SOL)</span>
          <span>Time</span>
        </div>
      </HEADER>
      <TRADES>
        {tradeHistory.map((trade) => (
          <div key={trade._id}>
            <span className={trade.side === 'Bid' ? 'bid' : 'ask'}>{trade.price}</span>
            <span>{trade.qty && trade.qty.toFixed(3)}</span>
            <span>{unixTimestampToHHMMSS(trade.time)}</span>
          </div>
        ))}
      </TRADES>
    </WRAPPER>
  )
}
