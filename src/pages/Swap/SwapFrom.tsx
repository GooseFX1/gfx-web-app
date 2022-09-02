import React, { BaseSyntheticEvent, FC, useMemo } from 'react'
import styled from 'styled-components'
import { Input } from 'antd'
import { Selector } from './Selector'
import { AmountField } from './shared'
import { useAccounts, useSwap } from '../../context'
//import { checkMobile } from '../../utils'

const QUICK_SELECT = styled.div`
  margin-left: 23.5%;
  span {
    margin-left: ${({ theme }) => theme.margin(2.5)};
    font-weight: 600;
    font-size: 15px;
    line-height: 24px;
    color: ${({ theme }) => theme.text9};
    cursor: pointer;
    background-color: ${({ theme }) => theme.bg10};
    padding: 4px ${({ theme }) => theme.margin(1.5)};
    border-radius: 1rem;
  }

  @media (max-width: 500px) {
    margin-left: 20%;
    width: 60%;
    position: absolute;
    top: -5px;
  }
`

const WRAPPER = styled.div`
  margin-bottom: ${({ theme }) => theme.margin(2)};

  > div:first-child > span {
    color: ${({ theme }) => theme.text1};
  }

  @media (max-width: 500px) {
    margin-top: 40px;
  }
`

const INNER_WRAPPER = styled.div`
  display: flex;
  width: 80%;
  margin-bottom: 1rem;
`

const LABEL = styled.span`
  font-weight: 500;
  font-size: 20px;
  line-height: 24px;

  @media (max-width: 500px) {
    font-size: 15px;
    line-height: 20px;
  }
`

export const SwapFrom: FC<{ height: string }> = ({ height }) => {
  const { getUIAmount, getUIAmountString } = useAccounts()
  const { inTokenAmount, pool, setFocused, setInTokenAmount, setTokenA, tokenA, tokenB } = useSwap()

  const setHalf = () => {
    if (tokenA) {
      setFocused('from')
      setInTokenAmount(parseFloat((getUIAmount(tokenA.address) / 2 + '').slice(0, Math.min(tokenA.decimals, 8))))
    }
  }

  const setMax = () => {
    if (tokenA) {
      setFocused('from')
      setInTokenAmount(parseFloat(getUIAmountString(tokenA.address).slice(0, Math.min(tokenA.decimals, 8))))
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
      <INNER_WRAPPER>
        <div>
          <LABEL>You Pay</LABEL>
        </div>

        {showQuickSelect && (
          <QUICK_SELECT>
            <span onClick={setHalf}>HALF</span>
            <span onClick={setMax}>MAX</span>
          </QUICK_SELECT>
        )}
      </INNER_WRAPPER>

      <AmountField
        $balance={balance + ' ' + (tokenA?.symbol || '')}
        $height={height}
        $value={value || undefined}
        $down={false}
      >
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
