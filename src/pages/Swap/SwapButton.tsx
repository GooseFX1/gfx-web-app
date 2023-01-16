/* eslint-disable */
import React, { FC, MouseEventHandler, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { MainButton } from '../../components'
import { useAccounts, useConnectionConfig, useSwap, useWalletModal, useDarkMode } from '../../context'
import { Button } from '../../components/common/Button'

enum State {
  Connect = 0,
  CanSwap = 1,
  Enter = 2,
  BalanceExceeded = 3,
  PoolNotFound = 4
}

//first technique
const SWAP_BUTTON = styled(Button)<{ status: any; mode: any }>`
  background-color: ${({ status, mode }) =>
    status === 'action' ? '#5855FF' : status === 'connect' ? '#8d4cdd' : mode === 'dark' ? '#131313' : '#CACACA'};

  > span {
    font-weight: 600;
    font-size: 15px;
    line-height: 21px;
    color: white;
  }
`

export const SwapButton: FC<{ exchange?: (any: any) => void; route: any }> = ({ exchange, route }) => {
  const { getAmount } = useAccounts()
  const { mode } = useDarkMode()
  const { network } = useConnectionConfig()
  const { inTokenAmount, loading, swapTokens, tokenA, tokenB } = useSwap()
  const { connect, publicKey, wallet } = useWallet()
  const { setVisible } = useWalletModal()

  const state = useMemo(() => {
    if (!wallet || !publicKey) {
      return State.Connect
    } else if (!tokenA || !tokenB) {
      return State.Enter
    } else if (inTokenAmount === 0) {
      return State.Enter
    } else if (inTokenAmount > parseFloat(getAmount(tokenA.address)) / 10 ** tokenA.decimals) {
      return State.BalanceExceeded
    } else {
      return State.CanSwap
    }
  }, [getAmount, inTokenAmount, network, publicKey, tokenA, tokenB, wallet])

  const buttonStatus = useMemo(() => {
    switch (state) {
      case State.Connect:
        return 'connect'
      case State.CanSwap:
        return 'action'

      case State.Enter:
      case State.BalanceExceeded:
      default:
        return 'initial'
    }
  }, [state])

  const content = useMemo(
    () =>
      ['Connect Wallet', 'Swap', 'Enter amount', `Insufficient ${tokenA?.symbol || 'Balance'}`, 'Pool not found'][
        state
      ],
    [state, tokenA?.symbol]
  )

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (!event.defaultPrevented) {
        state === State.CanSwap
          ? swapTokens(route, exchange)
          : !wallet
          ? setVisible(true)
          : connect().catch((e: Error) => {
              console.log(e)
            })
      }
    },
    [connect, setVisible, state, swapTokens, wallet, route]
  )

  //2nd: pass bgs as props
  //3rd: pass bgs as style prop
  return (
    <SWAP_BUTTON
      height="50px"
      width="220px"
      borderRadius="50px"
      mode={mode}
      ltbg
      loading={loading}
      status={buttonStatus}
      onClick={handleClick}
      onFocus={() => console.log('shashank')}
    >
      <span>{content}</span>
    </SWAP_BUTTON>
  )
}
