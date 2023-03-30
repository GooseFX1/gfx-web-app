import { useWallet } from '@solana/wallet-adapter-react'
import React, { useEffect, useState, FC } from 'react'
import { fetchTotalVolumeTrade, fetchTotalVolumeTradeChart } from '../../../api/SSL/index'
import { moneyFormatterWithComma } from '../../../utils'
import { GradientText } from '../../NFTs/adminPage/components/UpcomingMints'
import { CARD } from './GofxHolders'
import { SwapVolumeChart } from './SwapVolumeChart'
import SwapVolumeDailyChart from './SwapVolumeDailyChart'

const SwapVolume: FC = () => {
  const [swapData, setData] = useState<any>(null)
  const { wallet } = useWallet()
  const [swapDataGraph, setGraphData] = useState([])
  const [swapDailyDataGraph, setDailyGraphData] = useState([])

  useEffect(() => {
    ;(async () => {
      const data = await fetchTotalVolumeTrade()
      setData(data)
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const { data } = await fetchTotalVolumeTradeChart(wallet?.adapter?.publicKey)
      const arr = []
      const dailyArr = []
      data && data.map((day) => arr.push([day.date.substring(5), parseFloat(day.totalVolumeTrade.toFixed(0))]))
      data &&
        data.map((day) =>
          dailyArr.push({
            date: day.date.substring(5),
            value: parseFloat(day.totalVolumeTradeDay.toFixed(0)),
            totalVolume: parseFloat(day.totalVolumeTrade.toFixed(0))
          })
        )
      arr.sort(function (a, b) {
        const date1 = new Date(a[0])
        const date2 = new Date(b[0])
        return date1.getTime() - date2.getTime()
      })
      setGraphData(arr)
      setDailyGraphData(dailyArr)
    })()
  }, [])

  return (
    <>
      <GradientText fontSize={28} fontWeight={600} text={'Swap Volume'} />
      <div style={{ display: 'flex' }}>
        <CARD>
          Day :{' '}
          {swapData?.totalVolumeTradeDay && moneyFormatterWithComma(swapData?.totalVolumeTradeDay.toFixed(2), '$')}
        </CARD>
        <CARD>
          week :{' '}
          {swapData?.totalVolumeTrade && moneyFormatterWithComma(swapData?.totalVolumeTradeWeek.toFixed(2), '$')}
        </CARD>
        <CARD>
          month :{' '}
          {swapData?.totalVolumeTrade && moneyFormatterWithComma(swapData?.totalVolumeTradeMonth.toFixed(2), '$')}
        </CARD>
        <CARD>
          Total Swap :
          {swapData?.totalVolumeTrade && moneyFormatterWithComma(swapData?.totalVolumeTrade.toFixed(2), '$')}
        </CARD>
      </div>
      <SwapVolumeChart data={swapDataGraph} />
      <SwapVolumeDailyChart rawData={swapDailyDataGraph} />
    </>
  )
}

export default SwapVolume
