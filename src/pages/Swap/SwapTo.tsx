import React, { FC, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { AmountField } from './shared'
import { Selector } from './Selector'
import { useRates, useSwap } from '../../context'

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
  const { rates } = useRates()
  const { setTokenB, tokenA, tokenB } = useSwap()

  const uiAmount = useMemo(() => {
    return tokenB && rates.outValueForSwap > 0
      ? (rates.outValueForSwap / 10 ** tokenB.decimals).toFixed(tokenB.decimals)
      : '0'
  }, [rates.outValueForSwap, tokenB])

  useEffect(
    () =>
      setTokenB(
        (tokenB) =>
          tokenB && {
            address: tokenB.address,
            amount: tokenB.amount,
            decimals: tokenB.decimals,
            uiAmount: tokenB.uiAmount,
            uiAmountString: tokenB.uiAmountString,
            symbol: tokenB.symbol,
            toSwapAmount: parseFloat(uiAmount) * 10 ** tokenB.decimals
          }
      ),
    [setTokenB, uiAmount]
  )

  return (
    <WRAPPER>
      <span>To:</span>
      <AmountField $height={height} $USDCValue={(rates.outValue * parseFloat(uiAmount)).toString().slice(0, 8)}>
        <Selector height={height} otherToken={tokenA} setToken={setTokenB} token={tokenB} />
        <span>{uiAmount}</span>
      </AmountField>
    </WRAPPER>
  )
}
