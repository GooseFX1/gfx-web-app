import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import styled from 'styled-components'
import { useDarkMode } from '../../../../context'

const CHARTBOX = styled.div`
  height: 180px;
  width: 180px;
`

export default function DoughnutChart() {
  const { mode } = useDarkMode()
  const value = mode === 'dark' ? '#2a2a2a' : '#fff'

  return (
    <CHARTBOX>
      <Doughnut
        data={{
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [
            {
              label: '# of Votes',
              data: [20, 30, 50, 100],
              backgroundColor: ['#379620', '#5a58e9', '#bc4747', '#7d338c'],
              hoverBackgroundColor: ['#379620', '#5a58e9', '#bc4747', '#7d338c'],
              borderColor: value,
              borderWidth: 3
            }
          ]
        }}
        options={{
          cutout: 60,
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              enabled: false
            }
          }
        }}
      />
    </CHARTBOX>
  )
}
