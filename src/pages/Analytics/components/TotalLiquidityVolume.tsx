import React, { useEffect, useState } from 'react'
import { getTotalLiquidityVolume } from '../../../api/analytics'
import { moneyFormatterWithComma } from '../../../utils'
import { GradientText } from '../../NFTs/adminPage/components/UpcomingMints'
import { CARD } from './GofxHolders'
export const TotalLiquidityVolume = () => {
  const [farmData, setFarmData] = useState(null)
  useEffect(() => {
    ;(async () => {
      const { data } = await getTotalLiquidityVolume()
      setFarmData(data)
    })()
  }, [])
  return (
    <div>
      <CARD>Liquidity Volume</CARD>
      <h5>
        <span>
          <GradientText text={'Stake Volume'} fontSize={20} fontWeight={500} /> :
          {farmData ? (
            ` $ ` + moneyFormatterWithComma(farmData?.aggregatedVolume?.stakeVolume?.toFixed(2))
          ) : (
            <a href="/farm"> If not loading..Please load farm page </a>
          )}{' '}
        </span>{' '}
        <br />
        <span>
          <GradientText text={'SSL Volume'} fontSize={20} fontWeight={500} /> :
          {farmData
            ? ` $ ` + moneyFormatterWithComma(farmData?.aggregatedVolume?.sslVolume?.toFixed(2))
            : 'Loading...'}{' '}
        </span>{' '}
        <br />
        <span>
          <GradientText text={'Farm TVL'} fontSize={20} fontWeight={500} /> :
          {farmData
            ? ` $ ` + moneyFormatterWithComma(farmData?.aggregatedVolume?.totalVolume?.toFixed(2))
            : ' Loading...'}{' '}
        </span>
      </h5>
    </div>
  )
}
