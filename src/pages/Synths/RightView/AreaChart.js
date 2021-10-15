import React from 'react'
import styled from 'styled-components'
import { Line } from 'react-chartjs-2'
import { useDarkMode } from '../../../context'

const WRAPPER = styled.div`
  width: '100%';
`

export default function AreaChart() {
  const { mode } = useDarkMode()

  const setGradient = () => {
    var ctx = document.getElementById('canvas').getContext('2d')
    if (mode === 'dark') {
      var darkGradient = ctx.createLinearGradient(0, 0, 0, 225)
      darkGradient.addColorStop(0.25, 'rgba(150, 37, 174, 0.58)')
      darkGradient.addColorStop(0.95, 'rgba(42, 42, 42, 0)')

      return darkGradient
    } else {
      var lightGradient = ctx.createLinearGradient(0, 0, 0, 225)
      lightGradient.addColorStop(0.25, 'rgba(150, 37, 174, 0.30)')
      lightGradient.addColorStop(0.95, 'rgba(255, 255, 255, 0)')

      return lightGradient
    }
  }

  const setPointGradient = () => {
    var ctx = document.getElementById('canvas').getContext('2d')
    var gradient = ctx.createLinearGradient(0, 0, 0, 200)
    gradient.addColorStop(0.25, 'rgba(54, 54, 172, 1)')
    gradient.addColorStop(0.95, 'rgba(150, 37, 174, 1)')

    return gradient
  }
  const data = {
    labels: ['', '', '', '', '', '', '', '', '', '', ''],
    datasets: [
      {
        label: '',
        active: false,
        data: [8, 22, 40, 44, 36, 10, 35, 38, 56, 58, 50],
        fill: true,
        tension: 0.4,
        pointBorderColor: '#ffffff',
        pointBackgroundColor: setPointGradient,
        pointRadius: [0, 0, 0, 0, 0, 0, 6, 0, 0, 0],
        pointHoverRadius: [0, 0, 0, 0, 0, 0, 8, 0, 0, 0],
        pointBorderWidth: [0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
        pointHoverBorderWidth: [0, 0, 0, 0, 0, 0, 2, 0, 0, 0],
        borderWidth: 2,
        backgroundColor: setGradient,
        borderColor: '#ad56c0'
      }
    ]
  }

  const options = {
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    responsive: true,
    scales: {
      x: {
        display: false
      },
      y: {
        display: false
      },
      ticks: {
        display: false
      }
    }
  }

  return (
    <WRAPPER>
      <Line data={data} options={options} id={'canvas'} />
    </WRAPPER>
  )
}
