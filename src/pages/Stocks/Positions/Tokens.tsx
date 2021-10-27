import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { SynthToken } from '../SynthToken'
import { useAccounts, useConnectionConfig, useSynths } from '../../../context'
import { FlexColumnDiv, SpaceBetweenDiv } from '../../../styles'
import { monetaryFormatValue } from '../../../utils'
import { ADDRESSES } from '../../../web3'

const TOKEN = styled(SpaceBetweenDiv)`
  width: 100%;

  > * {
    width: 20%;
  }

  > div {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: ${({ theme }) => theme.margins['5x']};
  }

  span {
    font-size: 11px;
    color: ${({ theme }) => theme.text1};
  }
`

const WRAPPER = styled(FlexColumnDiv)`
  justify-content: flex-start;
  ${({ theme }) => theme.measurements('100%')}

  > div:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.margins['2.5x']};
  }
`

export const Tokens: FC = () => {
  const { balances } = useAccounts()
  const { network } = useConnectionConfig()
  const { poolAccount, prices, userPortfolio } = useSynths()

  const tokens = useMemo(
    () =>
      poolAccount.synthsDebt.map(({ percentage, synth }) => {
        const price = prices[synth]?.current
        const debtValue = userPortfolio.debt * percentage
        const size = balances[ADDRESSES[network].mints[synth].address.toString()]?.uiAmount
        return { debt: debtValue / price, debtValue, price, size, synth }
      }),
    [balances, network, poolAccount.synthsDebt, prices, userPortfolio.debt]
  )

  return (
    <WRAPPER>
      {tokens.map(({ debt, debtValue, price, size, synth }, index) => (
        <TOKEN key={index}>
          <SynthToken size="small" synth={synth} />
          <span>${monetaryFormatValue(price)}</span>
          <span>{(size || 0).toFixed(2)}</span>
          <span>
            {(debt || 0).toFixed(2)} ( ${monetaryFormatValue(debtValue)} )
          </span>
          <span>{synth === 'gUSD' ? '-' : ((size - debt) || 0).toFixed(2)}</span>
        </TOKEN>
      ))}
    </WRAPPER>
  )
}
