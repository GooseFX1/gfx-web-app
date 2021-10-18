import React, { FC, MouseEventHandler, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { From } from './From'
import { To } from './To'
import { Button } from '../shared'
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
  const { loading, swap, synthSwap } = useSynthSwap()
  const { connect, publicKey, wallet } = useWallet()
  const { setVisible } = useWalletModal()

  const state = useMemo(() => {
    if (!wallet || !publicKey) {
      return State.Connect
    } else if (!synthSwap.inToken || !synthSwap.outToken) {
      return State.Enter
    } else if (synthSwap.inTokenAmount === 0) {
      return State.Enter
    } else if (synthSwap.inTokenAmount > parseFloat(getAmount(synthSwap.inToken.address))) {
      return State.BalanceExceeded
    } else {
      return State.CanSwap
    }
  }, [getAmount, publicKey, synthSwap.inToken, synthSwap.inTokenAmount, synthSwap.outToken, wallet])

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

  const height = '50px'

  return (
    <>
      <SpaceBetweenDiv>
        {/* <From height={height} /> */}
        <SWITCH measurements={80}>
          <img src={`${process.env.PUBLIC_URL}/img/assets/swap_switch_${mode}_mode.svg`} alt="switch" />
        </SWITCH>
        {/* <To height={height} /> */}
      </SpaceBetweenDiv>
      <Button height="50px" loading={loading} onClick={handleClick} status={buttonStatus} width="40%">
        <span>{content}</span>
      </Button>
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
