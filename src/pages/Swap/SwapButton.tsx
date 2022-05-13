import React, { FC, MouseEventHandler, useCallback, useMemo } from 'react'
import styled from 'styled-components'
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

const SWAP_BUTTON = styled(MainButton)<{ status: any }>`
  width: 220px;
  padding: 0 32px;
  background-color: ${({ status }) => (status === 'action' ? '#6b33b0' : '#202020')};
`

const TEXT = styled.span`
  font-weight: 600 !important;
  font-size: 17px !important;
  line-height: 21px !important;
`

export const SwapButton: FC<{ exchange?: (any: any) => void; route: any }> = ({ exchange, route }) => {
  const { getAmount } = useAccounts()
  const { network } = useConnectionConfig()
  const { inTokenAmount, loading, swapTokens, tokenA, tokenB } = useSwap()
  const { connect, publicKey, wallet } = useWallet()
  const { setVisible } = useWalletModal()

  const state = useMemo(() => {
    const { pools } = ADDRESSES[network]
    //console.log(pools, network)

    if (!wallet || !publicKey) {
      return State.Connect
    } else if (!tokenA || !tokenB) {
      return State.Enter
      // } else if (!pools[[tokenA.symbol, tokenB.symbol].sort((a, b) => a.localeCompare(b)).join('/')]?.address) {
      //   return State.PoolNotFound
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
      case State.CanSwap:
      case State.Connect:
      case State.Enter:
        return 'action'
      case State.BalanceExceeded:
      // case State.PoolNotFound:
      //   return 'not-allowed'
      default:
        return 'initial'
    }
  }, [state])

  const content = useMemo(
    () =>
      ['Connect wallet', 'Swap', 'Enter amount', `Insufficient ${tokenA?.symbol || 'Balance'}`, 'Pool not found'][
        state
      ],
    [state, tokenA?.symbol]
  )

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (!event.defaultPrevented) {
        state === State.CanSwap ? swapTokens(route, exchange) : !wallet ? setVisible(true) : connect().catch(() => {})
      }
    },
    [connect, setVisible, state, swapTokens, wallet, route]
  )

  return (
    <SWAP_BUTTON height="56px" loading={loading} status={buttonStatus} onClick={handleClick}>
      <TEXT>{content}</TEXT>
    </SWAP_BUTTON>
  )
}
