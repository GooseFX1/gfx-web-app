/* eslint-disable */
import { Button } from 'antd'
import React, { useState, FC, useMemo } from 'react'
import {
  useAccounts,
  useCrypto,
  useTokenRegistry,
  useTradeHistory,
  useOrderBook,
  useDarkMode,
  usePriceFeed
} from '../../context'
import tw, { styled } from 'twin.macro'
import { ITraderHistory, useTraderConfig } from '../../context/trader_risk_group'
import { SettlePanel } from '../TradeV3/SettlePanel'
import { getPerpsPrice } from './perps/utils'
import { ClosePosition } from './ClosePosition'
import { PopupCustom } from '../NFTs/Popup/PopupCustom'
import 'styled-components/macro'
import { RotatingLoader } from '../../components/RotatingLoader'
import { PerpsEndModal } from './PerpsEndModal'

const tabs = ['Positions', 'Open Orders', 'Trade History', 'SOL Unsettled P&L']

const END_MODAL = styled(PopupCustom)`
  ${tw`!h-[450px] !w-[500px] rounded-bigger`}
  background-color: ${({ theme }) => theme.bg25};

  .ant-modal-header {
    ${tw`rounded-t-half rounded-tl-half rounded-tr-half px-[25px] pt-5 pb-0 border-b-0`}
    background-color: ${({ theme }) => theme.bg25};
  }
  .ant-modal-content {
    ${tw`shadow-none`}
  }
  .ant-modal-body {
    ${tw`py-0 px-[25px]`}
  }
`

