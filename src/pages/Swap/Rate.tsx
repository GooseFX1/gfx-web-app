import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { useSwap } from '../../context'

const RATE = styled.span`
  width: 100%;
  font-size: 10px;
  font-weight: bold;
  text-align: left;
  color: ${({ theme }) => theme.text1};
`

const TIMESTAMP = styled.span`
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
`

export const Rate: FC = () => {
  const { pool, tokenA, tokenB } = useSwap()

  const rate = useMemo(
    () => (!tokenA ? 0 : pool.outValuePerIn.toString().slice(0, Math.min(tokenA.decimals, 8))),
    [pool.outValuePerIn, tokenA]
  )

  return (
    <RATE>
      <TIMESTAMP>{pool.time}</TIMESTAMP>
      {tokenA && tokenB && pool.outValuePerIn > 0 && (
        <span>
          (1 {tokenA.symbol} = {rate} {tokenB.symbol})
        </span>
      )}
    </RATE>
  )
}
