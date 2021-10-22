import React, { BaseSyntheticEvent, FC, useMemo } from 'react'
import { Input } from 'antd'
import { Selector } from './Selector'
import { Amount, Header, Wrapper } from './shared'
import { useAccounts, useSynths, useSynthSwap } from '../../../../context'
import { ellipseNumber } from '../../../../utils'

export const To: FC<{ height: string }> = ({ height }) => {
  const { getUIAmount } = useAccounts()
  const { poolAccount, prices, userPortfolio } = useSynths()
  const { inToken, outToken, outTokenAmount, setFocused, setOutTokenAmount } = useSynthSwap()

  const balance = useMemo(() => (outToken ? getUIAmount(outToken.address) : 0), [getUIAmount, outToken])

  const debt = useMemo(() => {
    if (!outToken) {
      return 0
    }

    const poolDebt = poolAccount.synthsDebt.find(({ synth }) => synth === outToken!.symbol)
    const price = prices[outToken.symbol]?.current
    return poolDebt && price ? (userPortfolio.debt * poolDebt.percentage) / price - balance : 0
  }, [outToken, poolAccount.synthsDebt, prices, userPortfolio.debt, balance])

  return (
    <Wrapper>
      <Header>
        <span>To:</span>
        <span
          onClick={() => {
            setFocused('to')
            setOutTokenAmount(debt)
          }}
        >
          Cover Debt
        </span>
      </Header>
      <Amount $height={height}>
        <Selector balance={balance} height={height} otherToken={inToken} side="out" token={outToken} />
        <Input
          maxLength={11}
          onChange={(x: BaseSyntheticEvent) => outToken && !isNaN(x.target.value) && setOutTokenAmount(x.target.value)}
          pattern="\d+(\.\d+)?"
          placeholder={outTokenAmount.toString()}
          value={ellipseNumber(outTokenAmount, 10)}
        />
      </Amount>
    </Wrapper>
  )
}
