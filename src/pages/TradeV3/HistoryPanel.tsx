/* eslint-disable */
import { Button } from 'antd'
import React, { useState, FC, useMemo } from 'react'
import {
  useAccounts,
  useCrypto,
  useTokenRegistry,
  useTradeHistory,
  useOrderBook,
  useDarkMode
} from '../../context'
import tw, { styled } from 'twin.macro'
import { useTraderConfig } from '../../context/trader_risk_group'
import { SettlePanel } from '../TradeV3/SettlePanel'
import { getPerpsPrice } from './perps/utils'

const tabs = ['Positions', 'Open Orders', 'Trade History', 'SOL Unsettled P&L']

const columns = [
  {
    Positions: [
      'Side',
      'Position size',
      'Notional Size',
      'Liquidation Price',
      'Market Price',
      'Entry Price',
      'Break Even Price'
    ]
  },
  {
    'Open Orders': ['Side', 'Size', 'Price', 'USD Value', 'Condition']
  },
  {
    'Trade History': ['Side', 'Size', 'Price', 'USD Value']
  },
  {
    'SOL Unsettled P&L': ['Market', 'Size', 'Amount USDC']
  }
]
const WRAPPER = styled.div`
  ${tw`h-full w-full overflow-y-hidden`}
  border-right: ${({ theme }) => '1px solid ' + theme.tokenBorder};
  border-bottom: ${({ theme }) => '1px solid ' + theme.tokenBorder};
  .no-positions-found {
    padding-top: 40px;
    text-align: center;

    > div {
      ${tw`mt-3.75 text-gray-2 text-tiny font-semibold`}
    }
  }
`

const HEADER = styled.div`
  ${tw`w-full`}
  background-color: ${({ theme }) => theme.bg2};
  .header-wrapper {
    ${tw`flex justify-around`}
    background-color: ${({ theme }) => theme.bg2};
    .open-order-header {
      ${tw`flex flex-row`}
      .count {
        ${tw`h-[18px] w-[18px] font-semibold ml-2.5 rounded-circle text-center text-12`}
        background-image: linear-gradient(96deg, #f7931a 1%, #ac1cc7 99%);
        color: ${({ theme }) => theme.text1};
      }
    }
    .gradient-border {
      ${tw`w-1/4 h-[31px] p-0.5`}
      border: ${({ theme }) => '1px solid ' + theme.tokenBorder};
      .tab {
        ${tw`cursor-pointer h-full w-full flex flex-row items-center 
        justify-center font-semibold cursor-pointer text-12 text-gray-2`}
        background-color: ${({ theme }) => theme.bg2};
      }
      .tab.active {
        color: ${({ theme }) => theme.text28};
        background-image: linear-gradient(to right, rgba(247, 147, 26, 0.4) 0%, rgba(172, 28, 199, 0.4) 100%);
      }
      .white-background {
        ${tw`bg-white h-full w-full`}
      }
    }
    .gradient-border.active {
      background: linear-gradient(92deg, #f7931a 0%, #ac1cc7 100%);
      border: none;
    }
  }

  .headers {
    ${tw`h-[26px] pl-3`}
    border-bottom: ${({ theme }) => '1px solid ' + theme.tokenBorder};
    border-right: ${({ theme }) => '1px solid ' + theme.tokenBorder};
    border-left: ${({ theme }) => '1px solid ' + theme.tokenBorder};

    span {
      ${tw`text-12 font-semibold w-[13%] inline-block text-gray-2`}
    }
  }
  .headers.Open-Orders > span {
    ${tw`w-1/5`}
  }
  .headers.Trade-History > span {
    ${tw`w-1/5`}
  }
  .headers.SOL-Unsettled-P-L > span {
    ${tw`w-1/3`}
  }
`
const POSITIONS = styled.div`
  ${tw`w-full`}
  height: calc(100% - 80px);

  .positions {
    ${tw`w-full h-10 p-0 flex flex-row justify-between items-center text-14 font-semibold`}
    color: ${({ theme }) => theme.text28};
    span {
      ${tw`w-[12.5%]`}
    }
    span {
      ${tw`text-center`}
    }
    span:first-child {
      ${tw`pl-3 text-left`}
    }
    button {
      ${tw`h-[30px] w-[12.5%] rounded-[12px] text-12 font-semibold border-none m-[5px] text-white`}
      background: linear-gradient(96deg, #f7931a 1%, #ac1cc7 99%);
      outline: none;
    }
    .long {
      ${tw`text-[#71c25d] text-12`}
    }
    .short {
      ${tw`text-[#f06565] text-12`}
    }
  }
`

const OPEN_ORDER = styled.div`
  ${tw`w-full`}
  height: calc(100% - 80px);

  div {
    ${tw`w-full h-[45px] py-0 pr-0 pl-3 flex justify-between items-center text-14 font-medium`}
    color: ${({ theme }) => theme.text24};
    .ant-btn > span {
      ${tw`inline`}
    }
    img {
      ${tw`w-[25px] h-[25px] mr-[5px]`}
    }
    span {
      ${tw`w-1/5 capitalize`}
      &.buy {
        ${tw`text-[#50bb35]`}
      }
      &.sell {
        ${tw`text-[#f06565]`}
      }
      button {
        ${tw`w-1/2 p-0`}
      }
    }
  }
