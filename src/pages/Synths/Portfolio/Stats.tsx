import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { Stat } from './Stat'
import { useDarkMode, useSynths } from '../../../context'
import { monetaryFormatValue } from '../../../utils'

const WRAPPER = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: ${({ theme }) => theme.margins['4x']} ${({ theme }) => theme.margins['3x']};

  > div:nth-child(3) {
    margin: ${({ theme }) => theme.margins['3x']} 0;
  }

  span {
    color: ${({ theme }) => theme.text4};
  }

  > span {
    margin-bottom: ${({ theme }) => theme.margins['2x']};
    font-weight: bold;
    text-align: left;
    color: ${({ theme }) => theme.text1};
  }
`

export const Stats: FC = () => {
  const { mode } = useDarkMode()
  const { userAccount } = useSynths()
  const trailColor = mode === 'dark' ? '#1e1e1e' : '#e2e2e2'

  const cRatio = useMemo(() => {
    const { collateral, debt } = userAccount
    return !collateral || !debt ? 0 : 100 / (userAccount.debt / userAccount.collateral)
  }, [userAccount])
  const cRatioPercentage = useMemo(() => cRatio - 100, [cRatio])

  return (
    <WRAPPER>
      <span>Portfolio Stats</span>
      <Stat
        title={'Debt'}
        tooltip={'The current USD denominated value of your debt that must be repaid.'}
        percent={60}
        strokeColor={'#5654f2'}
        trailColor={trailColor}
        value={`${monetaryFormatValue(userAccount.debt)} USD`}
      />
      <Stat
        title={'Collateral'}
        tooltip={
          'The current USD denominated value of your deposited collateral. Prices of collaterals are provided by decentralized Pyth oracles.'
        }
        percent={30}
        strokeColor={'#cf5ae8'}
        trailColor={trailColor}
        value={`${monetaryFormatValue(userAccount.collateral)} USD`}
      />
      <Stat
        title={'C-Ratio'}
        tooltip={
          'Current value of your debt based on the debt of the platform. Max borrow represents the maximal debt that you can mint - if your debt increases beyond this value, your position can be liquidated. You can mint if and only if your collateral ratio is greater than 200%, and you may be liquidated if your collateral ratio falls below 120%.'
        }
        percent={cRatioPercentage}
        strokeColor={cRatioPercentage > 45 ? '#27AE60' : cRatioPercentage > 30 ? '#bb7535' : '#D60000'}
        trailColor={trailColor}
        value={`${cRatio.toFixed(2)}%`}
      />
    </WRAPPER>
  )
}
