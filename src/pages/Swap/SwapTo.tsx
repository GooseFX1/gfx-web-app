import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { AmountField } from './shared'
import { Selector } from './Selector'
import { useAccounts, useSlippageConfig, useSwap } from '../../context'

const AMOUNT = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: flex-end;
  span {
    display: block;
    padding: 0 20px 0 120px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 100%;
  }
`

const WRAPPER = styled.div`
  margin-top: ${({ theme }) => theme.margins['2x']};

  > span {
    display: flex;
    color: ${({ theme }) => theme.text1};
  }
`

export const SwapTo: FC<{ height: string }> = ({ height }) => {
  const { getUIAmountString } = useAccounts()
  const { slippage } = useSlippageConfig()
  const { outTokenAmount, setTokenB, tokenA, tokenB } = useSwap()

  const balance = useMemo(() => {
    if (!tokenB) return 0

    const { address, decimals } = tokenB
    return parseFloat(getUIAmountString(address).slice(0, Math.min(decimals, 8)))
  }, [getUIAmountString, tokenB])

  const value = useMemo(() => {
    return (
      tokenB &&
      outTokenAmount &&
      `At least ${(outTokenAmount * (1 - slippage)).toString().slice(0, 8)} ${tokenB?.symbol}`
    )
  }, [outTokenAmount, slippage, tokenB])

  return (
    <WRAPPER>
      <span>To:</span>
      <AmountField $balance={balance} $height={height} $value={value || undefined}>
        <Selector height={height} otherToken={tokenA} setToken={setTokenB} token={tokenB} />
        <AMOUNT>
          <span>{outTokenAmount}</span>
        </AMOUNT>
      </AmountField>
    </WRAPPER>
  )
}
