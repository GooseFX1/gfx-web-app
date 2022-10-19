import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useState } from 'react'
import { Switch } from 'antd'

export const SwapVolumeChart = ({ data }: any) => {
  console.log(data)
  const [shwoWeek, setShowWeek] = useState<boolean>(false)
  const displayArr = shwoWeek && data ? [...data].splice(23, 7) : data
  const options = {
    title: {
      text: 'Swap Volume'
    },
    xAxis: {
      type: 'category',
      labels: {
        rotation: -20,
        style: {
          fontSize: '8px'
        }
      }
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Volume (in Dollars)'
      }
    },
    series: [
      {
        // type: 'column',
        data: displayArr
      }
    ]
  }

  return (
    <>
      {!shwoWeek ? 'Monthly data' : 'Weekly data'} <Switch onChange={() => setShowWeek((prev) => !prev)} />
      <HighchartsReact highcharts={Highcharts} options={options} />
    </>
  )
}