`

const OpenOrdersComponent: FC = () => {
  const { formatPair, isSpot } = useCrypto()
  const { cancelOrder, loading, orders } = useTradeHistory()
  const { perpsOpenOrders, orderBook } = useOrderBook()
  const { cancelOrder: perpsCancelOrder } = useTraderConfig()
  const { mode } = useDarkMode()

  const openOrderUI = isSpot ? orders : perpsOpenOrders

  const cancelOrderFn = (orderId: string) => {
    perpsCancelOrder(orderId)
  }

  const content = useMemo(
    () => (
      <OPEN_ORDER>
        {openOrderUI &&
          openOrderUI.length > 0 &&
          openOrderUI.map((order, index) => (
            <div key={index}>
              <span className={order.order.side}>{order.order.side}</span>
              <span>{order.order.size}</span>
              <span>${order.order.price}</span>
              <span>{(order.order.size * order.order.price).toFixed(2)}</span>
              <span>
                <Button loading={loading} onClick={() => cancelOrderFn(order.order.orderId)}>
                  Cancel
                </Button>
              </span>
            </div>
          ))}
      </OPEN_ORDER>
    ),
    [cancelOrder, formatPair, loading, orders, perpsOpenOrders, isSpot]
  )
  return (
    <>
      {!openOrderUI.length ? (
        <div className="no-positions-found">
          <img src={`/img/assets/NoPositionsFound_${mode}.svg`} alt="no-positions-found" />
          <div>No Open Orders</div>
        </div>
      ) : (
        content
      )}
    </>
  )
}

export const HistoryPanel: FC = () => {
  const [activeTab, setActiveTab] = useState(0)
  const { getAskSymbolFromPair, getBidSymbolFromPair, selectedCrypto, isSpot } = useCrypto()
  const { openOrders } = useTradeHistory()
  const { getTokenInfoFromSymbol } = useTokenRegistry()
  const { getUIAmount } = useAccounts()
  const { perpsOpenOrders, orderBook } = useOrderBook()
  const { mode } = useDarkMode()
  const { traderInfo } = useTraderConfig()
  const perpsPrice = useMemo(() => getPerpsPrice(orderBook), [orderBook])
  const notionalSize = useMemo(
    () => (Number(traderInfo.averagePosition.quantity) * perpsPrice).toFixed(2),
    [perpsPrice, traderInfo.averagePosition.quantity]
  )

  const tokenInfoAsk = useMemo(
    () => getTokenInfoFromSymbol(getAskSymbolFromPair(selectedCrypto.pair)),
    [selectedCrypto.pair]
  )
  const userAskBalance = useMemo(
    () => (tokenInfoAsk ? getUIAmount(tokenInfoAsk.address) : 0),
    [tokenInfoAsk, getUIAmount]
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
  let openOrder, baseAvailable, baseBalance, quoteAvailable, quoteBalance
  if (openOrders.length > 0) {
    openOrder = openOrders[0]
    baseAvailable = market?.baseSplSizeToNumber(openOrder.baseTokenFree)
    baseBalance = market?.baseSplSizeToNumber(openOrder.baseTokenTotal.sub(openOrder.baseTokenFree))
    quoteAvailable = market?.quoteSplSizeToNumber(openOrder.quoteTokenFree)
    quoteBalance = market?.quoteSplSizeToNumber(openOrder.quoteTokenTotal.sub(openOrder.quoteTokenFree))
  }

  return (
    <>
      <WRAPPER>
        <HEADER>
          <div className="header-wrapper">
            {tabs.map((item, index) => (
              <div className={index === activeTab ? 'active gradient-border' : 'gradient-border'} key={index}>
                <div className="white-background">
                  <div className={index === activeTab ? 'active tab' : 'tab'} onClick={() => setActiveTab(index)}>
                    {index === 1 ? (
                      <div className="open-order-header">
                        <div>{item}</div>
                        {!isSpot && (
                          <div className="count">{perpsOpenOrders.length > 0 ? perpsOpenOrders.length : 0}</div>
                        )}
                      </div>
                    ) : (
                      item
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className={`${tabs[activeTab].replaceAll(' ', '-').replaceAll('&', '-')} headers`}>
            {columns[activeTab][tabs[activeTab]].map((item, index) => (
              <span key={index}>{item}</span>
            ))}
          </div>
        </HEADER>
        {activeTab === 0 ? (
          <>
            <POSITIONS>
              {traderInfo.averagePosition.side ? (
                <div className="positions">
                  <span className={traderInfo.averagePosition.side === 'buy' ? 'long' : 'short'}>
                    {traderInfo.averagePosition.side === 'buy' ? 'Long' : 'Short'}
                  </span>
                  <span>{traderInfo.averagePosition.quantity}</span>
                  <span>{notionalSize}</span>
                  <span>{baseAvailable ? baseAvailable : 0}</span>
                  <span>{perpsPrice}</span>
                  <span>{traderInfo.averagePosition.price}</span>
                  <span>{traderInfo.averagePosition.price}</span>
                  <button>Close Position</button>
                </div>
              ) : (
                <div className="no-positions-found">
                  <img src={`/img/assets/NoPositionsFound_${mode}.svg`} alt="no-positions-found" />
                  <div>No Positions Found</div>
                </div>
              )}
            </POSITIONS>
          </>
        ) : activeTab === 1 ? (
          <OpenOrdersComponent />
        ) : activeTab === 3 ? (
          <SettlePanel />
        ) : null}
      </WRAPPER>
    </>
  )
}
