import React, { FC, useMemo } from 'react'
import styled from 'styled-components'
import { AmountField } from './shared'
import { Selector } from './Selector'
import { useAccounts, useSlippageConfig, useSwap } from '../../context'
import { useWallet } from '@solana/wallet-adapter-react'

const AMOUNT = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: flex-end;

  span {
    display: block;
    padding: 0 20px 0 120px;
    font-weight: 600;
    font-size: 20px;
    line-height: 22px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${({ theme }) => theme.text1};
  }
`

const WRAPPER = styled.div`
  margin-top: ${({ theme }) => theme.margin(2)};
  > span {
    display: flex;
    color: ${({ theme }) => theme.text1};
  }
`

const LabelDiv = styled.div`
  padding-bottom: 0.5rem;
`

const LABEL = styled.span`
  font-weight: 500;
  font-size: 15px;
  line-height: normal;
  margin-top: -1rem;

  @media (max-width: 500px) {
    font-size: 15px;
    line-height: 20px;
  }
`

export const SwapTo: FC<{ height: string }> = ({ height }) => {
  const { getUIAmountString } = useAccounts()
  const { slippage } = useSlippageConfig()
  const { publicKey } = useWallet()
  const { outTokenAmount, setTokenB, tokenA, tokenB, connection } = useSwap()

  const balance = useMemo(() => {
    if (!tokenB) return 0
    if (!publicKey) return 0

    const { address, decimals } = tokenB
    return parseFloat(getUIAmountString(address).slice(0, Math.min(decimals, 8)))
  }, [getUIAmountString, tokenB, publicKey])

  //eslint-disable-next-line
  const value = useMemo(() => {
    return (
      tokenB &&
      outTokenAmount &&
      `At least ${(outTokenAmount * (1 - slippage)).toString().slice(0, 8)} ${tokenB?.symbol}`
    )
  }, [outTokenAmount, slippage, tokenB])

  return (
    <WRAPPER>
      <LabelDiv>
        <LABEL>You Receive</LABEL>
      </LabelDiv>
      <AmountField
        $balance={balance + ' ' + (tokenB?.symbol || '')}
        $height={height}
        $value={undefined}
        $down={true}
      >
        <Selector
          height={height}
          otherToken={tokenA}
          setToken={setTokenB}
          token={tokenB}
          connection={connection}
        />
        <AMOUNT>
          <span>{outTokenAmount || 0}</span>
        </AMOUNT>
      </AmountField>
    </WRAPPER>
  )
}
