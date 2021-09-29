import React, { BaseSyntheticEvent, FC, useEffect, useMemo, useState } from 'react'
import { Input } from 'antd'
import styled from 'styled-components'
import { Selector } from './Selector'
import { AmountField } from './shared'
import { useAccounts, useSwap } from '../../context'
import { CenteredDiv, SpaceBetweenDiv } from '../../styles'

const QUICK_SELECT = styled(CenteredDiv)`
  position: absolute;
  right: 0;
  top: -5px;

  span {
    margin-right: ${({ theme }) => theme.margins['2x']};
    font-size: 11px;
    font-weight: bold;
    color: ${({ theme }) => theme.text1};
    cursor: pointer;
  }
`

const WRAPPER = styled.div`
  > div:first-child > span {
    color: ${({ theme }) => theme.text1};
  }
`

export const SwapFrom: FC<{ height: string }> = ({ height }) => {
  const { getUIAmount, getUIAmountString } = useAccounts()
  const { rates, setInTokenAmount, setTokenA, tokenA, tokenB } = useSwap()
  const [value, setValue] = useState(0)

  const setHalf = () => tokenA && setValue(getUIAmount(tokenA.address) / 2)
  const setMax = () => tokenA && setValue(getUIAmount(tokenA.address))

  const balance = useMemo(() => {
    if (!tokenA) return 0

    const { address, decimals } = tokenA
    return parseFloat(getUIAmountString(address).slice(0, Math.min(decimals, 8)))
  }, [getUIAmountString, tokenA])

  const showQuickSelect = useMemo(() => balance > 0, [balance])

  useEffect(() => setInTokenAmount(tokenA ? value * 10 ** tokenA.decimals : 0), [setInTokenAmount, tokenA, value])

  return (
    <WRAPPER>
      <SpaceBetweenDiv>
        <span>From:</span>
        {showQuickSelect && (
          <QUICK_SELECT>
            <span onClick={setHalf}>Half</span>
            <span onClick={setMax}>Max</span>
          </QUICK_SELECT>
        )}
      </SpaceBetweenDiv>
      <AmountField $balance={balance} $height={height} $USDCValue={(rates.inValue * value).toString().slice(0, 8)}>
        <Selector height={height} otherToken={tokenB} setToken={setTokenA} token={tokenA} />
        <Input
          maxLength={15}
          onChange={(x: BaseSyntheticEvent) => {
            const {
              target: { value }
            } = x
            if (tokenA && !isNaN(value)) {
              setValue(value)
            }
          }}
          pattern="\d+(\.\d+)?"
          placeholder={value.toString()}
          value={value}
        />
      </AmountField>
    </WRAPPER>
  )
}
