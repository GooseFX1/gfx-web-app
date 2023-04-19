/* eslint-disable */

import { FC } from 'react'
import tw, { styled } from 'twin.macro'
import { useCrypto, useTradeHistory } from '../../../context'
import { Button } from 'antd'

const SETTLE_CARD = styled.div`
  display: flex;
  align-items: center;
  position: relative;

  .settleAllButton {
    ${tw`bg-red-1 ml-auto`}
    position: absolute;
    right: 10px;
    top: -5px;
  }

  > span {
    width: 33%;
  }
`

export const SettleCardMobi: FC = () => {
  const { getAskSymbolFromPair, getBidSymbolFromPair, selectedCrypto } = useCrypto()
  const { getPairFromMarketAddress, loading, openOrders, settleFunds } = useTradeHistory()
  const settleButtons = []
  openOrders.map((openOrder) => {
    const { market } = selectedCrypto
    const pair = getPairFromMarketAddress(openOrder.market)
    const baseAvailable = 900
    const quoteAvailable = 900

    if (quoteAvailable ?? 0) {
      const bidSettleButton = (
        <SETTLE_CARD>
          <div tw="flex flex-row justify-between items-center mb-2">
            <span tw="mr-2 font-semibold text-regular dark:text-grey-5 text-grey-1">{selectedCrypto.pair}</span>
            <Button
              className="settleAllButton"
              loading={loading}
              onClick={() =>
                settleFunds(
                  openOrder,
                  baseAvailable,
                  quoteAvailable,
                  getAskSymbolFromPair(pair),
                  getBidSymbolFromPair(pair)
                )
              }
            >
              {' '}
              <span>Settle</span>
            </Button>
          </div>

          <div tw="flex flex-row mb-3">
            <div tw="flex flex-col w-1/3">
              <span className="label">Size</span>
              <span className="value">{quoteAvailable}</span>
            </div>
            <div tw="flex flex-col w-1/3">
              <span className="label">Price</span>
              <span className="value">{quoteAvailable}</span>
            </div>
            <div tw="flex flex-col w-1/3">
              <span className="label">Amount USDC</span>
              <span className="value">$00.00</span>
            </div>
          </div>
        </SETTLE_CARD>
      )
      settleButtons.push(bidSettleButton)
    }

    if (baseAvailable ?? 0) {
      const bidSettleButton = (
        <SETTLE_CARD>
          <div tw="flex flex-row justify-between items-center mb-2">
            <span tw="mr-2 font-semibold text-regular dark:text-grey-5 text-grey-1">{selectedCrypto.pair}</span>
            <Button
              className="settleAllButton"
              loading={loading}
              onClick={() =>
                settleFunds(
                  openOrder,
                  baseAvailable,
                  quoteAvailable,
                  getAskSymbolFromPair(pair),
                  getBidSymbolFromPair(pair)
                )
              }
            >
              {' '}
              <span>Settle</span>
            </Button>
          </div>

          <div tw="flex flex-row mb-3">
            <div tw="flex flex-col w-1/3">
              <span className="label">Size</span>
              <span className="value">{baseAvailable}</span>
            </div>
            <div tw="flex flex-col w-1/3">
              <span className="label">Price</span>
              <span className="value">{baseAvailable}</span>
            </div>
            <div tw="flex flex-col w-1/3">
              <span className="label">Amount USDC</span>
              <span className="value">$00.00</span>
            </div>
          </div>
        </SETTLE_CARD>
      )
      settleButtons.push(bidSettleButton)
    }
  })
  return settleButtons.length ? <>{settleButtons.map((item) => item)}</> : null
}
