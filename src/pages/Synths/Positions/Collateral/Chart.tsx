import React, { FC } from 'react'
import { Doughnut } from 'react-chartjs-2'
import styled from 'styled-components'
import { useDarkMode } from '../../../../context'

const CHARTBOX = styled.div`
  height: 180px;
  width: 180px;
`

export const Chart: FC<{
  synths: string[]
  synthColor: { [x: string]: { background: string; hover: string } }
}> = ({ synths, synthColor }) => {
  const { mode } = useDarkMode()
  const value = mode === 'dark' ? '#2a2a2a' : '#fff'

  return (
    <CHARTBOX>
      <Doughnut
        data={{
          labels: synths,
          datasets: [
            {
              label: '# of Votes',
              data: [20, 30, 50, 12, 100],
              backgroundColor: Object.values(synthColor).map(({ background }) => background),
              hoverBackgroundColor: Object.values(synthColor).map(({ hover }) => hover),
              borderColor: value,
              borderWidth: 3
            }
          ]
        }}
        options={{
          // @ts-ignore
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
