import React, { FC, MouseEventHandler, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button } from './shared'
import { useConnectionConfig, useDarkMode, useSynths, useWalletModal } from '../../../context'
import { CenteredImg, SpaceBetweenDiv } from '../../../styles'
import { ADDRESSES } from '../../../web3'

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

export const Swap: FC = () => {
  const { network } = useConnectionConfig()
  const { mode } = useDarkMode()
  const { swap } = useSynths()
  const { connect, publicKey, wallet } = useWallet()
  const { setVisible } = useWalletModal()

  const state = useMemo(() => {
    const { pools } = ADDRESSES[network]

    if (!wallet || !publicKey) {
      return State.Connect
    // } else if (!tokenA || !tokenB) {
    //  return State.Enter
    // } else if (inTokenAmount === 0) {
    //   return State.Enter
    // } else if (inTokenAmount > parseFloat(getAmount(tokenA.address))) {
    //   return State.BalanceExceeded
    } else {
      return State.CanSwap
    }
  }, [network, publicKey, wallet])

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

  const content = useMemo(
    () => ['Connect wallet', 'Swap', 'Enter amount', 'Balance exceeded'][state],
    [state]
  )

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (!event.defaultPrevented) {
        state === State.CanSwap ? swap() : !wallet ? setVisible(true) : connect().catch(() => {})
      }
    },
    [connect, setVisible, state, swapTokens, wallet]
  )

  return (
    <>
      <SpaceBetweenDiv>
        <div>
          A
        </div>
        <SWITCH measurements={80}>
          <img src={`${process.env.PUBLIC_URL}/img/assets/swap_switch_${mode}_mode.svg`} alt="switch" />
        </SWITCH>
        <div>
          B
        </div>
      </SpaceBetweenDiv>
      <Button height="50px" onClick={handleClick} status={buttonStatus} width="40%">
        <span>{content}</span>
      </Button>
    </>
  )
}
