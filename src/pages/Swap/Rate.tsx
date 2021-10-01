import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { useSwap } from '../../context'
import { MainText } from '../../styles'

const RATE = MainText(styled.span`
  width: 100%;
  margin-top: ${({ theme }) => theme.margins['2x']};
  font-size: 10px;
  font-weight: bold;
  text-align: left;
  color: ${({ theme }) => theme.text1};
`)

export const Rate: FC = () => {
  const { rates, tokenA, tokenB } = useSwap()

  const rate = useMemo(() => {
    if (!tokenA) {
      return 0
    }

    const { decimals } = tokenA
    return (rates.outValuePerIn / 10 ** decimals).toString().slice(0, Math.min(decimals, 8))
  }, [rates.outValuePerIn, tokenA])

  return (
    <RATE>
      {rates.time}{' '}
      {tokenA && tokenB && rates.outValuePerIn > 0 && (
        <span>
          (1 {tokenA.symbol} = {rate} {tokenB.symbol})
        </span>
      )}
    </RATE>
  )
}
