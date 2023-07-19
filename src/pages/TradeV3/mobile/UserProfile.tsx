/* eslint-disable */
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { FC, useMemo, useState } from 'react'
import { useCrypto, useDarkMode, useOrderBook, usePriceFeed } from '../../../context'
import { useTraderConfig } from '../../../context/trader_risk_group'
import { getPerpsPrice } from '../perps/utils'
import { CollateralPanelMobi } from './CollateralPanelMobi'
import { PopupCustom } from '../../NFTs/Popup/PopupCustom'
import { DepositWithdraw } from '../perps/DepositWithdraw'
import { ClosePosition } from '../ClosePosition'
import { RotatingLoader } from '../../../components/RotatingLoader'
import { PerpsEndModal } from '../PerpsEndModal'

const WRAPPER = styled.div`
  .no-positions-found {
    padding-top: 80px;
    text-align: center;
    > div {
      ${tw`mt-3.75 text-gray-2 text-tiny font-semibold`}
    }
  }
`

const SETTING_MODAL = styled(PopupCustom)`
  ${tw`!h-[415px] !w-11/12 rounded-half dark:bg-black-2 bg-grey-5`}

  .ant-modal-header {
    ${tw`rounded-t-half rounded-tl-half rounded-tr-half px-[25px] pt-4 pb-0 border-b-0`}
    background-color: ${({ theme }) => theme.bg25};
  }
  .ant-modal-content {
    ${tw`shadow-none`}

    .ant-modal-close {
      ${tw`top-[20px]`}
    }
  }
  .ant-modal-body {
    ${tw`py-0 px-[25px]`}
  }
`

const END_MODAL = styled(PopupCustom)`
  ${tw`!h-[384px] !w-[353px] rounded-bigger dark:bg-black-2 bg-grey-5`}

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

const POSITION_WRAPPER = styled.div`
  ${tw`border-[1.5px] border-solid dark:border-black-4 border-grey-4 my-0 mx-[2.5px]`}
  button {
    ${tw`h-[30px] w-[75px] bg-red-1 rounded-tiny text-tiny font-semibold border-none m-[5px] text-white mr-5`}
    outline: none;
  }
  .label {
    ${tw`text-tiny font-semibold dark:text-grey-2 text-grey-1`}
  }
  .value {
    ${tw`text-regular font-semibold dark:text-grey-5 text-black-4`}
  }
  .long {
    ${tw`text-green-3 text-regular font-semibold`}
  }
  .short {
    ${tw`text-red-1 text-regular font-semibold`}
  }
