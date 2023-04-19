import { Button } from 'antd'
import React, { FC } from 'react'
import { useCrypto, useDarkMode, useTradeHistory } from '../../context'
import tw, { styled } from 'twin.macro'

const SETTLE_CONTAINER = styled.div`
  padding: 10px 0 0 10px;
`

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

const SettleCard: FC = () => {
  const { getAskSymbolFromPair, getBidSymbolFromPair, selectedCrypto } = useCrypto()
  const { getPairFromMarketAddress, loading, openOrders, settleFunds } = useTradeHistory()
  const settleButtons = []
  openOrders.map((openOrder) => {
    const { market } = selectedCrypto
    const pair = getPairFromMarketAddress(openOrder.market)
    const baseAvailable = market?.baseSplSizeToNumber(openOrder.baseTokenFree)
    const quoteAvailable = market?.quoteSplSizeToNumber(openOrder.quoteTokenFree)

    if (quoteAvailable ?? 0) {
      const bidSettleButton = (
        <SETTLE_CARD>
          <span>{selectedCrypto.pair}</span>
          <span>{quoteAvailable}</span>
          <span>{quoteAvailable}</span>
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
        </SETTLE_CARD>
      )
      settleButtons.push(bidSettleButton)
    }

    if (baseAvailable ?? 0) {
      const bidSettleButton = (
        <SETTLE_CARD>
          <span>{selectedCrypto.pair}</span>
          <span>{baseAvailable}</span>
          <span>{baseAvailable}</span>
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
        </SETTLE_CARD>
      )
      settleButtons.push(bidSettleButton)
    }
  })
  return settleButtons.length ? <>{settleButtons.map((item) => item)}</> : null
}

export const SettlePanel: FC = () => {
  //const { openOrders } = useTradeHistory()
  const { mode } = useDarkMode()
  const comps = <SettleCard />
  return comps.type() === null ? (
    <div className="no-positions-found">
      <img src={`/img/assets/NoPositionsFound_${mode}.svg`} alt="no-positions-found" />
      <div>No Accounts Unsettled</div>
    </div>
  ) : (
    <SETTLE_CONTAINER>{comps}</SETTLE_CONTAINER>
  )
}
