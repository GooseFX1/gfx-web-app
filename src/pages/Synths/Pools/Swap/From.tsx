import React, { BaseSyntheticEvent, FC, useMemo } from 'react'
import { Input } from 'antd'
import styled from 'styled-components'
import { Selector } from './Selector'
import { Amount, Header, Wrapper } from './shared'
import { useAccounts, usePrices, useSynthSwap } from '../../../../context'
import { ellipseNumber, monetaryFormatValue } from '../../../../utils'

const VALUE = styled.span`
  display: flex;
  justify-content: flex-end;
  font-size: 8px;
`

export const From: FC<{ height: string }> = ({ height }) => {
  const { getUIAmount } = useAccounts()
  const { prices } = usePrices()
  const { inToken, inTokenAmount, outToken, setFocused, setInTokenAmount } = useSynthSwap()

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
            onChange={(x: BaseSyntheticEvent) => inToken && !isNaN(x.target.value) && setInTokenAmount(x.target.value)}
            pattern="\d+(\.\d+)?"
            placeholder={inTokenAmount.toString()}
            value={ellipseNumber(inTokenAmount, 10)}
          />
          {value > 0 && <VALUE>{monetaryFormatValue(value)} gUSD</VALUE>}
        </div>
      </Amount>
    </Wrapper>
  )
}
