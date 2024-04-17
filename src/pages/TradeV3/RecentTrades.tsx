import React, { FC, useCallback, useEffect, useRef, useState } from 'react'
import { httpClient } from '../../api/'
import { RotatingLoader } from '../../components/RotatingLoader'
import { useCrypto } from '../../context'
import { InfoLabel } from './perps/components/PerpsGenericComp'
import { cn } from 'gfx-component-lib'

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
  const [isLoading, setIsLoading] = useState(false)
  const [page, setPage] = useState(1)

  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const getTradeHistory = async (isDevnet: boolean) => {
      setIsLoading(true)
      const res = await httpClient('api-services').post(`${GET_TRADE_HISTORY}`, {
        devnet: isDevnet,
        pairName: 'SOL-PERP',
        page,
        limit: 50
      })
      setTradeHistory(res.data.data)
      setIsLoading(false)
    }
    getTradeHistory(isDevnet)
  }, [isDevnet])

  const fetchTrades = useCallback(async () => {
    if (isLoading) return

    setIsLoading(true)

    const res = await httpClient('api-services').post(`${GET_TRADE_HISTORY}`, {
      devnet: isDevnet,
      pairName: 'SOL-PERP',
      page: page + 1,
      limit: 50
    })
    setTradeHistory((prevItems) => [...prevItems, ...res.data.data])
    setPage((prevPage) => prevPage + 1)

    setIsLoading(false)
  }, [page, isLoading])

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = wrapperRef.current
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        fetchTrades()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [fetchTrades])

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
    <div ref={wrapperRef} className={cn('overflow-auto h-full sm:max-h-[300px]')}>
      <div>
        <div className={cn('flex items-center px-2 my-1.5')}>
          <div className={cn('w-1/3')}>
            <InfoLabel> Price (USDC)</InfoLabel>
          </div>
          <div className={cn('w-1/3 flex justify-center')}>
            <InfoLabel>Size (SOL)</InfoLabel>
          </div>
          <div className={cn('w-1/3 flex justify-end')}>
            <InfoLabel>Time</InfoLabel>
          </div>
        </div>
      </div>
      <div className={cn('overflow-auto h-full')}>
        {tradeHistory.map((trade) => (
          <div key={trade._id} className={cn('flex items-center justify-between px-2')}>
            <p
              className={cn(`w-1/3 text-tiny font-semibold
             ${trade.side === 'Bid' ? `text-green-4` : `text-red-1`}`)}
            >
              {trade.price}
            </p>
            <p className={cn(`w-1/3 flex text-tiny font-semibold justify-center`)}>
              {trade.qty && trade.qty.toFixed(3)}
            </p>
            <p className={cn(`w-1/3 flex text-tiny font-semibold justify-end`)}>
              {unixTimestampToHHMMSS(trade.time)}
            </p>
          </div>
        ))}
        {isLoading && <RotatingLoader text="Fetching trades" textSize={12} iconSize={18} />}
      </div>
    </div>
  )
}
