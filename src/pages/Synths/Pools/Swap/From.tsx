import React, { BaseSyntheticEvent, FC, useMemo } from 'react'
import { Input } from 'antd'
import styled, { css } from 'styled-components'
import { Selector } from './Selector'
import { useAccounts, useDarkMode, useSynthSwap } from '../../../../context'
import { FlexColumnDiv, SpaceBetweenDiv } from '../../../../styles'

const AMOUNT = styled(FlexColumnDiv)<{ $height: string }>`
  position: relative;
  align-items: center;
  justify-content: flex-end;
  height: ${({ $height }) => $height};
  padding: ${({ theme }) => theme.margins['1x']} ${({ theme }) => theme.margins['2.5x']}
    ${({ theme }) => theme.margins['1x']} 0;
  ${({ theme }) => theme.roundedBorders}
  background-color: ${({ theme }) => theme.textBox};

  > span {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
  }

  > span:last-child {
    text-align: right;
  }
`

const HEADER = styled(SpaceBetweenDiv)`
  position: absolute;
  top: -20px;
  width: 90%;

  span {
    font-weight: bold;
  }

  span:last-child {
    font-size: 11px;
    color: ${({ theme }) => theme.text1h};

    &:hover {
      color: ${({ theme }) => theme.text1};
      cursor: pointer;
    }
  }
`

const WRAPPER = styled(FlexColumnDiv)`
  position: relative;
  flex: 1;
`

export const From: FC<{ height: string }> = ({ height }) => {
  const { getUIAmount } = useAccounts()
  const { setFocused, setSynthSwap, synthSwap } = useSynthSwap()

  const userBalance = useMemo(
    () => (synthSwap.inToken ? getUIAmount(synthSwap.inToken.address) : 0),
    [getUIAmount, synthSwap.inToken]
  )

  const value = useMemo(() => {
    return (
      synthSwap.outToken &&
      synthSwap.outTokenAmount &&
      `At least ${synthSwap.outTokenAmount.toString().slice(0, 8)} ${synthSwap.outToken?.symbol}`
    )
  }, [synthSwap.outToken, synthSwap.outTokenAmount])

  const localCSS = css`
    .ant-input {
      position: absolute;
      top: 0;
      left: 0;
      height: ${height};
      border: none;
      border-radius: 50px;
    }

    .ant-input-affix-wrapper > input.ant-input {
      height: ${height};
      text-align: left;
    }
  `

  return (
    <WRAPPER>
      <HEADER>
        <span>From:</span>
        <span onClick={() => setSynthSwap((prevState) => ({ ...prevState, inTokenAmount: userBalance }))}>Use MAX</span>
      </HEADER>
      <AMOUNT $height={height}>
        <style>{localCSS}</style>
        <Selector height={height} otherToken={synthSwap.outToken} side="in" token={synthSwap.inToken} />
        <Input
          maxLength={11}
          onBlur={() => setFocused(undefined)}
          onChange={(x: BaseSyntheticEvent) => {
            if (synthSwap.inToken && !isNaN(x.target.value)) {
              setSynthSwap((prevState) => ({ ...prevState, inTokenAmount: x.target.value }))
            }
          }}
          onFocus={() => setFocused('from')}
          pattern="\d+(\.\d+)?"
          placeholder={synthSwap.inTokenAmount.toString()}
          value={synthSwap.inTokenAmount}
        />
      </AMOUNT>
    </WRAPPER>
  )
}
