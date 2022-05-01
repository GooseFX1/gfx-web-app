import { Button } from 'antd'
import React, { useState, FC, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { useAccounts, useCrypto, usePriceFeed, useTokenRegistry, useTradeHistory } from '../../context'
import { SettlePanel } from './SettlePanel'

const tabs = ['Balances', 'Open Orders', 'Trade History']
const columns = [
  {
    Balances: ['Asset', 'Balances', 'In Orders', 'Unsettled', 'Available', 'USD Value']
  },
  {
    'Open Orders': ['Side', 'Size', 'Price', 'USD Value', 'Condition']
  },
  {
    'Trade History': ['Time', 'Size', 'Filled', 'Price', 'USD Value']
  }
]
const WRAPPER = styled.div`
  height: 100%;
  width: 100%;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg9};
`

const HEADER = styled.div`
  height: 80px;
  width: 100%;
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg12};
  padding: 10px 30px;
  div:first-child {
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    font-weight: 500;
    color: ${({ theme }) => theme.text20};
    span {
      cursor: pointer;
    }
    span.active {
      color: #ffffff;
    }
  }
  div:nth-child(2) {
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.text20};
    margin-top: 20px;
  }
  div:nth-child(2).Balances span {
    width: 16.67%;
  }
  div:nth-child(2).Open.Orders span {
    width: 20%;
  }
`
const BALANCES = styled.div`
  height: calc(100% - 80px);
  width: 100%;
  div {
    height: 45px;
    width: 100%;
    border-bottom: 1px solid ${({ theme }) => theme.rowSeparator};
    padding: 0px 0px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.text21};
    img {
      height: 25px;
      width: 25px;
      margin-right: 5px;
    }
    span {
      width: 16.67%;
    }
    span {
      padding-left: 15px;
    }
  }
`

const OPEN_ORDER = styled.div`
  height: calc(100% - 80px);
  width: 100%;
  div {
    height: 45px;
    width: 100%;
    border-bottom: 1px solid ${({ theme }) => theme.rowSeparator};
    padding: 0px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.text21};
    img {
      height: 25px;
      width: 25px;
      margin-right: 5px;
    }
    span {
      width: 20%;
      text-transform: capitalize;
      &.buy {
        color: #50bb35;
      }
      &.sell {
        color: #f06565;
      }
      button {
        width: 50%;
        padding: 0px;
      }
    }
  }
`

const NO_ORDER = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 50px;
`

const OpenOrdersComponent: FC = () => {
  const { formatPair, selectedCrypto, setSelectedCrypto } = useCrypto()
  const { cancelOrder, loading, orders } = useTradeHistory()

  const content = useMemo(
    () => (
      <OPEN_ORDER>
        {orders.map((order, index) => (
          <div>
            <span className={order.order.side}>{order.order.side}</span>
            <span>{order.order.size}</span>
            <span>${order.order.price}</span>
            <span>0</span>
            <span>
              <Button
                //height="30px"
                loading={loading}
                onClick={() => cancelOrder(order)}
                //status="action"
                //width="150px"
              >
                Cancel
              </Button>
            </span>
          </div>
        ))}
      </OPEN_ORDER>
    ),
    [cancelOrder, formatPair, loading, orders]
  )
  return <>{!orders.length ? <NO_ORDER>No open orders</NO_ORDER> : content}</>
}

export const HistoryPanel: FC = () => {
  const [activeTab, setActiveTab] = useState(0)
  const { getAskSymbolFromPair, getBidSymbolFromPair, selectedCrypto } = useCrypto()
  const { getPairFromMarketAddress, loading, openOrders, settleFunds, cancelOrder, orders } = useTradeHistory()
  const { prices } = usePriceFeed()
  const marketData = useMemo(() => prices[selectedCrypto.pair], [prices, selectedCrypto.pair])
  const { getTokenInfoFromSymbol } = useTokenRegistry()
  const { getUIAmount } = useAccounts()
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

  const tokenInfoAsk = useMemo(
    () => getTokenInfoFromSymbol(getAskSymbolFromPair(selectedCrypto.pair)),
    [selectedCrypto.pair]
  )
  const userAskBalance = useMemo(
    () => (tokenInfoAsk ? getUIAmount(tokenInfoAsk.address) : 0),
    [tokenInfoAsk, getUIAmount]
  )

  const tokenInfoBid = useMemo(
    () => getTokenInfoFromSymbol(getBidSymbolFromPair(selectedCrypto.pair)),
    [selectedCrypto.pair]
  )
  const userBidBalance = useMemo(
    () => (tokenInfoBid ? getUIAmount(tokenInfoBid.address) : 0),
    [tokenInfoBid, getUIAmount]
  )

  const addNumbers = (arg1, arg2, arg3) => {
    let sum = 0
    arg1 && (sum += arg1)
    arg2 && (sum += arg2)
    arg3 && (sum += arg3)
    if (sum > 0) return sum.toFixed(2)
    return sum
  }

  const { market } = selectedCrypto
  let openOrder, pair, baseAvailable, baseBalance, quoteAvailable, quoteBalance
  if (openOrders.length > 0) {
    openOrder = openOrders[0]
    pair = getPairFromMarketAddress(openOrder.market)
    baseAvailable = market?.baseSplSizeToNumber(openOrder.baseTokenFree)
    baseBalance = market?.baseSplSizeToNumber(openOrder.baseTokenTotal.sub(openOrder.baseTokenFree))
    quoteAvailable = market?.quoteSplSizeToNumber(openOrder.quoteTokenFree)
    quoteBalance = market?.quoteSplSizeToNumber(openOrder.quoteTokenTotal.sub(openOrder.quoteTokenFree))
  }

  return (
    <>
      <SettlePanel />
      <WRAPPER>
        <HEADER>
          <div>
            {tabs.map((item, index) => (
              <span className={index === activeTab ? 'active' : ''} onClick={() => setActiveTab(index)}>
                {item}
              </span>
            ))}
          </div>
          <div className={tabs[activeTab]}>
            {columns[activeTab][tabs[activeTab]].map((item) => (
              <span>{item}</span>
            ))}
          </div>
        </HEADER>
        {activeTab === 0 ? (
          <>
            <BALANCES>
              <div>
                <span>
                  <img className="asset-icon" src={assetIconAsk} alt="" />
                  {symbolAsk}
                </span>
                <span>{addNumbers(baseBalance, baseAvailable, userAskBalance)}</span>
                <span>{baseBalance ? baseBalance : 0}</span>
                <span>{baseAvailable ? baseAvailable : 0}</span>
                <span>{userAskBalance > 0 ? userAskBalance.toFixed(2) : userAskBalance}</span>
                <span>0</span>
              </div>
              <div>
                <span>
                  <img className="asset-icon" src={assetIconBid} alt="" />
                  {symbolBid}
                </span>
                <span>{addNumbers(quoteBalance, quoteAvailable, userBidBalance)}</span>
                <span>{quoteBalance ? quoteBalance : 0}</span>
                <span>{quoteAvailable ? quoteAvailable : 0}</span>
                <span>{userBidBalance > 0 ? userBidBalance.toFixed(2) : userBidBalance}</span>
                <span>0</span>
              </div>
            </BALANCES>
          </>
        ) : activeTab === 1 ? (
          <OpenOrdersComponent />
        ) : null}
      </WRAPPER>
    </>
  )
}
