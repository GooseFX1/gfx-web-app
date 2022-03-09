import React, { BaseSyntheticEvent, FC, useMemo } from 'react'
import styled from 'styled-components'
import { Input } from 'antd'
import { Selector } from './Selector'
import { AmountField } from './shared'
import { useAccounts, useSwap } from '../../context'

const QUICK_SELECT = styled.div`
  position: absolute;
  top: -24px;
  right: 0;

  span {
    margin-left: ${({ theme }) => theme.margin(2)};
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;
    color: ${({ theme }) => theme.text6};
    cursor: pointer;
  }
`

const WRAPPER = styled.div`
  margin-bottom: ${({ theme }) => theme.margin(2)};

  > div:first-child > span {
    color: ${({ theme }) => theme.text1};
  }
`

const LABEL = styled.span`
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;
`

export const SwapFrom: FC<{ height: string }> = ({ height }) => {
  const { getUIAmount, getUIAmountString } = useAccounts()
  const { inTokenAmount, pool, setFocused, setInTokenAmount, setTokenA, tokenA, tokenB } = useSwap()

  const setHalf = () => {
    if (tokenA) {
      setFocused('from')
      setInTokenAmount(getUIAmount(tokenA.address) / 2)
    }
  }

  const setMax = () => {
    if (tokenA) {
      setFocused('from')
      setInTokenAmount(getUIAmount(tokenA.address))
    }
  }

  const balance = useMemo(() => {
    if (!tokenA) return 0

    const { address, decimals } = tokenA
    return parseFloat(getUIAmountString(address).slice(0, Math.min(decimals, 8)))
  }, [getUIAmountString, tokenA])

  const showQuickSelect = useMemo(() => balance > 0, [balance])

  const value = useMemo(() => {
    return inTokenAmount && pool.inValue && `${(pool.inValue * inTokenAmount).toString().slice(0, 8)} USDC`
  }, [inTokenAmount, pool.inValue])

  return (
    <WRAPPER>
      {showQuickSelect && (
        <QUICK_SELECT>
          <span onClick={setHalf}>Half</span>
          <span onClick={setMax}>Max</span>
        </QUICK_SELECT>
      )}

      <div>
        <LABEL>From:</LABEL>
      </div>

      <AmountField $balance={balance} $height={height} $value={value || undefined}>
        <Selector balance={balance} height={height} otherToken={tokenB} setToken={setTokenA} token={tokenA} />
        <Input
          maxLength={15}
          onBlur={() => setFocused(undefined)}
          onChange={(x: BaseSyntheticEvent) => tokenA && !isNaN(x.target.value) && setInTokenAmount(x.target.value)}
          onFocus={() => setFocused('from')}
          pattern="\d+(\.\d+)?"
          placeholder={inTokenAmount.toString()}
          value={inTokenAmount}
          className={'swap-input'}
        />
      </AmountField>
    </WRAPPER>
  )
}
