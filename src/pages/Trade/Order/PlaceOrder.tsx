import React, { FC, MouseEventHandler, useCallback, useMemo } from 'react'
import { useWallet } from '@solana/wallet-adapter-react'
import { MainButton } from '../../../components'
import { useAccounts, useMarket, useOrder, useTokenRegistry, useWalletModal } from '../../../context'

enum State {
  Connect = 0,
  CanPlaceOrder = 1,
  NullAmount = 2,
  BalanceExceeded = 3,
  // PoolNotFound = 4
}

export const PlaceOrder: FC = () => {
  const { getUIAmount } = useAccounts()
  const { getAskSymbolFromPair, getBidSymbolFromPair, selectedMarket } = useMarket()
  const { order, placeOrder } = useOrder()
  const { getTokenInfoFromSymbol } = useTokenRegistry()
  const { connect, publicKey, wallet } = useWallet()
  const { setVisible } = useWalletModal()

  const ask = useMemo(() => getAskSymbolFromPair(selectedMarket.pair), [getAskSymbolFromPair, selectedMarket.pair])
  const bid = useMemo(() => getBidSymbolFromPair(selectedMarket.pair), [getBidSymbolFromPair, selectedMarket.pair])
  const placeOrderText = useMemo(() => `${order.side === 'buy' ? 'Buy' : 'Sell'} ${ask}`, [ask, order.side])

  const state = useMemo(() => {
    const tokenInfo = getTokenInfoFromSymbol(order.side === 'buy' ? bid : ask)

    if (!publicKey) {
      return State.Connect
    } if (!order.size) {
      return State.NullAmount
    } if (!tokenInfo || order.size > getUIAmount(tokenInfo.address)) {
      return State.BalanceExceeded
    } else {
      return State.CanPlaceOrder
    }
  }, [ask, bid, getTokenInfoFromSymbol, getUIAmount, order.side, order.size, publicKey])

  const buttonStatus = useMemo(() => {
    switch (state) {
      case State.CanPlaceOrder:
        return 'action'
      case State.Connect:
        return 'interact'
      case State.NullAmount:
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
    <MainButton height='50px' onClick={handleClick} status={buttonStatus} width='100%'>
      <span>{content}</span>
    </MainButton>
  )
}
