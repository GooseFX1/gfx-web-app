import { useWallet } from '@solana/wallet-adapter-react'
import React, { useEffect, useState, FC } from 'react'
import { fetchTotalVolumeTrade, fetchTotalVolumeTradeChart } from '../../../api/SSL'
import { moneyFormatterWithComma } from '../../../utils'
import { GradientText } from '../../../components'
import { CARD } from './GofxHolders'
import { SwapVolumeChart } from './SwapVolumeChart'
import SwapVolumeDailyChart from './SwapVolumeDailyChart'
import { SwapVolumePieChart } from './SwapVolumePieChart'

const SwapVolume: FC = () => {
  const [swapData, setData] = useState<any>(null)
  const { wallet } = useWallet()
  const [swapDataGraph, setGraphData] = useState([])
  const [swapDailyDataGraph, setDailyGraphData] = useState([])
  const [pieChartData, setPieChartData] = useState([])

  useEffect(() => {
    ;(async () => {
      const data = await fetchTotalVolumeTrade()
      setData(data)
    })()
  }, [])

  useEffect(() => {
    ;(async () => {
      const { data } = await fetchTotalVolumeTradeChart(wallet?.adapter?.publicKey)
      setPieChartData(data)
      const arr = []
      const dailyArr = []
      if (data) {
        for (let i = 0; i < data.length; i++) {
          arr.push([data[i].date.substring(5), parseFloat(data[i].totalVolumeTrade.toFixed(0))])
          dailyArr.push({
            date: data[i].date.substring(5),
            value: parseFloat(data[i].totalVolumeTradeDay.toFixed(0)),
            totalVolume: parseFloat(data[i].totalVolumeTrade.toFixed(0))
          })
        }
      }

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
          Day : {swapData?.totalVolumeTradeDay && moneyFormatterWithComma(swapData?.totalVolumeTradeDay, '$', 2)}
        </CARD>
        <CARD>
          week : {swapData?.totalVolumeTrade && moneyFormatterWithComma(swapData?.totalVolumeTradeWeek, '$', 2)}
        </CARD>
        <CARD>
          month : {swapData?.totalVolumeTrade && moneyFormatterWithComma(swapData?.totalVolumeTradeMonth, '$', 2)}
        </CARD>
        <CARD>
          Total Swap :{swapData?.totalVolumeTrade && moneyFormatterWithComma(swapData?.totalVolumeTrade, '$', 2)}
        </CARD>
      </div>
      <SwapVolumeChart data={swapDataGraph} />
      <SwapVolumeDailyChart rawData={swapDailyDataGraph} />
      <SwapVolumePieChart rawData={pieChartData} />
    </>
  )
}

export default SwapVolume
