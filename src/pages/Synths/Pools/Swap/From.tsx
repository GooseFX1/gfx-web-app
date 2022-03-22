import React, { BaseSyntheticEvent, FC, useMemo } from 'react'
import { Input } from 'antd'
import styled from 'styled-components'
import { Selector } from './Selector'
import { Amount, Header, Wrapper } from './shared'
import { useAccounts, useSynthSwap } from '../../../../context'
import { ellipseNumber, monetaryFormatValue } from '../../../../utils'

const VALUE = styled.span`
  display: flex;
  justify-content: flex-end;
  font-size: 8px;
`

export const From: FC<{ height: string }> = ({ height }) => {
  const { getUIAmount } = useAccounts()
  const { inToken, inTokenAmount, outToken, prices, setFocused, setInTokenAmount } = useSynthSwap()

  const balance = useMemo(() => (inToken ? getUIAmount(inToken.address) : 0), [getUIAmount, inToken])

  const value = useMemo(
    () => (inToken ? prices[inToken.symbol]?.current * inTokenAmount : 0),
    [inToken, inTokenAmount, prices]
  )

  return (
    <Wrapper>
      <Header>
        <span>From:</span>
        <span
          onClick={() => {
            setFocused('from')
            setInTokenAmount(balance)
          }}
        >
          Use MAX
        </span>
      </Header>
      <Amount $height={height}>
        <Selector balance={balance} height={height} otherToken={outToken} side="in" token={inToken} />
        <div>
          <Input
            maxLength={11}
            onBlur={() => setFocused(undefined)}
            onChange={(x: BaseSyntheticEvent) => inToken && !isNaN(x.target.value) && setInTokenAmount(x.target.value)}
            onFocus={() => setFocused('from')}
            pattern="\d+(\.\d+)?"
            placeholder={inTokenAmount.toString()}
            value={ellipseNumber(inTokenAmount, 10)}
            className={'swap-input'}
          />
          {value > 0 && <VALUE>{monetaryFormatValue(value)} gUSD</VALUE>}
        </div>
      </Amount>
    </Wrapper>
  )
}
