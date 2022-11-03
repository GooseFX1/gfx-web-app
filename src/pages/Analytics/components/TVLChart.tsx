import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { useState, FC } from 'react'
import { Switch } from 'antd'

export const TVLChart: FC<any> = ({ data }) => {
  const [shwoWeek, setShowWeek] = useState<boolean>(false)
  const displayArr = shwoWeek && data ? [...data].splice(23, 7) : data
  const options = {
    title: {
      text: 'Total Volume Locked'
    },
    xAxis: {
      type: 'category',
      labels: {
        rotation: -20,
        style: {
          fontSize: '8px',
          fontFamily: 'Verdana, sans-serif'
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
        type: 'column',
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
