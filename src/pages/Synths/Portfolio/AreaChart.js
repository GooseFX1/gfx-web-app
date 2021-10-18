import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Line } from 'react-chartjs-2'
import { useDarkMode } from '../../../context'

const WRAPPER = styled.div`
  width: '100%';
`

export default function AreaChart() {
  const { mode } = useDarkMode()

  const backgroundColor = useMemo(() => {
    const gradient = document.getElementById('canvas').getContext('2d').createLinearGradient(0, 0, 0, 225)
    gradient.addColorStop(0.25, `rgba(150, 37, 174, ${mode === 'dark' ? 0.58 : 0.3})`)
    gradient.addColorStop(0.95, `rgba(${mode === 'dark' ? '42, 42, 42' : '255, 255, 255'}, 0)`)
    return gradient
  }, [mode])

  const pointBackgroundColor = useMemo(() => {
    const gradient = document.getElementById('canvas').getContext('2d').createLinearGradient(0, 0, 0, 200)
    gradient.addColorStop(0.25, 'rgba(54, 54, 172, 1)')
    gradient.addColorStop(0.95, 'rgba(150, 37, 174, 1)')

    return gradient
  }, [])

  const data = {
    labels: ['', '', ''],
    datasets: [
      {
        label: '',
        active: false,
        data: [50, 50, 50],
        fill: true,
        tension: 0.4,
        pointBorderColor: '#ffffff',
        pointBackgroundColor,
        pointRadius: [0, 6, 0],
        pointHoverRadius: [0, 8, 0],
        pointBorderWidth: [0, 1, 0],
        pointHoverBorderWidth: [0, 2, 0],
        borderWidth: 2,
        backgroundColor,
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
