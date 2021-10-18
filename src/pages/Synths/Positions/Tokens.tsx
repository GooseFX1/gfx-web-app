import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { SynthToken } from '../SynthToken'
import { useAccounts, useSynths } from '../../../context'
import { FlexColumnDiv, SpaceBetweenDiv } from '../../../styles'

const TOKEN = styled(SpaceBetweenDiv)`
  width: 100%;

  > * {
    width: calc(100% / 6);
  }

  > div {
    ${({ theme }) => theme.flexCenter}
  }

  > div > span {
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.secondary4};
    }
  }

  > span,
  > div > span {
    font-size: 12px;
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
  const { availableSynths } = useSynths()

  const tokens = useMemo(
    () =>
      Object.entries(balances)
        .filter(([mint, _]) => availableSynths.map(([_, { address }]) => address.toString()).includes(mint))
        .map(([mint, amount]) => ({ ...amount, mint })),
    [availableSynths, balances]
  )

  return (
    <WRAPPER>
      {tokens.map(({ mint, uiAmount }, index) => {
        const [synth] = availableSynths.find(([name, { address }]) => mint === address.toString()) || ['']

        return (
          <TOKEN key={index}>
            <SynthToken size="small" synth={synth} />
            <span>1000</span>
            <span>1000</span>
            <span>{uiAmount}</span>
            <span>1000</span>
            <span>1000</span>
          </TOKEN>
        )
      })}
    </WRAPPER>
  )
}
