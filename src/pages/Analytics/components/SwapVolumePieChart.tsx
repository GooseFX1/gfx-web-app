import { Pie } from '@ant-design/plots'
import { ReactElement, FC, useEffect, useState } from 'react'

export const SwapVolumePieChart: FC<{ rawData: any }> = ({ rawData }): ReactElement => {
  const [data, setData] = useState([])
  useEffect(() => {
    const pieObject = {}

    if (rawData.length) {
      for (let i = 0; i < rawData.length; i++) {
        const dayTradeObj = rawData[i].dayTradeVolume
        for (const token in dayTradeObj) {
          pieObject[dayTradeObj[token].tokenPair] = pieObject[dayTradeObj[token].tokenPair]
            ? {
                ...pieObject[dayTradeObj[token].tokenPair],
                value: pieObject[dayTradeObj[token].tokenPair].value + dayTradeObj[token].valueInUSD
              }
            : {
                value: dayTradeObj[token].valueInUSD >= 1 ? dayTradeObj[token].valueInUSD : 0
              }
        }
      }
    }
    // for()
    const pieArr = []
    for (const tokenPair in pieObject) {
      if (pieObject[tokenPair].value > 10) {
        pieArr.push({
          type: tokenPair,
          value: pieObject[tokenPair].value
        })
      }
    }
    setData(pieArr)
  }, [rawData])

  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 0.9,
    label: {
      type: 'inner',
      offset: '-30%',
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: 'center'
      }
    },
    interactions: [
      {
        type: 'element-active'
      }
    ]
  }
  return <Pie {...config} />
}
