/* eslint-disable */
import { Button } from 'antd'
import React, { useState, FC, useMemo } from 'react'
import { useAccounts, useCrypto, useTokenRegistry, useTradeHistory, useOrderBook } from '../../context'
import tw, { styled } from 'twin.macro'

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
    'Trade History': ['Time', 'Size', 'Filled', 'Price', 'USD Value']
  },
  {
    'SOL Unsettled P&L': ['Time', 'Size', 'Filled', 'Price', 'USD Value']
  }
]
const WRAPPER = styled.div`
  ${tw`h-full w-full`}
`

const HEADER = styled.div`
  ${tw`w-full`}
  background-color: ${({ theme }) => theme.bg15};
  .header-wrapper {
    ${tw`flex justify-around`}
    .open-order-header {
      ${tw`flex flex-row`}
      .count {
        ${tw`h-[18px] w-[18px] font-semibold ml-2.5 rounded-circle text-center text-12`}
        background-image: linear-gradient(96deg, #f7931a 1%, #ac1cc7 99%);
        color: ${({ theme }) => theme.text1};
      }
    }
    .gradient-border {
      ${tw`w-1/4 h-[31px] p-px`}
      border: ${({ theme }) => '1px solid ' + theme.tokenBorder};
      .tab {
        ${tw`cursor-pointer h-full w-full flex flex-row items-center 
        justify-center font-semibold cursor-pointer text-12`}
        background-color: ${({ theme }) => theme.bg15};
        color: ${({ theme }) => theme.text20};
      }
      .tab.active {
        ${tw`text-white`}
      }
    }
    .gradient-border.active {
      background-image: linear-gradient(96deg, #f7931a 1%, #ac1cc7 99%);
      border-right: none;
      border-left: none;
    }
  }

  .headers {
    ${tw`h-[26px] pl-3`}
    border-bottom: ${({ theme }) => '1px solid ' + theme.tokenBorder};
    border-right: ${({ theme }) => '1px solid ' + theme.tokenBorder};
    border-left: ${({ theme }) => '1px solid ' + theme.tokenBorder};

    span {
      ${tw`text-12 font-semibold w-[13%] inline-block`}
      color: ${({ theme }) => theme.text20};
    }
  }
  .headers.Open-Orders > span {
    ${tw`w-1/5`}
  }
  .headers.Trade-History > span {
    ${tw`w-1/5`}
  }
  .headers.SOL-Unsettled-P-L > span {
    ${tw`w-1/5`}
  }
`
const POSITIONS = styled.div`
  ${tw`w-full`}
  height: calc(100% - 80px);
  border-right: ${({ theme }) => '1px solid ' + theme.tokenBorder};

  div {
    ${tw`w-full h-10 p-0 flex flex-row justify-between items-center text-14 font-medium`}
    color: ${({ theme }) => theme.text24};
    span {
      ${tw`w-[12.5%]`}
      width: 12.5%;
    }
    span {
      ${tw`text-center`}
    }
    span:first-child {
      ${tw`pl-3 text-left`}
    }
    button {
      ${tw`h-[30px] w-[12.5%] rounded-[12px] text-12 font-semibold border-none m-[5px]`}
      background-image: linear-gradient(96deg, #f7931a 1%, #ac1cc7 99%);
      color: ${({ theme }) => theme.text1};
      outline: none;
    }
    .long {
      ${tw`text-[#50d71e]`}
    }
    .short {
      ${tw`text-[#f06565]`}
    }
  }
`

const OPEN_ORDER = styled.div`
  ${tw`w-full`}
  height: calc(100% - 80px);
  border-right: ${({ theme }) => '1px solid ' + theme.tokenBorder};

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

const NO_ORDER = styled.div`
  ${tw`flex justify-center mt-[50px]`}
`

const OpenOrdersComponent: FC = () => {
  const { formatPair, isSpot } = useCrypto()
  const { cancelOrder, loading, orders } = useTradeHistory()
  const { perpsOpenOrders } = useOrderBook()
  //DELETE:
  const abc = [
    {
      order: {
        side: 'buy',
        size: 10.2,
        price: '14'
      }
    },
    {
      order: {
        side: 'sell',
        size: 10.2,
        price: '14'
      }
    }
  ]
  const openOrderUI = isSpot ? abc : perpsOpenOrders

  const content = useMemo(
    () => (
      <OPEN_ORDER>
        {openOrderUI.map((order, index) => (
          <div key={index}>
            <span className={order.order.side}>{order.order.side}</span>
            <span>{order.order.size}</span>
            <span>${order.order.price}</span>
            <span>0</span>
            <span>
              <Button loading={loading}>Cancel</Button>
            </span>
          </div>
        ))}
      </OPEN_ORDER>
    ),
    [cancelOrder, formatPair, loading, orders, perpsOpenOrders, isSpot]
  )
  return <>{!abc.length ? <NO_ORDER>No open orders</NO_ORDER> : content}</>
}

export const HistoryPanel: FC = () => {
  const [activeTab, setActiveTab] = useState(0)
  const { getAskSymbolFromPair, getBidSymbolFromPair, selectedCrypto, isSpot } = useCrypto()
  const { openOrders } = useTradeHistory()
  const { orders } = useTradeHistory()

  const { getTokenInfoFromSymbol } = useTokenRegistry()
  const { getUIAmount } = useAccounts()
  const { perpsOpenOrders } = useOrderBook()
  // const symbolBid = useMemo(
  //   () => getBidSymbolFromPair(selectedCrypto.pair),
  //   [getBidSymbolFromPair, selectedCrypto.pair]
  // )
  // const symbolAsk = useMemo(
  //   () => getAskSymbolFromPair(selectedCrypto.pair),
  //   [getAskSymbolFromPair, selectedCrypto.pair]
  // )

  // const assetIconBid = useMemo(
  //   () => `/img/${selectedCrypto.type}/${selectedCrypto.type === 'synth' ? `g${symbolBid}` : symbolBid}.svg`,
  //   [symbolBid, selectedCrypto.type]
  // )

  // const assetIconAsk = useMemo(
  //   () => `/img/${selectedCrypto.type}/${selectedCrypto.type === 'synth' ? `g${symbolAsk}` : symbolAsk}.svg`,
  //   [symbolAsk, selectedCrypto.type]
  // )

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
              <div>
                <span className="long">Long</span>
                <span>{addNumbers(baseBalance, baseAvailable, userAskBalance)}</span>
                <span>{baseBalance ? baseBalance : 0}</span>
                <span>{baseAvailable ? baseAvailable : 0}</span>
                <span>{userAskBalance > 0 ? userAskBalance.toFixed(2) : userAskBalance}</span>
                <span>{userAskBalance > 0 ? userAskBalance.toFixed(2) : userAskBalance}</span>
                <span>0</span>
                <button>Close Position</button>
              </div>
              <div>
                <span className="short">Short</span>
                <span>{addNumbers(quoteBalance, quoteAvailable, userBidBalance)}</span>
                <span>{quoteBalance ? quoteBalance : 0}</span>
                <span>{quoteAvailable ? quoteAvailable : 0}</span>
                <span>{userBidBalance > 0 ? userBidBalance.toFixed(2) : userBidBalance}</span>
                <span>0</span>
                <span>0</span>
                <button>Close Position</button>
              </div>
            </POSITIONS>
          </>
        ) : activeTab === 1 ? (
          <OpenOrdersComponent />
        ) : null}
      </WRAPPER>
    </>
  )
}
