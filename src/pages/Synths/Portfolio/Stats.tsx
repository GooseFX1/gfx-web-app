import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { Stat } from './Stat'
import { useDarkMode, usePrices, useSynths } from '../../../context'
import { monetaryFormatValue } from '../../../utils'

const WRAPPER = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
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
  const { userAccount, userPortfolio } = useSynths()
  const trailColor = mode === 'dark' ? '#1e1e1e' : '#e2e2e2'

  const cRatioPercentage = useMemo(() => userPortfolio.cRatio - 100, [userPortfolio.cRatio])

  return (
    <WRAPPER>
      <span>Portfolio Stats</span>
      <Stat
        title={'Debt'}
        tooltip={'The current gUSD denominated value of your debt that must be repaid.'}
        value={`${monetaryFormatValue(userAccount.shares)} gUSD`}
      />
      <Stat
        title={'Collateral'}
        tooltip={
          'The current gUSD denominated value of your deposited collateral. Prices of collaterals are provided by decentralized Pyth oracles.'
        }
        value={`${monetaryFormatValue(userPortfolio.cValue)} gUSD`}
      />
      <Stat
        title={'C-Ratio'}
        tooltip={
          'Current value of your debt based on the debt of the platform. Max borrow represents the maximal debt that you can mint - if your debt increases beyond this value, your position can be liquidated. You can mint if and only if your collateral ratio is greater than 200%, and you may be liquidated if your collateral ratio falls below 120%.'
        }
        percent={cRatioPercentage}
        progressBar
        strokeColor={cRatioPercentage > 45 ? '#27AE60' : cRatioPercentage > 30 ? '#bb7535' : '#D60000'}
        trailColor={trailColor}
        value={`${userPortfolio.cRatio.toFixed(2)}%`}
      />
    </WRAPPER>
  )
}
