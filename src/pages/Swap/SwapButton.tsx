import React, { FC, MouseEventHandler, useCallback, useMemo } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { MainButton } from '../../components'
import { useAccounts, useConnectionConfig, useSwap, useWalletModal } from '../../context'
import { ADDRESSES } from '../../web3'

enum State {
  Connect = 0,
  CanSwap = 1,
  Enter = 2,
  BalanceExceeded = 3,
  PoolNotFound = 4
}

export const SwapButton: FC = () => {
  const { getAmount } = useAccounts()
  const { network } = useConnectionConfig()
  const { inTokenAmount, loading, swapTokens, tokenA, tokenB } = useSwap()
  const { connect, publicKey, wallet } = useWallet()
  const { setVisible } = useWalletModal()

  const state = useMemo(() => {
    const { pools } = ADDRESSES[network]
    console.log(pools, network)

    if (!wallet || !publicKey) {
      return State.Connect
    } else if (!tokenA || !tokenB) {
      return State.Enter
      // } else if (!pools[[tokenA.symbol, tokenB.symbol].sort((a, b) => a.localeCompare(b)).join('/')]?.address) {
      //   return State.PoolNotFound
    } else if (inTokenAmount === 0) {
      return State.Enter
    } else if (inTokenAmount > parseFloat(getAmount(tokenA.address))) {
      return State.BalanceExceeded
    } else {
      return State.CanSwap
    }
  }, [getAmount, inTokenAmount, network, publicKey, tokenA, tokenB, wallet])

  const buttonStatus = useMemo(() => {
    switch (state) {
      case State.CanSwap:
      case State.Connect:
        return 'action'
      case State.BalanceExceeded:
      // case State.PoolNotFound:
      //   return 'not-allowed'
      default:
        return 'initial'
    }
  }, [state])

  const content = useMemo(
    () => ['Connect wallet', 'Swap', 'Enter amount', 'Balance exceeded', 'Pool not found'][state],
    [state]
  )

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (!event.defaultPrevented) {
        state === State.CanSwap ? swapTokens() : !wallet ? setVisible(true) : connect().catch(() => {})
      }
    },
    [connect, setVisible, state, swapTokens, wallet]
  )

  return (
    <MainButton height="50px" loading={loading} status={buttonStatus} width="170px" onClick={handleClick}>
      <span>{content}</span>
    </MainButton>
  )
}
