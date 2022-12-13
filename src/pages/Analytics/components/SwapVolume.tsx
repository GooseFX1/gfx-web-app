import { useWallet } from '@solana/wallet-adapter-react'
import React, { useEffect, useState, FC } from 'react'
import { fetchTotalVolumeTrade, fetchTotalVolumeTradeChart } from '../../../api/SSL/index'
import { moneyFormatterWithComma } from '../../../utils'
import { GradientText } from '../../NFTs/adminPage/components/UpcomingMints'
import { CARD } from './GofxHolders'
import { SwapVolumeChart } from './SwapVolumeChart'

const SwapVolume: FC = () => {
  const [swapData, setData] = useState<any>(null)
  const wallet = useWallet()
  const [swapDataGraph, setGraphData] = useState([])
  useEffect(() => {
    ;(async () => {
      const { data } = await fetchTotalVolumeTrade()
      setData(data)
    })()
  }, [])
  useEffect(() => {
    ;(async () => {
      const { data } = await fetchTotalVolumeTradeChart(wallet?.publicKey)
      const arr = []
      data && data.map((day) => arr.push([day.date, day.totalVolumeTrade]))
      arr.sort(function (a, b) {
        const date1 = new Date(a[0])
        const date2 = new Date(b[0])
        return date1.getTime() - date2.getTime()
      })
      setGraphData(arr)
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
    </>
  )
}

export default SwapVolume
