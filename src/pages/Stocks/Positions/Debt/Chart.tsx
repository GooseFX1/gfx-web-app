import React, { FC, useMemo } from 'react'
import { Doughnut } from 'react-chartjs-2'
import styled from 'styled-components'
import { useDarkMode } from '../../../../context'

const WRAPPER = styled.div`
  ${({ theme }) => theme.measurements('180px')}
`

export const Chart: FC<{
  data: number[]
  synths: string[]
  synthColor: { [x: string]: { background: string; hover: string } }
}> = ({ data, synths, synthColor }) => {
  const { mode } = useDarkMode()

  const filteredSynthsColors = useMemo(() => {
    return Object.entries(synthColor).filter(([synth, _]) => synths.includes(synth))
  }, [synthColor, synths])

  return (
    <WRAPPER>
      <Doughnut
        data={{
          labels: synths,
          datasets: [
            {
              label: '# of Votes',
              data,
              backgroundColor: filteredSynthsColors.map(([_, { background }]) => background),
              hoverBackgroundColor: filteredSynthsColors.map(([_, { hover }]) => hover),
              borderColor: mode === 'dark' ? '#2a2a2a' : '#fff',
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
    </WRAPPER>
  )
}
