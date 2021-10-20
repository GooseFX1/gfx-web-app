import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { SynthToken } from '../SynthToken'
import { IAccount, useAccounts, usePrices, useSynths } from '../../../context'
import { FlexColumnDiv, SpaceBetweenDiv } from '../../../styles'

const TOKEN = styled(SpaceBetweenDiv)`
  width: 100%;

  > * {
    width: calc(100% / 6);
  }

  > div {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding-left: ${({ theme }) => theme.margins['1.5x']};
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
  const { prices } = usePrices()
  const { availableSynths } = useSynths()

  const tokens = useMemo(
    () =>
      Object.entries(balances)
        .map(([mint, amount]) => {
          const synth = availableSynths.find(([_, { address }]) => mint === address.toString())
          return synth ? { ...amount, name: synth[0] } : undefined
        })
        .filter((x): x is { name: string } & IAccount => !!x)
        .sort((a, b) => a.name.localeCompare(b.name)),
    [availableSynths, balances]
  )

  return (
    <WRAPPER>
      {tokens.map(({ name, uiAmount }, index) => (
        <TOKEN key={index}>
          <SynthToken size="small" synth={name} />
          <span>{prices[name]?.current}</span>
          <span>-</span>
          <span>{uiAmount.toFixed(3)}</span>
          <span>-</span>
          <span>-</span>
        </TOKEN>
      ))}
    </WRAPPER>
  )
}
