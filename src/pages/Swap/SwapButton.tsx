import React, { FC, MouseEventHandler, useCallback, useMemo } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { useAccounts, useConnectionConfig, useSwap, useWalletModal, useDarkMode } from '../../context'
import { Button } from '../../components/Button'
import tw from 'twin.macro'
import 'styled-components/macro'

enum State {
  Connect = 0,
  CanSwap = 1,
  Enter = 2,
  BalanceExceeded = 3,
  PoolNotFound = 4
}

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

  return (
    <Button
      height="50px"
      width="220px"
      loading={loading}
      onClick={handleClick}
      cssStyle={
        buttonStatus === 'action'
          ? tw`bg-blue-1 rounded-circle border-0 hover:bg-purple-1`
          : buttonStatus === 'connect'
          ? tw`bg-purple-1 rounded-circle border-0`
          : mode === 'dark'
          ? tw`bg-black-1 rounded-circle border-0`
          : tw`bg-grey-4 rounded-circle border-0`
      }
      disabled={buttonStatus !== 'action' && buttonStatus !== 'connect'}
    >
      <span
        tw="text-regular font-semibold leading-[48px]"
        style={{ color: buttonStatus !== 'action' && buttonStatus !== 'connect' ? '#636363' : '#fff' }}
      >
        {content}
      </span>
    </Button>
  )
}
