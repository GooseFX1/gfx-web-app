import React, { FC, ReactElement } from 'react'
import { DualAxes } from '@ant-design/plots'

export const SwapVolumeDailyChart: FC<{ rawData: any }> = ({ rawData }): ReactElement => {
  const data = rawData

  const config = {
    data: [data, data],
    xField: 'date',
    yField: ['value', 'totalVolume'],
    geometryOptions: [
      {
        geometry: 'column'
      },
      {
        geometry: 'line',
        lineStyle: {
          lineWidth: 0
        }
      }
    ]
  }
  return <DualAxes {...config} />
}

export default SwapVolumeDailyChart
