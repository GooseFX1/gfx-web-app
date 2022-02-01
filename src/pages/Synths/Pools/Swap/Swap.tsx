import React, { FC, MouseEventHandler, useCallback, useMemo } from 'react'
import styled, { css } from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { From } from './From'
import { To } from './To'
import { Bottom, Button } from '../shared'
import { SwapProvider, useAccounts, useDarkMode, useSynthSwap, useWalletModal } from '../../../../context'
import { CenteredImg, SpaceBetweenDiv } from '../../../../styles'

enum State {
  Connect = 0,
  CanSwap = 1,
  Enter = 2,
  BalanceExceeded = 3
}

const SWITCH = styled(CenteredImg)<{ measurements: number }>`
  ${({ measurements, theme }) => theme.measurements(measurements + 'px')}
  z-index: 1;
  cursor: pointer;
`

const SwapContent: FC = () => {
  const { getAmount } = useAccounts()
  const { mode } = useDarkMode()
  const { inToken, inTokenAmount, loading, outToken, swap, switchTokens } = useSynthSwap()
  const { connect, publicKey, wallet } = useWallet()
  const { setVisible } = useWalletModal()

  const state = useMemo(() => {
    if (!wallet || !publicKey) {
      return State.Connect
    } else if (!inToken || !outToken) {
      return State.Enter
    } else if (inTokenAmount === 0) {
      return State.Enter
    } else if (inTokenAmount > parseFloat(getAmount(inToken.address))) {
      return State.BalanceExceeded
    } else {
      return State.CanSwap
    }
  }, [getAmount, inToken, inTokenAmount, outToken, publicKey, wallet])

  const buttonStatus = useMemo(() => {
    switch (state) {
      case State.CanSwap:
      case State.Connect:
        return 'action'
      case State.BalanceExceeded:
        return 'not-allowed'
      default:
        return 'initial'
    }
  }, [state])

  const content = useMemo(() => ['Connect wallet', 'Swap', 'Enter amount', 'Balance exceeded'][state], [state])

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (!event.defaultPrevented) {
        state === State.CanSwap ? swap() : !wallet ? setVisible(true) : connect().catch(() => {})
      }
    },
    [connect, setVisible, state, swap, wallet]
  )

  const height = '60px'

  const localCSS = css`
    .ant-input {
      position: absolute;
      top: 0;
      left: 0;
      height: ${height};
      border: none;
      border-radius: 50px;
      font-weight: bold;
    }

    .ant-input-affix-wrapper > input.ant-input {
      height: ${height};
      text-align: left;
    }
  `

  return (
    <>
      <SpaceBetweenDiv>
        <style>{localCSS}</style>
        <From height={height} />
        <SWITCH measurements={80} onClick={switchTokens}>
          <img src={`/img/assets/swap_switch_${mode}_mode.svg`} alt="switch" />
        </SWITCH>
        <To height={height} />
      </SpaceBetweenDiv>
      <Bottom>
        <span />
        <Button height="50px" loading={loading} onClick={handleClick} status={buttonStatus} width="40%">
          <span>{content}</span>
        </Button>
      </Bottom>
    </>
  )
}

export const Swap: FC = () => {
  return (
    <SwapProvider>
      <SwapContent />
    </SwapProvider>
  )
}
