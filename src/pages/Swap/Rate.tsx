import React, { FC } from 'react'
import styled from 'styled-components'
import { useRates, useSwap } from '../../context'
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
  const { rates } = useRates()
  const { tokenA, tokenB } = useSwap()

  return (
    <RATE>
      {rates.time}{' '}
      {tokenA && tokenB && rates.outValuePerIn > 0 && (
        <span>
          (1 {tokenA.symbol} = {(rates.outValuePerIn / 10 ** tokenA!.decimals).toString().slice(0, 5)} {tokenB.symbol})
        </span>
      )}
    </RATE>
  )
}
