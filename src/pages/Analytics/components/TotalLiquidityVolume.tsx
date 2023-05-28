import React, { useEffect, useState, FC } from 'react'
import { getTotalLiquidityVolume } from '../../../api/analytics'
import { moneyFormatterWithComma } from '../../../utils'
import { GradientText } from '../../../components/GradientText'
import { TVLChart } from './TVLChart'

export const TotalLiquidityVolume: FC = () => {
  const [farmData, setFarmData] = useState(null)
  const [chartData, setChartData] = useState<number[]>()
  useEffect(() => {
    ;(async () => {
      const { data, arr } = await getTotalLiquidityVolume()
      const chartArr = []
      arr && arr.map((ar) => chartArr.push([ar.date, parseFloat(ar.aggregatedVolume.totalVolume.toFixed(0))]))
      setChartData(chartArr)
      setFarmData(data)
    })()
  }, [])
  return (
    <div>
      Liquidity Volume
      <h5>
        <span>
          <GradientText text={'Stake Volume'} fontSize={20} fontWeight={500} /> :
          {farmData ? (
            ` $ ` + moneyFormatterWithComma(farmData?.aggregatedVolume?.stakeVolume, '', 2)
          ) : (
            <a href="/farm"> If not loading..Please load farm page </a>
          )}{' '}
        </span>{' '}
        <br />
        <span>
          <GradientText text={'SSL Volume'} fontSize={20} fontWeight={500} /> :
          {farmData ? ` $ ` + moneyFormatterWithComma(farmData?.aggregatedVolume?.sslVolume, '', 2) : 'Loading...'}{' '}
        </span>{' '}
        <br />
        <span>
          <GradientText text={'Farm TVL'} fontSize={20} fontWeight={500} /> :
          {farmData
            ? ` $ ` + moneyFormatterWithComma(farmData?.aggregatedVolume?.totalVolume, '', 2)
            : ' Loading...'}{' '}
        </span>
      </h5>
      <TVLChart data={chartData} />
    </div>
  )
}
