import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { AmountField } from './shared'
import { Selector } from './Selector'
import { useAccounts, useRates, useSwap } from '../../context'

const WRAPPER = styled.div`
  margin-top: ${({ theme }) => theme.margins['2x']};
  > span {
    display: flex;
    color: ${({ theme }) => theme.text1};
  }
  > div > span {
    display: block;
    padding: 18px 20px 0 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

export const SwapTo: FC<{ height: string }> = ({ height }) => {
  const { getUIAmountString } = useAccounts()
  const { rates } = useRates()
  const { outTokenAmount, setTokenB, tokenA, tokenB } = useSwap()

  const balance = useMemo(() => {
    if (!tokenB) return 0

    const { address, decimals } = tokenB
    return parseFloat(getUIAmountString(address).slice(0, Math.min(decimals, 8)))
  }, [getUIAmountString, tokenB])

  const uiAmount = useMemo(() => {
    return tokenB && outTokenAmount > 0 ? (outTokenAmount / 10 ** tokenB.decimals).toFixed(tokenB.decimals) : '0'
  }, [outTokenAmount, tokenB])

  return (
    <WRAPPER>
      <span>To:</span>
      <AmountField
        $balance={balance}
        $height={height}
        $USDCValue={(rates.outValue * parseFloat(uiAmount)).toString().slice(0, 8)}
      >
        <Selector height={height} otherToken={tokenA} setToken={setTokenB} token={tokenB} />
        <span>{uiAmount}</span>
      </AmountField>
    </WRAPPER>
  )
}
