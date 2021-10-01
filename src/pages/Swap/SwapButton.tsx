import React, { FC, MouseEventHandler, useCallback, useMemo } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { MainButton } from '../../components'
import { useAccounts, useConnectionConfig, useSwap, useWalletModal } from '../../context'
import { ADDRESSES } from '../../web3'

enum Status {
  Connect = 0,
  CanSwap = 1,
  Enter = 2,
  Exceeded = 3,
  PoolNotFound = 4
}

export const SwapButton: FC = () => {
  const { getAmount } = useAccounts()
  const { network } = useConnectionConfig()
  const { inTokenAmount, swapTokens, tokenA, tokenB } = useSwap()
  const { connect, publicKey, wallet } = useWallet()
  const { setVisible } = useWalletModal()

  const status = useMemo(() => {
    const {
      seeds: { pools }
    } = ADDRESSES[network]

    if (!wallet || !publicKey) {
      return Status.Connect
    } else if (!tokenA || !tokenB) {
      return Status.Enter
    } else if (!pools[[tokenA.symbol, tokenB.symbol].sort((a, b) => a.localeCompare(b)).join('/')]) {
      return Status.PoolNotFound
    } else if (inTokenAmount === 0) {
      return Status.Enter
    } else if (inTokenAmount > parseFloat(getAmount(tokenA.address))) {
      return Status.Exceeded
    } else {
      return Status.CanSwap
    }
  }, [getAmount, inTokenAmount, network, publicKey, tokenA, tokenB, wallet])

  const buttonStatus = useMemo(() => {
    switch (status) {
      case Status.CanSwap:
        return 'action'
      case Status.Connect:
        return 'interact'
      case Status.Exceeded:
      case Status.PoolNotFound:
        return 'not-allowed'
      default:
        return 'initial'
    }
  }, [status])

  const content = useMemo(
    () => ['Connect wallet', 'Swap', 'Enter amount', 'Max amount exceeded', 'Pool not found'][status],
    [status]
  )

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (!event.defaultPrevented) {
        status === Status.CanSwap ? swapTokens() : !wallet ? setVisible(true) : connect().catch(() => {})
      }
    },
    [connect, setVisible, status, swapTokens, wallet]
  )

  return (
    <MainButton status={buttonStatus} onClick={handleClick}>
      <span>{content}</span>
    </MainButton>
  )
}
