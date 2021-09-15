import React, { FC, MouseEventHandler, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { useAccounts, useConnectionConfig, useSwap, useWalletModal } from '../../context'
import { ADDRESSES } from '../../web3'

enum Status {
  Connect = 0,
  CanSwap = 1,
  Enter = 2,
  Exceeded = 3,
  PoolNotFound = 4
}

const BUTTON = styled.button<{ $status: Status }>`
  ${({ theme }) => theme.flexCenter}
  height: 50px;
  width: 170px;
  border: none;
  ${({ theme }) => theme.roundedBorders}
  background-color: ${({ $status, theme }) =>
    $status === Status.Connect ? theme.secondary3 : $status === Status.CanSwap ? theme.secondary2 : theme.grey4};
  cursor: ${({ $status }) =>
    $status === Status.Connect || Status.CanSwap
      ? 'pointer'
      : $status === Status.Exceeded || $status === Status.PoolNotFound
      ? 'not-allowed'
      : 'initial'};
  span {
    font-size: 12px;
    font-weight: bold;
  }
`

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
    <BUTTON $status={status} onClick={handleClick}>
      <span>{content}</span>
    </BUTTON>
  )
}
