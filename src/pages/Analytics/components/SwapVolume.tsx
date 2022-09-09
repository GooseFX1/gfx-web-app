import React, { useEffect, useState } from 'react'
import { getSwapVolume } from '../../../api/analytics'
import { moneyFormatterWithComma } from '../../../utils'
import { GradientText } from '../../NFTs/adminPage/components/UpcomingMints'
import { CARD } from './GofxHolders'

const SwapVolume = () => {
  const [swapData, setData] = useState<any>(null)
  useEffect(() => {
    ;(async () => {
      const { data } = await getSwapVolume()
      setData(data)
    })()
  }, [])

  return (
    <>
      <GradientText fontSize={28} fontWeight={600} text={'Swap Volume'} />
      <div style={{ display: 'flex' }}>
        <CARD>
          Past week :{' '}
          {swapData?.ssl_volume_past_week
            ? moneyFormatterWithComma(swapData?.ssl_volume_past_week.toFixed(2), '$')
            : 'Loading...'}
        </CARD>
        <CARD>
          Past month :{' '}
          {swapData?.ssl_volume_past_month
            ? moneyFormatterWithComma(swapData?.ssl_volume_past_month.toFixed(2), '$')
            : 'Loading...'}
        </CARD>
        <CARD>
          Total Swap :
          {swapData?.ssl_volume_total
            ? moneyFormatterWithComma(swapData?.ssl_volume_total.toFixed(2), '$')
            : 'Loading...'}
        </CARD>
      </div>
    </>
  )
}

export default SwapVolume
