import React, { FC, MouseEventHandler, useCallback, useMemo } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { MainButton } from '../../../components'
import { useAccounts, useCrypto, useOrder, useTokenRegistry, useWalletModal } from '../../../context'

enum State {
  Connect = 0,
  CanPlaceOrder = 1,
  NullAmount = 2,
  BalanceExceeded = 3
}

export const PlaceOrder: FC = () => {
  const { getUIAmount } = useAccounts()
  const { getAskSymbolFromPair, getSymbolFromPair, selectedCrypto } = useCrypto()
  const { order, placeOrder } = useOrder()
  const { getTokenInfoFromSymbol } = useTokenRegistry()
  const { connect, publicKey, wallet } = useWallet()
  const { setVisible } = useWalletModal()

  const ask = useMemo(() => getAskSymbolFromPair(selectedCrypto.pair), [getAskSymbolFromPair, selectedCrypto.pair])
  const placeOrderText = useMemo(() => `${order.side === 'buy' ? 'Buy' : 'Sell'} ${ask}`, [ask, order.side])

  const state = useMemo(() => {
    const tokenInfo = getTokenInfoFromSymbol(getSymbolFromPair(selectedCrypto.pair, order.side))

    if (!publicKey) {
      return State.Connect
    }
    // @ts-ignore
    if (!order.size || order.size === '0') {
      return State.NullAmount
    }

    if (!tokenInfo || order[order.side === 'buy' ? 'total' : 'size'] > getUIAmount(tokenInfo.address)) {
      return State.BalanceExceeded
    }

    return State.CanPlaceOrder
  }, [getSymbolFromPair, getTokenInfoFromSymbol, getUIAmount, order, publicKey, selectedCrypto.pair])

  const buttonStatus = useMemo(() => {
    switch (state) {
      case State.CanPlaceOrder:
      case State.Connect:
        return 'action'
      case State.BalanceExceeded:
        return 'not-allowed'
      default:
        return 'initial'
    }
  }, [state])

  const content = useMemo(
    () => ['Connect wallet', placeOrderText, placeOrderText, 'Balance exceeded'][state],
    [placeOrderText, state]
  )

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (!event.defaultPrevented) {
        state === State.CanPlaceOrder ? placeOrder() : !wallet ? setVisible(true) : connect().catch(() => {})
      }
    },
    [connect, placeOrder, setVisible, state, wallet]
  )

  return (
    <MainButton height="50px" onClick={handleClick} status={buttonStatus} width="100%">
      <span>{content}</span>
    </MainButton>
  )
}
