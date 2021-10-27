import React, { FC } from 'react'
import styled from 'styled-components'
import { Chart } from './Chart'
import { useSynths } from '../../../../context'
import { FlexColumnDiv, SpaceBetweenDiv, SpaceEvenlyDiv } from '../../../../styles'

const INFORMATION = styled(SpaceBetweenDiv)`
  flex-direction: column;
  min-height: 150px;

  span {
    color: ${({ theme }) => theme.text1};
  }
`

const SPECIFIC = styled(SpaceBetweenDiv)<{ $color: string }>`
  &:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.margins['3x']};
  }

  > div {
    ${({ theme }) => theme.measurements(theme.margins['1.5x'])}
    margin-right: ${({ theme }) => theme.margins['1x']};
    ${({ theme }) => theme.roundedBorders}
    background-color: ${({ $color }) => $color};
  }

  > span:nth-child(2) {
    flex: 1;
    text-align: left;
  }

  > span:last-child {
    display: flex;
    align-items: center;
    min-width: 150px;

    &:before {
      content: '';
      display: block;
      height: 2px;
      width: 50px;
      margin: 0 ${({ theme }) => theme.margins['2x']};
      background-color: ${({ theme }) => theme.text1};
    }
  }
`

const WRAPPER = styled(SpaceEvenlyDiv)`
  align-items: center;
  width: 100%;
  padding: 0 ${({ theme }) => theme.margins['3x']};

  > *:last-child {
    margin-left: ${({ theme }) => theme.margins['4x']};
  }
`

export const Debt: FC = () => {
  const { poolAccount } = useSynths()
  const synthColor = {
    gAAPL: { background: 'gray', hover: 'cyan' },
    gBTC: { background: 'yellow', hover: 'cyan' },
    gETH: { background: 'blue', hover: 'cyan' },
    gGOOG: { background: 'green', hover: 'cyan' },
    gTSLA: { background: 'red', hover: 'cyan' },
    gUSD: { background: 'silver', hover: 'cyan' }
  } as { [x: string]: { background: string; hover: string } }

  return (
    <WRAPPER>
      <INFORMATION>
        <FlexColumnDiv>
          {poolAccount.synthsDebt.map(({ percentage, synth }, index) => (
            <SPECIFIC key={index} $color={'silver' /* synthColor[synth].background */}>
              <div />
              <span>{synth}</span>
              <span>{((percentage * 100) || 0).toFixed(2)}%</span>
            </SPECIFIC>
          ))}
        </FlexColumnDiv>
      </INFORMATION>
      <Chart
        data={poolAccount.synthsDebt.map(({ percentage }) => percentage)}
        synths={poolAccount.synthsDebt.map(({ synth }) => synth)}
        synthColor={synthColor}
      />
    </WRAPPER>
  )
}
