import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { Chart } from './Chart'
import { SpaceBetweenDiv, SpaceEvenlyDiv } from '../../../../styles'

const INFORMATION = styled(SpaceBetweenDiv)<{ $synthsLength: number }>`
  flex-direction: column;
  min-height: 150px;

  > div {
    display: grid;
    grid-template-columns: repeat(${({ $synthsLength }) => ($synthsLength > 5 ? 2 : 1)}, 1fr);
    flex: 1;
  }

  > span {
    margin-bottom: ${({ theme }) => theme.margins['3x']};
  }
`

const SPECIFIC = styled(SpaceBetweenDiv)<{ $color: string; $synthsLength: number }>`
  ${({ theme, $synthsLength }) =>
    !($synthsLength % 2)
      ? `
    &:nth-child(odd) {
      margin-right: ${theme.margins['3x']};
    }
  `
      : `
    &:not(:last-child) {
      margin-bottom: ${theme.margins['3x']};
    }
  `}

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

    &:before {
      content: '';
      display: block;
      height: 2px;
      width: 50px;
      margin: 0 ${({ theme }) => theme.margins['2x']};
      background-color: white;
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

export const Collateral: FC = () => {
  const synthColor = {
    gAAPL: { background: 'gray', hover: 'cyan' },
    gAMZN: { background: 'yellow', hover: 'cyan' },
    gFB: { background: 'blue', hover: 'cyan' },
    gGOOGL: { background: 'green', hover: 'cyan' },
    gTSLA: { background: 'red', hover: 'cyan' },
    gUSD: { background: 'silver', hover: 'cyan' }
  } as { [x: string]: { background: string; hover: string } }

  const synths = useMemo(() => ['gUSD', 'gTSLA', 'gAMZN', 'gFB', 'gGOOGL'].sort((a, b) => a.localeCompare(b)), [])
  const synthsLength = useMemo(() => synths.length, [synths.length])

  return (
    <WRAPPER>
      <INFORMATION $synthsLength={synthsLength}>
        <span>Debt structure</span>
        <div>
          {synths.map((name, index) => (
            <SPECIFIC key={index} $color={synthColor[name].background} $synthsLength={synthsLength}>
              <div />
              <span>{name}</span>
              <span>50%</span>
            </SPECIFIC>
          ))}
        </div>
      </INFORMATION>
      <Chart synths={synths} synthColor={synthColor} />
    </WRAPPER>
  )
}