`

const TABS = styled.div`
  .header-wrapper {
    ${tw`flex flex-row h-10 w-[150%]`}
    -ms-overflow-style: none;
    scrollbar-width: none;
    .open-order-header {
      ${tw`flex flex-row`}
      .count {
        ${tw`flex flex-row items-center justify-center h-[18px] text-white w-[18px] font-semibold ml-2.5 rounded-circle text-tiny`}
        background-image: linear-gradient(96deg, #f7931a 1%, #ac1cc7 99%);
      }
    }
    > div {
      ${tw`h-full w-[34%]`}
    }
  }

  ::-webkit-scrollbar {
    display: none;
  }

  .tab {
    ${tw`border border-solid dark:border-black-4 border-grey-4`}
    border-top: none;
  }
  .active {
    ${tw`text-black-4 dark:text-grey-5 p-0.5`}
    background: linear-gradient(94deg, #f7931a 0%, #ac1cc7 100%);
  }
  .white-background {
    ${tw`h-full w-full dark:bg-black-2 bg-white`}
  }
  .activeTab {
    background-image: linear-gradient(to right, rgba(247, 147, 26, 0.4) 0%, rgba(172, 28, 199, 0.4) 100%);
    color: ${({ theme }) => theme.text32} !important;
  }
  .field {
    ${tw`dark:text-grey-2 text-grey-1 flex justify-center items-center text-tiny font-semibold h-full`}
  }
  ${tw`h-full w-full relative overflow-y-hidden border border-solid dark:border-black-4 border-grey-4`}
`

const OPEN_ORDER = styled.div`
  ${tw`m-2.5`}
  .label {
    ${tw`text-tiny font-semibold dark:text-grey-2 text-grey-1`}
  }
  .value {
    ${tw`text-regular font-semibold dark:text-grey-5 text-grey-1 mb-2.5`}
  }
  .wrapper {
    border-bottom: ${({ theme }) => '1.5px solid ' + theme.tokenBorder};
  }
  .Long {
    ${tw`text-green-3`}
  }
  .Short {
    ${tw`text-red-2`}
  }
`

const TRADE_HISTORY = styled.div`
  ${tw`m-2.5 mt-0`}
  .label {
    ${tw`text-tiny font-semibold dark:text-grey-2 text-grey-1`}
  }
  .value {
    ${tw`text-regular font-semibold dark:text-grey-5 text-grey-1 mb-2.5`}
  }
  .wrapper {
    ${tw`mt-2.5`}
    border-bottom: ${({ theme }) => '1.5px solid ' + theme.tokenBorder};
  }
  .Long {
    ${tw`text-green-3`}
  }
  .Short {
    ${tw`text-red-2`}
  }
`

const HEADER = styled.div`
  ${tw`flex items-center`}

  .cta {
    ${tw`rounded-bigger w-[120px] h-10 mr-[13px]`}

    .btn {
      ${tw`flex items-center justify-center text-regular font-semibold w-full h-full`}
      color: ${({ theme }) => theme.text37};
    }

    .gradient-bg {
      ${tw`h-full w-full rounded-bigger`}
      background-image: linear-gradient(to right, rgba(247, 147, 26, 0.4) 0%, rgba(172, 28, 199, 0.4) 100%);
    }
  }

  .background-container {
    ${tw`h-full w-full rounded-bigger`}
  }

  .active {
    ${tw`p-0.5 cursor-auto`}
    background: linear-gradient(113deg, #f7931a 0%, #dc1fff 132%);

    .btn {
      color: ${({ theme }) => theme.text32};
    }

    .white-background {
      ${tw`bg-white`}
    }
  }

  img {
    ${tw`ml-auto h-10 w-10 mr-[50px]`}
  }
`

const FIXED_BOTTOM = styled.div`
  ${tw`fixed bottom-0 left-0 w-full h-[75px] dark:bg-black-2 bg-white`}
  border-top: ${({ theme }) => '1.5px solid ' + theme.tokenBorder};

  .deposit-wrapper {
    ${tw`w-11/12 h-[45px] rounded-[36px] flex items-center justify-center p-0.5 mx-2.5 my-3.75`}
    background: linear-gradient(113deg, #f7931a 0%, #dc1fff 132%);

    .white-background {
      ${tw`h-full w-full rounded-[36px] dark:bg-black-2 bg-white`}
    }

    .deposit-btn {
      ${tw`w-full h-full rounded-[36px] flex items-center justify-center text-tiny font-semibold dark:text-grey-5 text-grey-1`}
      background: linear-gradient(94deg, rgba(247, 147, 26, 0.4) 0%, rgba(172, 28, 199, 0.4) 100%);
    }
  }
`

const OpenOrders: FC = () => {
  const { formatPair, isDevnet } = useCrypto()
  const { perpsOpenOrders } = useOrderBook()
  const { cancelOrder: perpsCancelOrder } = useTraderConfig()
  const { mode } = useDarkMode()
  const [removedOrderIds, setremoved] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const openOrderUI = isDevnet ? perpsOpenOrders : perpsOpenOrders

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
              <div key={index} className="wrapper">
                <div tw="mb-3.5 mt-2.5 flex">
                  <span tw="text-regular font-semibold dark:text-grey-5 text-black-4 mr-2.5">SOL/PERP</span>
                  <span tw="text-regular font-semibold" className={order.order.side}>
                    {order.order.side}
                  </span>
                  <button
                    tw="ml-auto mr-3.5 text-white font-semibold bg-red-2 rounded-tiny h-[30px] w-[88px] border-none"
                    onClick={() => {
                      cancelOrderFn(order.order.orderId)
                    }}
                  >
                    {loading ? <RotatingLoader text="" textSize={8} iconSize={16} /> : 'Cancel'}
                  </button>
                </div>
                <div tw="flex flex-row justify-between">
                  <div tw="flex flex-col">
                    <span className="label">Size</span>
                    <span className="value">{order.order.size}</span>
                  </div>
                  <div tw="flex flex-col">
                    <span className="label">Price </span>
                    <span className="value">${order.order.price}</span>
                  </div>
                  <div tw="flex flex-col">
                    <span className="label">USD Value</span>
                    <span className="value">{(order.order.size * order.order.price).toFixed(2)}</span>
                  </div>
                  <div tw="flex flex-col">
                    <span className="label">Condition</span>
                    <span className="value" tw="!text-green-3">
                      Open
                    </span>
                  </div>
                </div>
              </div>
            ) : null
          )}
      </OPEN_ORDER>
    ),
    [formatPair, perpsOpenOrders, isDevnet]
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
    () => (selectedCrypto.type === 'crypto' ? perpsHistory : perpsHistory),
    [selectedCrypto]
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
              <div key={index} className="wrapper">
                <div tw="mb-3.5">
                  <span tw="text-regular font-semibold dark:text-grey-5 text-black-4 mr-2.5">SOL/PERP</span>
                  <span tw="text-regular font-semibold " className={order.side}>
                    {selectedCrypto.type === 'perps' ? order.side : null}
                  </span>
                </div>
                <div tw="flex flex-row justify-between">
                  <div tw="flex flex-col">
                    <span className="label">Size</span>
                    <span className="value">{order.size}</span>
                  </div>
                  <div tw="flex flex-col">
                    <span className="label">Price </span>
                    <span className="value">${order.price}</span>
                  </div>
                  <div tw="flex flex-col">
                    <span className="label">USD Value</span>
                    <span className="value">{(order.size * order.price).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
        </TRADE_HISTORY>
      )}
    </>
  )
}

const Positions = () => {
  const [perpsEndModal, setPerpsEndModal] = useState<boolean>(false)
  const { traderInfo } = useTraderConfig()
  const roundedSize = useMemo(() => {
    const size = Number(traderInfo.averagePosition.quantity)
    if (size) {
      return size.toFixed(3)
    } else return 0
  }, [traderInfo])
  const { mode } = useDarkMode()
  const { perpsOpenOrders, orderBook } = useOrderBook()
  const pnl = useMemo(() => {
    if (!Number(traderInfo.pnl)) return 0
    return Number(traderInfo.pnl)
  }, [traderInfo])
  const perpsPrice = useMemo(() => getPerpsPrice(orderBook), [orderBook])
  const [closePositionModal, setClosePositionModal] = useState<boolean>(false)
  const notionalSize = useMemo(
    () => (Number(traderInfo.averagePosition.quantity) * perpsPrice).toFixed(3),
    [perpsPrice, traderInfo.averagePosition.quantity]
  )
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

  return traderInfo.averagePosition.side && Number(roundedSize) ? (
    <POSITION_WRAPPER>
      {closePositionModal && (
        <>
          <SETTING_MODAL
            visible={true}
            centered={true}
            footer={null}
            title={
              <div tw="flex items-center">
                <span tw="font-semibold text-black-4 text-lg dark:text-grey-5">Close Position</span>
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
          >
            <ClosePosition
              setVisibleState={setClosePositionModal}
              setPerpsEndModal={setPerpsEndModal}
              setSummaryData={setSummaryData}
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
              <span tw="dark:text-grey-5 text-black-4 text-[25px] font-semibold mb-4.5 sm:text-lg">
                {summaryData.profit ? 'Fortune Favours The Bold!' : 'Better Luck Next Time!'}
              </span>
            }
            closeIcon={
              <img
                src={`/img/assets/close-${mode === 'lite' ? 'gray' : 'white'}-icon.svg`}
                height="15px"
                width="15px"
                onClick={() => setPerpsEndModal(false)}
              />
            }
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
      <div tw="flex flex-row justify-between items-center mb-2">
        <div>
          <span tw="mr-2 font-semibold text-regular dark:text-grey-5 text-grey-1">SOL/USDC</span>
          <span
            tw="font-semibold text-regular"
            className={traderInfo.averagePosition.side === 'buy' ? 'long' : 'short'}
          >
            {traderInfo.averagePosition.side === 'buy' ? 'Long' : 'Short'}
          </span>
        </div>
        <button
          onClick={() => {
            setClosePositionModal(true)
          }}
        >
          Close
        </button>
      </div>
      <div tw="flex flex-row mb-3">
        <div tw="flex flex-col w-1/3">
          <span className="label">Entry Price</span>
          <span className="value">{traderInfo.averagePosition.price}</span>
        </div>
        <div tw="flex flex-col w-1/3">
          <span className="label">Quantity</span>
          <span className="value">{roundedSize}</span>
        </div>
        <div tw="flex flex-col w-1/3">
          <span className="label">Market Price</span>
          <span className="value">{perpsPrice}</span>
        </div>
      </div>
      <div tw="flex flex-row mb-3">
        <div tw="flex flex-col w-1/3">
          <span className="label">Value</span>
          <span className="value">{notionalSize}</span>
        </div>
        <div tw="flex flex-col w-1/3">
          <span className="label">Est. Liq Price</span>
          <span className="value">{Number(traderInfo.liquidationPrice).toFixed(2)}</span>
        </div>
        <div tw="flex flex-col w-1/3">
          <span className="label">PNL</span>
          <span className={pnl <= 0 ? 'short' : 'long'}>{pnl.toFixed(4)}</span>
        </div>
      </div>
    </POSITION_WRAPPER>
  ) : (
    <div className="no-positions-found">
      <img src={`/img/assets/NoPositionsFound_${mode}.svg`} alt="no-positions-found" />
      <div>No Positions Found</div>
    </div>
  )
}

const ModalHeader: FC<{ setTradeType: (tradeType: string) => void; tradeType: string }> = ({
  setTradeType,
  tradeType
}) => {
  const { mode } = useDarkMode()
  return (
    <HEADER>
      <div className={tradeType === 'deposit' ? 'active cta' : 'cta'} onClick={() => setTradeType('deposit')}>
        <div className={mode !== 'dark' ? 'white-background background-container' : 'background-container'}>
          <div className={tradeType === 'deposit' ? 'gradient-bg btn' : 'btn'}>Deposit</div>
        </div>
      </div>
      <div className={tradeType === 'withdraw' ? 'active cta' : 'cta'} onClick={() => setTradeType('withdraw')}>
        <div className={mode !== 'dark' ? 'white-background background-container' : 'background-container'}>
          <div className={tradeType === 'withdraw' ? 'gradient-bg btn' : 'btn'}>Withdraw</div>
        </div>
      </div>
    </HEADER>
  )
}

export const UserProfile = ({ setUserProfile }) => {
  const tabs = ['Positions', 'Open Orders', 'Trade History', 'Sol Unsettled']
  const { isDevnet } = useCrypto()
  const { perpsOpenOrders, orderBook } = useOrderBook()
  const [activeTab, setActiveTab] = useState(0)
  const [depositWithdrawModal, setDepositWithdrawModal] = useState<boolean>(false)
  const [tradeType, setTradeType] = useState<string>('deposit')
  const { mode } = useDarkMode()

  return (
    <WRAPPER>
      {depositWithdrawModal && (
        <SETTING_MODAL
          visible={true}
          centered={true}
          footer={null}
          title={<ModalHeader setTradeType={setTradeType} tradeType={tradeType} />}
          closeIcon={
            <img
              src={`/img/assets/close-${mode === 'lite' ? 'gray' : 'white'}-icon.svg`}
              height="20px"
              width="20px"
              onClick={() => setDepositWithdrawModal(false)}
            />
          }
        >
          <DepositWithdraw tradeType={tradeType} setDepositWithdrawModal={setDepositWithdrawModal} />
        </SETTING_MODAL>
      )}
      {!isDevnet ? (
        <CollateralPanelMobi setUserProfile={setUserProfile} />
      ) : (
        <div>
          <img
            src={`/img/assets/close-gray-icon.svg`}
            alt="close-icon"
            tw="absolute top-5 right-5 z-10"
            height="18px"
            width="18px"
            onClick={() => setUserProfile(false)}
          />
          <div tw="flex flex-row items-center justify-around mt-8 mb-7">
            <img src="/img/assets/perpsInfo.svg" alt="perps-info" />
            <div tw="text-regular font-medium dark:text-grey-2 text-grey-1">
              See your account details <br /> exclusively on Perps.
            </div>
          </div>
        </div>
      )}
      <TABS>
        <div className="header-wrapper">
          {tabs.map((item, index) => (
            <div
              key={index}
              className={index === activeTab ? 'active tab' : 'tab'}
              onClick={() => setActiveTab(index)}
            >
              <div className="white-background">
                <div className={index === activeTab ? 'field activeTab' : 'field'}>
                  {index === 1 ? (
                    <div className="open-order-header">
                      <div>{item}</div>
                      {!isDevnet && (
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
      </TABS>
      {activeTab === 0 ? (
        <Positions />
      ) : activeTab === 1 ? (
        <OpenOrders />
      ) : activeTab === 2 ? (
        <TradeHistoryComponent />
      ) : activeTab === 3 ? (
        <></>
      ) : null}
      {!isDevnet && (
        <FIXED_BOTTOM>
          <div className="deposit-wrapper" onClick={() => setDepositWithdrawModal(true)}>
            <div className="white-background">
              <div className="deposit-btn">Deposit/Withdraw</div>
            </div>
          </div>
        </FIXED_BOTTOM>
      )}
    </WRAPPER>
  )
}
