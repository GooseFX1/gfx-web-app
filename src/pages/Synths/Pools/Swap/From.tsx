import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { useAccounts, useSynths } from '../../../../context'
import { FlexColumnDiv, SpaceBetweenDiv } from '../../../../styles'

const AMOUNT = styled(FlexColumnDiv)`
  align-items: center;
  justify-content: flex-end;
  height: 50px;
  padding: ${({ theme }) => theme.margins['1x']} ${({ theme }) => theme.margins['2.5x']} ${({ theme }) => theme.margins['1x']} 0;
  ${({ theme }) => theme.roundedBorders}
  background-color: ${({ theme }) => theme.textBox};
  
  span {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
  }

  span:first-child {
    height: 100%;
    ${({ theme }) => theme.roundedBorders}
    font-size: 16px;
    font-weight: bold;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  span:last-child {
    text-align: right;
  }
`

const HEADER = styled.div`
  position: absolute;
  top: -24px;
  font-weight: bold;
`

const WRAPPER = styled(FlexColumnDiv)`
  position: relative;
  flex: 1;
`

export const From: FC = () => {
  const { getUIAmountString } = useAccounts()
  const { synthSwap } = useSynths()

  const balance = useMemo(() => {
    if (!synthSwap.outToken) return 0

    const { address, decimals } = synthSwap.outToken
    return parseFloat(getUIAmountString(address).slice(0, Math.min(decimals, 8)))
  }, [getUIAmountString, synthSwap.outToken])

  const value = useMemo(() => {
    return (
      synthSwap.outToken &&
      synthSwap.outTokenAmount &&
      `At least ${(synthSwap.outTokenAmount).toString().slice(0, 8)} ${synthSwap.outToken?.symbol}`
    )
  }, [synthSwap.outToken, synthSwap.outTokenAmount])

  return (
    <WRAPPER>
      <HEADER>
        <span>From:</span>
        <span>Use MAX</span>
      </HEADER>
      <AMOUNT>
        <span>{synthSwap.outTokenAmount}</span>
        {value && <span>{value}</span>}
      </AMOUNT>
    </WRAPPER>
  )
}