const columns = [
  {
    Positions: ['Market', 'Side', 'Entry Price', 'Quantity', 'Market Price', 'Value', 'Est. Liq Price', 'PNL']
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
  border: ${({ theme }) => '1px solid ' + theme.tokenBorder};
  border-top: none;
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
        ${tw`h-[18px] w-[18px] font-semibold ml-2.5 rounded-circle text-tiny`}
        background-image: linear-gradient(96deg, #f7931a 1%, #ac1cc7 99%);
        color: ${({ theme }) => theme.white};
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    .gradient-border {
      ${tw`w-1/4 h-[31px] p-0.5`}
      border: ${({ theme }) => '1px solid ' + theme.tokenBorder};
      .tab {
        ${tw`cursor-pointer h-full w-full flex flex-row items-center 
        justify-center font-semibold cursor-pointer text-tiny text-[#636363] dark:text-[#B5B5B5]`}
        background-color: ${({ theme }) => theme.bg2};
      }
      .tab.active {
        color: ${({ theme }) => theme.text32};
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
    .gradient-border:last-child {
      border-right: none;
    }
  }

  .headers {
    ${tw`h-[26px]`}
    border-bottom: ${({ theme }) => '1px solid ' + theme.tokenBorder};
    border-left: ${({ theme }) => '1px solid ' + theme.tokenBorder};

    span {
      ${tw`text-tiny font-semibold w-[12.5%] inline-block text-[#636363] dark:text-[#B5B5B5]`}
    }
  }
  .headers.Positions {
    span:first-child {
      ${tw`pl-3`}
    }
    span {
      ${tw`w-[11.1%]`}
    }
  }
  .headers.Open-Orders {
    span:first-child {
      ${tw`pl-3`}
    }
  }
  .headers.Open-Orders > span {
    ${tw`w-1/5`}
  }
  .headers.Trade-History {
    ${tw`pl-1`}
    span:first-child {
      ${tw`pl-3`}
    }
    > span {
      ${tw`w-1/4`}
    }
  }
  .headers.SOL-Unsettled-P-L > span {
    ${tw`w-1/3`}
  }
`
const POSITIONS = styled.div`
  ${tw`w-full`}
  height: calc(100% - 57px);

  .positions {
    ${tw`w-full h-10 p-0 text-sm font-semibold dark:text-[#EEEEEE] text-[#3C3C3C]`}
    span {
      ${tw`w-[11.1%] inline-block`}
    }
    button {
      ${tw`h-[30px] w-[75px] bg-red-1 rounded-tiny text-tiny font-semibold border-none m-[5px] text-white`}
      outline: none;
    }
    span:first-child {
      ${tw`text-tiny pl-3`}
    }
    .long {
      ${tw`text-green-2 text-tiny`}
    }
    .short {
      ${tw`text-red-1 text-tiny`}
    }
  }
`

const OPEN_ORDER = styled.div`
  ${tw`w-full overflow-y-auto`}
  height: calc(100% - 60px);

  div {
    ${tw`w-full h-[45px] py-0 pr-0 pl-3 flex justify-between items-center text-sm font-medium`}
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
  .cancelButton {
    ${tw`bg-[#f06565]`}
  }
`

const TRADE_HISTORY = styled.div`
  ${tw`w-full`}
  height: calc(100% - 57px);
  overflow-y: scroll;
  ::-webkit-scrollbar {
    display: none;
  }
  div {
    ${tw`w-full h-[45px] text-sm font-medium py-1`}
    color: ${({ theme }) => theme.text24};
    span {
      ${tw`w-1/4 inline-block capitalize`}
    }
    .Long {
      ${tw`text-[#71c25d] text-tiny pl-3`}
    }
    .Short {
      ${tw`text-[#f06565] text-tiny pl-3`}
    }
  }
`

const SETTING_MODAL = styled(PopupCustom)`
  ${tw`!h-[478px] !w-[500px] rounded-bigger`}
  background-color: ${({ theme }) => theme.bg25};

  .ant-modal-header {
    ${tw`rounded-t-half rounded-tl-half rounded-tr-half px-[25px] pt-5 pb-0 border-b-0`}
    background-color: ${({ theme }) => theme.bg25};
  }
  .ant-modal-content {
    ${tw`shadow-none`}

    .ant-modal-close {
      ${tw`top-[30px]`}
    }
  }
  .ant-modal-body {
    ${tw`py-0 px-[25px]`}
  }
`

const OpenOrdersComponent: FC = () => {
  const { formatPair, isSpot } = useCrypto()
  const { cancelOrder, orders } = useTradeHistory()
  const { perpsOpenOrders, orderBook } = useOrderBook()
  const { cancelOrder: perpsCancelOrder } = useTraderConfig()
  const { mode } = useDarkMode()
  const [removedOrderIds, setremoved] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const openOrderUI = isSpot ? orders : perpsOpenOrders

  const cancelOrderFn = async (orderId: string) => {
    setLoading(true)
    const res = await perpsCancelOrder(orderId)
    setLoading(false)
    const arr = removedOrderIds
    if (res && res.txid) {
      arr.push(orderId)
      setremoved(arr)
    }
  }

  const content = useMemo(
    () => (
      <OPEN_ORDER>
        {openOrderUI &&
          openOrderUI.length > 0 &&
          openOrderUI.map((order, index) =>
            !removedOrderIds.includes(order.order.orderId) ? (
              <div key={index}>
                <span className={order.order.side}>{order.order.side}</span>
                <span>{order.order.size}</span>
                <span>${order.order.price}</span>
                <span>{(order.order.size * order.order.price).toFixed(2)}</span>
                <span>
                  <Button
                    className="cancelButton"
                    loading={false}
                    onClick={() => cancelOrderFn(order.order.orderId)}
                  >
                    {loading ? <RotatingLoader text="" textSize={8} iconSize={16} /> : 'Cancel'}
                  </Button>
                </span>
              </div>
            ) : null
          )}
      </OPEN_ORDER>
    ),
    [cancelOrder, formatPair, orders, perpsOpenOrders, isSpot]
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

const TradeHistoryComponent: FC = () => {
  const { tradeHistoryNew } = useTradeHistory()
  const { selectedCrypto } = useCrypto()
  const { mode } = useDarkMode()
  const { prices } = usePriceFeed()
  const { traderInfo } = useTraderConfig()
  const marketData = useMemo(() => prices[selectedCrypto.pair], [prices, selectedCrypto])
  //NEED TO USE THIS

  const perpsHistory = useMemo(() => {
    return traderInfo.tradeHistory.map((item) => {
      return {
        price: Number(item.price),
        size: Number(item.quantity),
        side: item.side === 'buy' ? 'Long' : 'Short'
      }
    })
  }, [traderInfo.tradeHistory])

  const historyData = useMemo(
    () => (selectedCrypto.type === 'crypto' ? tradeHistoryNew : perpsHistory),
    [selectedCrypto, tradeHistoryNew]
  )

  return (
    <>
      {!historyData || !historyData.length ? (
        <div className="no-positions-found">
          <img src={`/img/assets/NoPositionsFound_${mode}.svg`} alt="no-positions-found" />
          <div>No Trade History</div>
        </div>
      ) : (
        <TRADE_HISTORY>
          {historyData &&
            historyData.length > 0 &&
            historyData.map((order, index) => (
              <div key={index}>
                <span className={order.side}>{selectedCrypto.type === 'perps' ? order.side : null}</span>
                <span>{order.size}</span>
                <span>${order.price}</span>
                <span>{(order.size * order.price).toFixed(2)}</span>
              </div>
            ))}
        </TRADE_HISTORY>
      )}
    </>
  )
}

export const HistoryPanel: FC = () => {
  const [activeTab, setActiveTab] = useState(0)
  const [closePositionModal, setClosePositionModal] = useState<boolean>(false)
  const [perpsEndModal, setPerpsEndModal] = useState<boolean>(false)
  const [summaryData, setSummaryData] = useState<{
    profit: boolean
    entryPrice: string
    exitPrice: string
    leverage: string
    pnl: string
    percentageChange: string
  }>({
    profit: true,
    entryPrice: '',
    exitPrice: '',
    leverage: '',
    pnl: '',
    percentageChange: ''
  })
  const { getAskSymbolFromPair, getBidSymbolFromPair, selectedCrypto, isSpot } = useCrypto()
  const { openOrders } = useTradeHistory()
  const { getTokenInfoFromSymbol } = useTokenRegistry()
  const { getUIAmount } = useAccounts()
  const { perpsOpenOrders, orderBook } = useOrderBook()
  const { mode } = useDarkMode()
  const { traderInfo } = useTraderConfig()
  const perpsPrice = useMemo(() => getPerpsPrice(orderBook), [orderBook])
  const notionalSize = useMemo(
    () => (Number(traderInfo.averagePosition.quantity) * perpsPrice).toFixed(3),
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

  const handleClosePosition = () => {
    setClosePositionModal(true)
  }

  const addNumbers = (arg1, arg2, arg3) => {
    let sum = 0
    arg1 && (sum += arg1)
    arg2 && (sum += arg2)
    arg3 && (sum += arg3)
    if (sum > 0) return sum.toFixed(2)
    return sum
  }

  const pnl = useMemo(() => {
    if (!Number(traderInfo.pnl)) return 0
    return Number(traderInfo.pnl)
  }, [traderInfo])

  const { market } = selectedCrypto
  let openOrder, baseAvailable, baseBalance, quoteAvailable, quoteBalance
  if (openOrders.length > 0) {
    openOrder = openOrders[0]
    baseAvailable = market?.baseSplSizeToNumber(openOrder.baseTokenFree)
    baseBalance = market?.baseSplSizeToNumber(openOrder.baseTokenTotal.sub(openOrder.baseTokenFree))
    quoteAvailable = market?.quoteSplSizeToNumber(openOrder.quoteTokenFree)
    quoteBalance = market?.quoteSplSizeToNumber(openOrder.quoteTokenTotal.sub(openOrder.quoteTokenFree))
  }

  const roundedSize = useMemo(() => {
    const size = Number(traderInfo.averagePosition.quantity)
    if (size) {
      return size.toFixed(3)
    } else return 0
  }, [traderInfo])

  return (
    <>
      <WRAPPER>
        <HEADER>
          {closePositionModal && (
            <>
              <SETTING_MODAL
                visible={true}
                centered={true}
                footer={null}
                title={
                  <div tw="flex items-center">
                    <span tw="font-semibold text-black-4 text-lg dark:text-grey-5">Close Position</span>
                    {/*<img
                      src="/img/assets/refresh.svg"
                      alt="refresh-icon"
                      tw="ml-auto ml-auto h-10 w-10 cursor-pointer mr-10"
                    />*/}
                  </div>
                }
                closeIcon={
                  <img
                    src={`/img/assets/close-${mode === 'lite' ? 'gray' : 'white'}-icon.svg`}
                    height="20px"
                    width="20px"
                    onClick={() => setClosePositionModal(false)}
                  />
                }
                className={mode === 'dark' ? 'dark' : ''}
              >
                <ClosePosition
                  setVisibleState={setClosePositionModal}
                  setSummaryData={setSummaryData}
                  setPerpsEndModal={setPerpsEndModal}
                />
              </SETTING_MODAL>
            </>
          )}
          {perpsEndModal && (
            <>
              <END_MODAL
                visible={true}
                centered={true}
                footer={null}
                title={
                  <span tw="dark:text-grey-5 text-black-4 text-[25px] font-semibold mb-4.5">
                    {summaryData.profit ? 'Fortune Favours The Bold!' : 'Better Luck Next Time!'}
                  </span>
                }
                closeIcon={
                  <img
                    src={`/img/assets/close-${mode === 'lite' ? 'gray' : 'white'}-icon.svg`}
                    height="20px"
                    width="20px"
                    onClick={() => setPerpsEndModal(false)}
                  />
                }
                className={mode === 'dark' ? 'dark' : ''}
              >
                <PerpsEndModal
                  profit={summaryData.profit}
                  side={traderInfo.averagePosition.side === 'buy' ? 'buy' : 'sell'}
                  entryPrice={summaryData.entryPrice}
                  currentPrice={summaryData.exitPrice}
                  leverage={summaryData.leverage}
                  pnlAmount={summaryData.pnl}
                  percentageChange={summaryData.percentageChange}
                />
              </END_MODAL>
            </>
          )}
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
              {traderInfo.averagePosition.side && Number(roundedSize) ? (
                <div className="positions">
                  <span>{selectedCrypto.pair}</span>
                  <span className={traderInfo.averagePosition.side === 'buy' ? 'long' : 'short'}>
                    {traderInfo.averagePosition.side === 'buy' ? 'Long' : 'Short'}
                  </span>
                  <span>{traderInfo.averagePosition.price}</span>
                  <span>{roundedSize}</span>
                  <span>{perpsPrice}</span>
                  <span>{notionalSize}</span>
                  <span>{Number(traderInfo.liquidationPrice).toFixed(2)}</span>
                  <span className={pnl <= 0 ? 'short' : 'long'}>$ {pnl.toFixed(4)}</span>
                  <button onClick={handleClosePosition}>Close</button>
                  {/*<button onClick={() => setClosePosition(true)}>Close Position</button>*/}
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
        ) : activeTab === 2 ? (
          <TradeHistoryComponent />
        ) : activeTab === 3 ? (
          <SettlePanel />
        ) : null}
      </WRAPPER>
    </>
  )
}
