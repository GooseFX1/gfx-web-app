import React, { BaseSyntheticEvent, FC, useMemo } from 'react'
import { Input } from 'antd'
import { Selector } from './Selector'
import { Amount, Header, Wrapper } from './shared'
import { useAccounts, useSynthSwap } from '../../../../context'
import { ellipseNumber } from '../../../../utils'

export const To: FC<{ height: string }> = ({ height }) => {
  const { getUIAmount } = useAccounts()
  const { inToken, outToken, outTokenAmount, setFocused, setOutTokenAmount } = useSynthSwap()

  const balance = useMemo(() => (outToken ? getUIAmount(outToken.address) : 0), [getUIAmount, outToken])

  return (
    <Wrapper>
      <Header>
        <span>To:</span>
      </Header>
      <Amount $height={height}>
        <Selector balance={balance} height={height} otherToken={inToken} side="out" token={outToken} />
        <Input
          maxLength={11}
          onBlur={() => setFocused(undefined)}
          onChange={(x: BaseSyntheticEvent) => outToken && !isNaN(x.target.value) && setOutTokenAmount(x.target.value)}
          onFocus={() => setFocused('to')}
          pattern="\d+(\.\d+)?"
          placeholder={outTokenAmount.toString()}
          value={ellipseNumber(outTokenAmount, 10)}
        />
      </Amount>
    </Wrapper>
  )
}
