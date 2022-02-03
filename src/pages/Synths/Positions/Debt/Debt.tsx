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
    margin-bottom: ${({ theme }) => theme.margin(3)};
  }

  > div {
    ${({ theme }) => theme.measurements(theme.margin(1.5))}
    margin-right: ${({ theme }) => theme.margin(1)};
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
      margin: 0 ${({ theme }) => theme.margin(2)};
      background-color: ${({ theme }) => theme.text1};
    }
  }
`

const WRAPPER = styled(SpaceEvenlyDiv)`
  align-items: center;
  width: 100%;
  padding: 0 ${({ theme }) => theme.margin(3)};

  > *:last-child {
    margin-left: ${({ theme }) => theme.margin(4)};
  }
`

export const Debt: FC = () => {
  const { poolAccount } = useSynths()
  const synthColor = {
    gAAPL: { background: 'red', hover: 'red' },
    gAMC: { background: 'red', hover: 'red' },
    gAMZN: { background: 'red', hover: 'red' },
    gBNB: { background: 'rgb(233, 188, 78)', hover: 'rgb(253, 208, 98)' },
    gBTC: { background: 'rgb(232, 152, 61)', hover: 'rgb(252, 172, 81)' },
    gCOPE: { background: 'rgb(0, 0, 0)', hover: 'rgb(20, 20, 20)' },
    gDOGE: { background: 'rgb(182, 160, 71)', hover: 'rgb(202, 180, 91)' },
    gETH: { background: 'rgb(108, 125, 223)', hover: 'rgb(128, 145, 243)' },
    gFTT: { background: 'rgb(73, 163, 191)', hover: 'rgb(93, 183, 211)' },
    gGE: { background: 'red', hover: 'red' },
    gGME: { background: 'red', hover: 'red' },
    gGOOG: { background: 'red', hover: 'red' },
    gLUNA: { background: 'rgb(27, 40, 79)', hover: 'rgb(47, 60, 99)' },
    gMNGO: { background: 'rgb(220, 112, 75)', hover: 'rgb(240, 132, 95)' },
    gNFLX: { background: 'red', hover: 'red' },
    gQQQ: { background: 'red', hover: 'red' },
    gRAY: { background: 'rgb(58, 82, 184)', hover: 'rgb(78, 102, 204)' },
    gSABER: { background: 'rgb(102, 100, 242)', hover: 'rgb(122, 120, 255)' },
    gSOL: { background: 'rgb(157, 91, 199)', hover: 'rgb(177, 111, 219)' },
    gSPY: { background: 'red', hover: 'red' },
    gSRM: { background: 'rgb(30, 64, 73)', hover: 'rgb(50, 84, 93)' },
    gTSLA: { background: 'red', hover: 'red' },
    gUSD: { background: 'rgb(235, 235, 235)', hover: 'rgb(255, 255, 255)' }
  } as { [x: string]: { background: string; hover: string } }

  return (
    <WRAPPER>
      <INFORMATION>
        <FlexColumnDiv>
          {poolAccount.synthsDebt.map(({ percentage, synth }, index) => (
            <SPECIFIC key={index} $color={synthColor[synth].background}>
              <div />
              <span>{synth}</span>
              <span>{(percentage * 100 || 0).toFixed(2)}%</span>
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
