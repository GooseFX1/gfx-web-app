import React, { useEffect, useState } from 'react'
import { getTotalLiquidityVolume } from '../../../api/analytics'
import { moneyFormatter } from '../../../utils'
import { GradientText } from '../../NFTs/adminPage/components/UpcomingMints'
export const TotalLiquidityVolume = () => {
  const [farmData, setFarmData] = useState(null)
  useEffect(() => {
    ;(async () => {
      const { data } = await getTotalLiquidityVolume()
      setFarmData(data)
    })()
  }, [])
  return (
    <>
      <div>Liquidity Volume</div>
      <h6>
        <span>
          <GradientText text={'Stake Volume'} fontSize={20} fontWeight={500} /> :
          {farmData ? ` $ ` + moneyFormatter(farmData?.stakeVolume.toFixed(2)) : 'Loading...'}{' '}
        </span>{' '}
        <br />
        <span>
          <GradientText text={'SSL Volume'} fontSize={20} fontWeight={500} /> :
          {farmData ? ` $ ` + moneyFormatter(farmData?.sslVolume.toFixed(2)) : 'Loading...'}{' '}
        </span>{' '}
        <br />
        <span>
          <GradientText text={'Total Volume'} fontSize={20} fontWeight={500} /> :
          {farmData ? ` $ ` + moneyFormatter(farmData?.totalVolume.toFixed(2)) : 'Loading...'}{' '}
        </span>
      </h6>
    </>
  )
}
