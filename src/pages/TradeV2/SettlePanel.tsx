import { Button } from 'antd'
import React, { useState, FC, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { useCrypto, useTradeHistory } from '../../context'

const SETTLE_CONTAINER = styled.div`
  width: 100%;
  height: 100px;
  background-color: ${({ theme }) => theme.bg9};
  margin-bottom: 15px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  padding: 15px 30px;
  color: ${({ theme }) => theme.text7};
  .settleAllButton {
    background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    border-radius: 36px;
    margin-left: auto;
  }
`

const SETTLE_CARD = styled.div`
  background-color: ${({ theme }) => theme.bg13};
  margin-left: 25px;
  height: 80%;
  width: 200px;
  display: flex;
  align-items: center;
  border-radius: 8px;
  padding: 10px;
  .asset-icon {
    height: 25px;
    width: 25px;
  }
  .settleButton {
    background-color: ${({ theme }) => theme.primary2};
    border-radius: 36px;
    width: 60px;
    padding: 0px;
    margin-left: 10px;
    text-decoration: none;
  }
  div:nth-child(2).secondDiv {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
    margin-left: 10px;
    div {
      height: 15px;
      font-size: 12px;
    }
    div:nth-child(2) {
      color: #50bb35;
    }
  }
`

const SettleCard: FC = () => {
  const { getAskSymbolFromPair, getBidSymbolFromPair, selectedCrypto } = useCrypto()
  const { getPairFromMarketAddress, loading, openOrders, settleFunds } = useTradeHistory()
  const symbolBid = useMemo(
    () => getBidSymbolFromPair(selectedCrypto.pair),
    [getBidSymbolFromPair, selectedCrypto.pair]
  )
  const symbolAsk = useMemo(
    () => getAskSymbolFromPair(selectedCrypto.pair),
    [getAskSymbolFromPair, selectedCrypto.pair]
  )

  const assetIconBid = useMemo(
    () => `/img/${selectedCrypto.type}/${selectedCrypto.type === 'synth' ? `g${symbolBid}` : symbolBid}.svg`,
    [symbolBid, selectedCrypto.type]
  )

  const assetIconAsk = useMemo(
    () => `/img/${selectedCrypto.type}/${selectedCrypto.type === 'synth' ? `g${symbolAsk}` : symbolAsk}.svg`,
    [symbolAsk, selectedCrypto.type]
  )
  let settleButtons = []
  openOrders.map((openOrder, index) => {
    const { market } = selectedCrypto
    const pair = getPairFromMarketAddress(openOrder.market)
    const baseAvailable = market?.baseSplSizeToNumber(openOrder.baseTokenFree)
    const baseBalance = market?.baseSplSizeToNumber(openOrder.baseTokenTotal.sub(openOrder.baseTokenFree))
    const quoteAvailable = market?.quoteSplSizeToNumber(openOrder.quoteTokenFree)
    const quoteBalance = market?.quoteSplSizeToNumber(openOrder.quoteTokenTotal.sub(openOrder.quoteTokenFree))

    if (quoteAvailable ?? 0) {
      let bidSettleButton = (
        <SETTLE_CARD>
          <div>
            <img className="asset-icon" src={assetIconBid} alt="" />
          </div>
          <div className="secondDiv">
            <div>{symbolBid}</div>
            <div>{quoteAvailable}</div>
          </div>
          <div>
            <Button
              className="settleButton"
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
        </SETTLE_CARD>
      )
      settleButtons.push(bidSettleButton)
    }

    if (baseAvailable ?? 0) {
      let bidSettleButton = (
        <SETTLE_CARD>
          <div>
            <img className="asset-icon" src={assetIconAsk} alt="" />
          </div>
          <div className="secondDiv">
            <div>{symbolAsk}</div>
            <div>{baseAvailable}</div>
          </div>
          <div>
            <Button
              className="settleButton"
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
        </SETTLE_CARD>
      )
      settleButtons.push(bidSettleButton)
    }

    if (settleButtons.length > 0) {
      let settleAllButton = (
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
          <span>Settle All</span>
        </Button>
      )
      settleButtons.push(settleAllButton)
    }
  })
  return settleButtons.length ? <>{settleButtons.map((item) => item)}</> : null
}

export const SettlePanel: FC = () => {
  let comps = <SettleCard />
  if (comps.type() === null) return null
  else
    return (
      <SETTLE_CONTAINER>
        <div>Unsettled Balances</div>
        {comps}
      </SETTLE_CONTAINER>
    )
}
