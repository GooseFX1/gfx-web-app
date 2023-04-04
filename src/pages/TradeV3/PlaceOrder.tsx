/* eslint-disable */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Dispatch, FC, SetStateAction, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import {
  AVAILABLE_ORDERS,
  OrderType,
  OrderSide,
  OrderDisplayType,
  useAccounts,
  useCrypto,
  useOrder,
  useOrderBook,
  useDarkMode,
  useTokenRegistry
} from '../../context'
import { Input } from 'antd'
import { removeFloatingPointError } from '../../utils'
import { Checkbox, Slider } from 'antd'
import { useWallet } from '@solana/wallet-adapter-react'
import { ArrowDropdown, Tooltip } from '../../components'
import { useTraderConfig } from '../../context/trader_risk_group'
import { displayFractional, getPerpsPrice } from './perps/utils'
import { PopupCustom } from '../NFTs/Popup/PopupCustom'
import { TradeConfirmation } from './TradeConfirmation'
import 'styled-components/macro'
import { RotatingLoader } from '../../components/RotatingLoader'
import { Picker } from './Picker'
import useBlacklisted from '../../utils/useBlacklisted'
import useWindowSize from '../../utils/useWindowSize'

enum ButtonState {
  Connect = 0,
  CanPlaceOrder = 1,
  NullAmount = 2,
  BalanceExceeded = 3,
  CreateAccount = 4,
  isGeoBlocked = 5,
  OrderTooSmall = 6
}

const WRAPPER = styled.div`
  ${tw`h-full w-full overflow-y-hidden`}
  border: ${({ theme }) => '1px solid ' + theme.tokenBorder};
  background: ${({ theme }) => theme.bg2};
`

const HEADER = styled.div`
  ${tw`h-16 w-full flex flex-col items-center`}
  background: ${({ theme }) => theme.bg2};

  .pairInfo {
    ${tw`h-1/2 w-full flex justify-between px-2.5 border-b items-center text-base font-semibold`}
    border-top:none;
    border-left: none;
    border-right: none;
    border-color: #3c3c3c;
    .pairName {
      color: ${({ theme }) => theme.text32};
      img {
        ${tw`h-5 w-5 mr-2.5 mt-[-2px]`}
      }
    }
    .pairLeverage {
      ${tw`rounded-[5px] border-solid border border-[#b5b5b5] flex items-center justify-center h-5.5 text-[13px] w-16`}
      border-color: ${({ theme }) => theme.multiplierBorder};
      color: ${({ theme }) => theme.text21};
    }
  }
  .orderSide {
    ${tw`h-1/2 w-full flex justify-between text-xs items-center`}
    .gradientBorder {
      ${tw`w-1/2 font-semibold text-center h-full flex items-center justify-center cursor-pointer`}
      border:none;
      color: #636363;
      background-color: #3c3c3c;
      &.selected {
        background: linear-gradient(94deg, #f7931a 0%, #ac1cc7 100%);
        padding: 2px;
        color: ${({ theme }) => theme.text1};
      }
      .holder {
        background: ${({ theme }) => theme.bg20};
        height: 100%;
        width: 100%;
      }
      .overlayBorder {
        height: 100%;
        width: 100%;
        background: ${({ theme }) => theme.bg2};
        ${tw`flex justify-center items-center`}
      }
      .active {
        background: linear-gradient(94deg, rgba(247, 147, 26, 0.4) 0%, rgba(172, 28, 199, 0.4) 100%);
      }
      .inactive {
        border: 1px solid ${({ theme }) => theme.tokenBorder};
      }
    }
  }
`

const BODY = styled.div`
  ${tw`text-center`}
  height: calc(100% - 65px);
`

const INPUT_GRID_WRAPPER = styled.div`
  ${tw`flex justify-center items-center flex-col py-[2px]`}
  .inputRow {
    ${tw`flex justify-between items-center w-full h-16 mt-[-4px]`}
  }
`

const INPUT_WRAPPER = styled.div`
  ${tw`flex justify-center items-start w-full flex-col h-full px-3`}
  .label {
    ${tw`pb-1 text-tiny font-semibold`}
    color: ${({ theme }) => theme.text37};
  }
  img {
    height: 20px;
    width: 20px;
  }
  .suffixText {
    ${tw`text-tiny font-semibold`}
    color: ${({ theme }) => theme.text37};
  }
  .ant-input {
    ${tw`text-left font-medium`}
    color: ${({ theme }) => theme.text1};
  }
  .ant-input::placeholder {
    ${tw`text-tiny font-semibold`}
    color: ${({ theme }) => theme.text20};
  }
  .ant-input-affix-wrapper {
    ${tw`font-medium rounded-[5px] border border-solid h-[30px]`}
    background: ${({ theme }) => theme.bg2};
    border-color: ${({ theme }) => theme.tokenBorder};
  }
  .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover {
    border-color: ${({ theme }) => theme.tokenBorder};
  }
  .ant-input-affix-wrapper:focus,
  .ant-input-affix-wrapper-focused {
    box-shadow: none;
  }
  .dropdownContainer {
    ${tw`w-full h-[30px] flex justify-between items-center px-2 text-red-100 
    font-semibold text-tiny border border-solid rounded-[5px] cursor-pointer`}
    color: ${({ theme }) => theme.text21};
    border-color: ${({ theme }) => theme.tokenBorder};
    background: ${({ theme }) => theme.bg2};
  }
  .dropdownContainer.lite {
    .arrow-icon {
      filter: invert(28%) sepia(88%) saturate(1781%) hue-rotate(230deg) brightness(99%) contrast(105%);
    }
  }
  .focus-border {
    background: linear-gradient(94deg, #f7931a 0%, #ac1cc7 100%);
    border-radius: 5px;
    padding: 1px;
  }
  .stop-loss {
    cursor: not-allowed;
  }
`

const TOTAL_SELECTOR = styled.div`
  ${tw`flex mt-[3px] justify-between items-center px-3`}
  .valueSelector {
    ${tw`cursor-pointer flex justify-center items-center rounded-[36px] w-14 h-[30px] text-tiny 
    dark:text-[#B5B5B5] text-[#636363] font-semibold`}
    background: ${({ theme }) => theme.bg23};
    &.selected {
      background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
      color: ${({ theme }) => theme.text0};
    }
  }
`

const LEVERAGE_WRAPPER = styled.div`
  ${tw`pl-2 w-11/12 text-left mt-[-8px]`}
  .ant-slider-rail {
    ${tw`h-[6px] dark:bg-[#262626] bg-grey-1`}
  }
  .ant-slider-with-marks {
    ${tw`mb-2 my-[5px]`}
  }
  .ant-slider-step {
    .ant-slider-dot {
      margin-left: 0px !important;
      height: 9px !important;
      width: 9px !important;
    }
    .ant-slider-dot-active {
      display: none;
    }
  }
  .ant-slider-mark {
    .ant-slider-mark-text {
      margin-left: 0px;
      margin-top: 4px;
      margin-bottom: 4px;
    }
    .markSpan {
      ${tw`dark:text-[#B5B5B5] text-[#636363] text-tiny`}
      margin-left: 0px;
    }
  }
  .leverageText {
    ${tw`text-regular dark:text-[#B5B5B5] text-[#636363] pl-2 font-semibold mt-[5%]`}
  }
  .smallScreenLeverageText {
    ${tw`dark:text-[#B5B5B5] text-[#636363] pl-2 font-semibold`}
  }

  .leverageBar {
    ${tw`mt-[-5px] mb-[30px]`}
  }
  .smallScreenLeverageBar {
    ${tw`!mb-5`}
  }
`

const ORDER_CATEGORY = styled.div`
  ${tw`flex justify-center items-center mt-3.75 h-5`}
  .orderCategoryCheckboxWrapper {
    ${tw`mx-3 flex items-center justify-center`}
    .ant-checkbox-wrapper {
      .ant-checkbox-inner {
        ${tw`w-5 h-5 rounded`}
      }
    }
    .ant-checkbox-checked .ant-checkbox-inner {
      ${tw`bg-[#5855ff]`}
    }
    .orderCategoryName {
      ${tw`text-tiny font-semibold ml-1 dark:text-[#B5B5B5] text-[#636363]`}
    }
  }
`

const PLACE_ORDER_BUTTON = styled.button<{ $action: boolean; $orderSide: string; $isSpot: boolean }>`
  ${tw`mt-3 rounded-[30px] h-[30px] text-tiny font-semibold border-0 border-none`}
  background: ${({ $action, $orderSide, theme }) =>
    $action ? ($orderSide === 'buy' ? '#71C25D' : '#F06565') : theme.bg23};
  color: ${({ $action }) => ($action ? 'white' : '#636363')};
  width: ${({ $isSpot }) => ($isSpot ? '90%' : '55%')};
`

const FEES = styled.div`
  ${tw`flex items-center justify-center my-2`}

  div {
    margin-left: 0;
    margin-right: 5px;
    img {
      height: 14px !important;
      width: 14px !important;
      margin-left: 0 !important;
    }
  }

  span {
    ${tw`font-semibold text-tiny text-gray-2 ml-[5px]`}
  }
`

const SETTING_MODAL = styled(PopupCustom)`
  ${tw`!h-[536px] !w-[500px] rounded-bigger`}
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

const TITLE = styled.span`
  font-size: 25px;
  font-weight: 600;
  background-image: -webkit-linear-gradient(0deg, #f7931a 0%, #ac1cc7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 30px;
  margin-left: 8px;
`

const TOTAL_VALUES = [
  {
    display: '0%',
    value: 0,
    key: 0
  },
  {
    display: '25%',
    value: 0.25,
    key: 1
  },
  {
    display: '50%',
    value: 0.5,
    key: 2
  },
  {
    display: '75%',
    value: 0.75,
    key: 3
  },
  {
    display: '100%',
    value: 0.9999,
    key: 4
  }
]

const ORDER_CATEGORY_TYPE = [
  {
    id: 'postOnly',
    display: 'Post'
  },
  {
    id: 'ioc',
    display: 'IOC'
  }
]

export const PlaceOrder: FC = () => {
  const { getUIAmount } = useAccounts()
  const { selectedCrypto, getSymbolFromPair, getAskSymbolFromPair, getBidSymbolFromPair, isSpot } = useCrypto()
  const { order, setOrder, focused, setFocused, placeOrder } = useOrder()
  const { traderInfo } = useTraderConfig()
  const { orderBook } = useOrderBook()
  const [selectedTotal, setSelectedTotal] = useState<number>(null)
  const [arrowRotation, setArrowRotation] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [takeProfit, setTakeProfit] = useState(false)
  const [takeProfitArrow, setTakeProfitArrow] = useState(false)
  const [stopLoss, setStopLoss] = useState(false)
  const [stopLossArrow, setStopLossArrow] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false)
  const { getTokenInfoFromSymbol } = useTokenRegistry()
  const { connected } = useWallet()
  const { mode } = useDarkMode()
  const { height } = useWindowSize()
  const [loading, setLoading] = useState<boolean>(false)
  const geoBlocked = false

  const symbol = useMemo(
    () => getAskSymbolFromPair(selectedCrypto.pair),
    [getAskSymbolFromPair, selectedCrypto.pair]
  )
  const bid = useMemo(() => getBidSymbolFromPair(selectedCrypto.pair), [getBidSymbolFromPair, selectedCrypto.pair])

  const tokenInfo = useMemo(
    () => getTokenInfoFromSymbol(getSymbolFromPair(selectedCrypto.pair, order.side)),
    [getSymbolFromPair, getTokenInfoFromSymbol, order.side, selectedCrypto.pair]
  )
  const userBalance = useMemo(() => (tokenInfo ? getUIAmount(tokenInfo.address) : 0), [tokenInfo, getUIAmount])

  const perpsBidBalance: number = useMemo(() => {
    if (!traderInfo || !traderInfo.balances || !traderInfo.traderRiskGroup) return 0
    const balanceBid = Number(traderInfo.marginAvailable)
    return balanceBid
  }, [traderInfo])

  const maxQtyNum: number = useMemo(() => {
    const maxQty = Number(traderInfo.maxQuantity)
    if (Number.isNaN(maxQty)) return 0
    return maxQty
  }, [traderInfo.maxQuantity, order.size])

  //  const perpsAskBalance: number = useMemo(() => {
  //    if (!traderInfo || !traderInfo.balances || !traderInfo.balances[0] || !traderInfo.traderRiskGroup) return 0
  //    const balanceAsk = Math.abs(Number(traderInfo.balances[0].balance))
  //    return balanceAsk
  //  }, [traderInfo])

  const buttonState = useMemo(() => {
    if (isSpot) {
      if (geoBlocked) return ButtonState.isGeoBlocked
      if (!connected) return ButtonState.Connect
      if (
        (order.side === 'buy' && order.total > userBalance) ||
        (order.side === 'sell' && order.size > userBalance)
      )
        return ButtonState.BalanceExceeded
      if (!order.price || !order.total || !order.size) return ButtonState.NullAmount
      return ButtonState.CanPlaceOrder
    } else {
      if (!connected) return ButtonState.Connect
      if (!traderInfo?.traderRiskGroupKey) return ButtonState.CreateAccount
      if (!order.price || !order.total || !order.size) return ButtonState.NullAmount
      if (order.size > maxQtyNum) return ButtonState.BalanceExceeded
      if (order.size < 0.01) return ButtonState.OrderTooSmall
      //if (order.total > perpsBidBalance) return ButtonState.BalanceExceeded
      return ButtonState.CanPlaceOrder
    }
  }, [connected, selectedCrypto.pair, order, isSpot, traderInfo])

  const buttonText = useMemo(() => {
    if (buttonState === ButtonState.BalanceExceeded) return 'Insufficient Balance'
    else if (buttonState === ButtonState.Connect) return 'Connect Wallet'
    else if (buttonState === ButtonState.isGeoBlocked) return 'Georestricted'
    else if (buttonState === ButtonState.CreateAccount) return 'Create Account!'
    else if (buttonState === ButtonState.OrderTooSmall) return 'Minimum size 0.01'
    if (selectedCrypto.type === 'crypto') {
      if (order.side === 'buy') return 'BUY ' + symbol
      else return 'SELL ' + symbol
    } else {
      if (order.side === 'buy') return 'LONG ' + symbol
      else return 'SHORT ' + symbol
    }
  }, [buttonState, order.side, selectedCrypto.type])

  const displayedOrder = useMemo(
    () => AVAILABLE_ORDERS.find(({ display, side }) => display === order.display && side === order.side),
    [order.display, order.side]
  )

  const handleOrderSide = (side) => {
    if (side !== order.side) {
      setOrder((prevState) => ({ ...prevState, side }))
      setSelectedTotal(null)
    }
  }

  const numberCheck = (input: string, source: string) => {
    if (!isNaN(+input)) {
      setSelectedTotal(null)
      switch (source) {
        case 'size':
          setOrder((prev) => ({ ...prev, size: input }))
          break
        case 'total':
          setOrder((prev) => ({ ...prev, total: input }))
          break
        case 'price':
          setOrder((prev) => ({ ...prev, price: input }))
          break
      }
    }
  }

  const handleClick = (value: number) => {
    if (isSpot) {
      const finalValue = removeFloatingPointError(value * userBalance)
      if (finalValue) {
        setSelectedTotal(value)
        if (order.side === 'buy') {
          setFocused('total')
          setOrder((prev) => ({ ...prev, total: finalValue }))
        } else {
          setFocused('size')
          setOrder((prev) => ({ ...prev, size: finalValue }))
        }
      } else if (!finalValue && value === 0) {
        setSelectedTotal(value)
        setFocused('total')
        setOrder((prev) => ({ ...prev, total: 0 }))
      }
    } else {
      const price = order.price ?? getPerpsPrice(orderBook)

      const finalValue = removeFloatingPointError(value * +perpsBidBalance)
      if (finalValue) {
        setSelectedTotal(value)

        setFocused('total')
        setOrder((prev) => ({ ...prev, price, total: finalValue }))
      } else if (!finalValue && value === 0) {
        setSelectedTotal(value)
        setFocused('total')
        setOrder((prev) => ({ ...prev, price, total: 0 }))
      }
    }
  }

  const handleDropdownClick = () => {
    setArrowRotation(!arrowRotation)
    setDropdownVisible(!dropdownVisible)
  }

  const takeProfitClick = (e) => {
    setTakeProfitArrow(!takeProfitArrow)
    setTakeProfit(!takeProfit)
  }

  const letSee = (e) => {
    setTakeProfit(true)
  }

  const stopLossClick = () => {
    setStopLossArrow(!stopLossArrow)
    setStopLoss(!stopLoss)
  }

  const handlePlaceOrder = async () => {
    if (buttonState === ButtonState.CanPlaceOrder) {
      setLoading(true)
      setConfirmationModal(true)
      //await newOrder()
      setLoading(false)
    }
  }

  const handleSliderChange = async (e) => {
    if (!order.price || order.price === '0') {
      setFocused('price')
      setOrder((prev) => ({ ...prev, price: traderInfo.onChainPrice }))
    }
    let newE = e
    //if (e > 9.7) newE = e * 0.97
    //if (Number(order.price) <= Number(traderInfo.onChainPrice)) {
    const initLeverage = Number(traderInfo.currentLeverage)

    let newLev = newE - initLeverage
    if (newLev < 0) return
    setFocused('size')
    const availLeverage = Number(traderInfo.availableLeverage)
    const maxQty = Number(traderInfo.maxQuantity)
    const percentage2 = (newLev / availLeverage) * maxQty
    if (newLev > availLeverage) return
    if (percentage2 > 1) setOrder((prev) => ({ ...prev, size: Math.floor(percentage2) }))
    else setOrder((prev) => ({ ...prev, size: percentage2 }))
    //} else {
    //  const initLeverage = Number(traderInfo.currentLeverage)
    //  let newLev = newE - initLeverage
    //  if (newLev < 0) return
    //  setFocused('total')
    //  const availLeverage = Number(traderInfo.availableLeverage)
    //  const maxMargin = Number(traderInfo.marginAvailable)
    //  if (newLev > availLeverage) {
    //    newLev = availLeverage
    //  }
    //  const percentage2 = (newLev / availLeverage) * maxMargin
    //  setOrder((prev) => ({ ...prev, total: percentage2.toFixed(2) }))
    //}
  }

  const getMarks = () => {
    const markObj = {}
    for (let i = 2; i <= 10; i = i + 2) {
      markObj[i] = <span className="markSpan">{i + 'x'}</span>
    }
    return markObj
  }

  //  const sliderValue = useMemo(() => {
  //    const initLeverage = Number(traderInfo.currentLeverage)
  //    const availLeverage = Number(traderInfo.availableLeverage)
  //    const availMargin = Number(traderInfo.marginAvailable)
  //    let percentage = 0
  //    if (Number(order.size) >= Number(traderInfo.maxQuantity)) percentage = availLeverage
  //    else if (order.total < availMargin) percentage = (Number(order.total) / Number(availMargin)) * availLeverage
  //    else percentage = availLeverage
  //    //else percentage = (Number(order.size) / Number(traderInfo.maxQuantity)) * availLeverage
  //    if (Number(percentage)) return Number((initLeverage + percentage).toFixed(2))
  //    return Number(initLeverage.toFixed(2))
  //  }, [order.size, traderInfo, order.total])

  const sliderValue = useMemo(() => {
    const initLeverage = Number(traderInfo.currentLeverage)
    const availLeverage = Number(traderInfo.availableLeverage)
    const qty = maxQtyNum
    //const availMargin = Number(traderInfo.marginAvailable)
    let percentage = 0
    percentage = (Number(order.size) / qty) * availLeverage
    //else if (order.total < availMargin) percentage = (Number(order.total) / Number(availMargin)) * availLeverage
    return Number((initLeverage + percentage).toFixed(2))
    //return Number(initLeverage.toFixed(2))
  }, [maxQtyNum, order.size])

  const displayPair = useMemo(() => {
    return selectedCrypto.display
  }, [selectedCrypto.pair, selectedCrypto.type])

  return (
    <WRAPPER>
      <HEADER>
        {confirmationModal && (
          <>
            <SETTING_MODAL
              visible={true}
              centered={true}
              footer={null}
              title={
                <>
                  <span tw="dark:text-grey-5 text-black-4 text-[25px] font-semibold">
                    {order.display === 'limit' ? 'Limit ' : 'Market '}
                    {order.side === 'buy' ? 'Long' : 'Short'}
                  </span>
                  <TITLE>SOL-PERP</TITLE>
                </>
              }
              closeIcon={
                <img
                  src={`/img/assets/close-${mode === 'lite' ? 'gray' : 'white'}-icon.svg`}
                  height="20px"
                  width="20px"
                  onClick={() => setConfirmationModal(false)}
                />
              }
              className={mode === 'dark' ? 'dark' : ''}
            >
              <TradeConfirmation setVisibility={setConfirmationModal} />
            </SETTING_MODAL>
          </>
        )}
        <div className="pairInfo">
          <div className="pairName">
            <img src={`/img/crypto/${symbol}.svg`} alt="" />
            {displayPair}
          </div>
          {selectedCrypto.type !== 'crypto' ? <div className="pairLeverage">10x</div> : null}
        </div>
        <div className="orderSide">
          <div
            className={order.side === 'buy' ? 'selected gradientBorder' : 'gradientBorder'}
            onClick={() => handleOrderSide('buy')}
          >
            <div className="holder">
              <div className={order.side === 'buy' ? 'active overlayBorder buy' : 'inactive overlayBorder buy'}>
                {'Buy'}
              </div>
            </div>
          </div>
          <div
            className={order.side === 'sell' ? 'selected gradientBorder' : 'gradientBorder'}
            onClick={() => handleOrderSide('sell')}
          >
            <div className="holder">
              <div className={order.side === 'sell' ? 'active overlayBorder sell' : 'inactive overlayBorder sell'}>
                {'Sell'}
              </div>
            </div>
          </div>
        </div>
      </HEADER>
      <BODY>
        <INPUT_GRID_WRAPPER>
          <div className="inputRow">
            <INPUT_WRAPPER>
              <div className="label">Order Type</div>
              <div className={`dropdownContainer ${mode}`} onClick={handleDropdownClick}>
                <div>{displayedOrder?.text}</div>
                <ArrowDropdown
                  arrowRotation={arrowRotation}
                  offset={[-125, 15]}
                  onVisibleChange={() => {
                    setDropdownVisible(true)
                  }}
                  placement="bottomLeft"
                  overlay={
                    <Overlay
                      setArrowRotation={setArrowRotation}
                      setDropdownVisible={setDropdownVisible}
                      side={order.side}
                    />
                  }
                  visible={dropdownVisible}
                  measurements="13px !important"
                />
              </div>
            </INPUT_WRAPPER>
            <INPUT_WRAPPER>
              <div className="label">Price</div>
              <div className={focused === 'price' ? 'focus-border' : ''}>
                <Input
                  suffix={<span className="suffixText">{bid}</span>}
                  onFocus={() => setFocused('price')}
                  maxLength={15}
                  onBlur={() => setFocused(undefined)}
                  value={order.price ? order.price : ''}
                  onChange={(e) => numberCheck(e.target.value, 'price')}
                  placeholder={'0.00'}
                  disabled={order.display === 'market'}
                  style={order.display === 'market' ? { border: '1px solid #f06565' } : null}
                />
              </div>
            </INPUT_WRAPPER>
          </div>
          <div className="inputRow">
            <INPUT_WRAPPER>
              <div className="label">Size</div>
              <div className={focused === 'size' ? 'focus-border' : ''}>
                <Input
                  suffix={
                    <>
                      <img src={`/img/crypto/${symbol}.svg`} alt="" />
                      <span className="suffixText">{symbol}</span>
                    </>
                  }
                  placeholder={'0.00'}
                  onFocus={() => setFocused('size')}
                  maxLength={15}
                  onBlur={() => setFocused(undefined)}
                  value={order.size ? order.size : ''}
                  onChange={(e) => numberCheck(e.target.value, 'size')}
                />
              </div>
            </INPUT_WRAPPER>
            <INPUT_WRAPPER>
              <div className="label">Amount</div>
              <div className={focused === 'total' ? 'focus-border' : ''}>
                <Input
                  suffix={<span className="suffixText">{bid}</span>}
                  onFocus={() => setFocused('total')}
                  maxLength={15}
                  onBlur={() => setFocused(undefined)}
                  value={order.total ? order.total : ''}
                  onChange={(e) => numberCheck(e.target.value, 'total')}
                  placeholder={'0.00'}
                />
              </div>
            </INPUT_WRAPPER>
          </div>
        </INPUT_GRID_WRAPPER>
        {isSpot ? (
          <TOTAL_SELECTOR>
            {TOTAL_VALUES.map((item) => (
              <div
                key={item.key}
                className={'valueSelector ' + (item.value === selectedTotal ? 'selected' : '')}
                onClick={() => handleClick(item.value)}
              >
                {item.display}
              </div>
            ))}
          </TOTAL_SELECTOR>
        ) : (
          <LEVERAGE_WRAPPER>
            <div className={height > 790 ? 'leverageText' : 'smallScreenLeverageText'}>Leverage</div>
            <div className={height > 790 ? 'leverageBar' : 'smallScreenLeverageBar'}>
              <Picker>
                <Slider
                  max={10}
                  //min={minLeverage}
                  onChange={(e) => handleSliderChange(e)}
                  step={0.01}
                  value={sliderValue}
                  trackStyle={{
                    height: '6px'
                  }}
                  handleStyle={{
                    height: '20px',
                    width: '20px',
                    background: 'white',
                    border: '2px solid #FFFFFF',
                    position: 'relative',
                    bottom: '2px'
                  }}
                  marks={getMarks()}
                  //  marks={{
                  //    0: '0°C',
                  //    26: '26°C',
                  //    37: {
                  //      style: {
                  //        color: '#f50',
                  //        paddingTop: '8px',
                  //        fontSize: '13px',
                  //        fontWeight: '600'
                  //      },
                  //      label: <strong>5x</strong>
                  //    },
                  //    100: {
                  //      style: {
                  //        color: '#f50'
                  //      },
                  //      label: <strong>100°C</strong>
                  //    }
                  //  }}
                />
                {/*<span
            onClick={() => {
              setFocused('total')
              setOrder((prevState) => ({ ...prevState, total: userBalance }))
            }}
          >
            Use Max
          </span>*/}
              </Picker>
            </div>
          </LEVERAGE_WRAPPER>
        )}
        {isSpot ? (
          <>
            <ORDER_CATEGORY>
              {ORDER_CATEGORY_TYPE.map((item) => (
                <div key={item.id} className="orderCategoryCheckboxWrapper">
                  <Checkbox
                    checked={order.type === item.id}
                    onChange={(e) =>
                      e.target.checked
                        ? setOrder((prev) => ({ ...prev, type: item.id as OrderType }))
                        : setOrder((prev) => ({ ...prev, type: 'limit' }))
                    }
                  />
                  <div className="orderCategoryName">{item.display}</div>
                </div>
              ))}
            </ORDER_CATEGORY>
            <PLACE_ORDER_BUTTON
              $action={buttonState === ButtonState.CanPlaceOrder}
              onClick={() => (isSpot ? placeOrder() : handlePlaceOrder())}
              $orderSide={order.side}
              $isSpot={isSpot}
            >
              {loading ? <RotatingLoader text="Placing Order" textSize={12} iconSize={18} /> : buttonText}
            </PLACE_ORDER_BUTTON>
          </>
        ) : (
          <>
            <div tw="flex flex-row">
              <INPUT_WRAPPER>
                <div className="label">Take Profit</div>
                <div className={`dropdownContainer ${mode}`} onClick={takeProfitClick}>
                  <div>{displayedOrder?.text}</div>
                  <ArrowDropdown
                    arrowRotation={takeProfitArrow}
                    offset={[-125, 15]}
                    onVisibleChange={letSee}
                    placement="bottomLeft"
                    overlay={
                      <TakeProfitStopLoss
                        setArrowRotation={setTakeProfitArrow}
                        setDropdownVisible={setTakeProfit}
                        type={0}
                      />
                    }
                    visible={takeProfit}
                    measurements="11px !important"
                  />
                </div>
              </INPUT_WRAPPER>
              <INPUT_WRAPPER>
                <div className="label">Stop Loss</div>
                <div className={`dropdownContainer ${mode} stop-loss`} onClick={null}>
                  <div>{displayedOrder?.text}</div>
                  <ArrowDropdown
                    arrowRotation={stopLossArrow}
                    offset={[-125, 15]}
                    onVisibleChange={null}
                    placement="bottomLeft"
                    overlay={
                      <TakeProfitStopLoss
                        setArrowRotation={setStopLossArrow}
                        setDropdownVisible={setStopLoss}
                        type={1}
                      />
                    }
                    visible={stopLoss}
                    measurements="11px !important"
                  />
                </div>
              </INPUT_WRAPPER>
            </div>
            <div tw="flex flex-row mt-[-6px]">
              <ORDER_CATEGORY>
                {ORDER_CATEGORY_TYPE.map((item) => (
                  <div key={item.id} className="orderCategoryCheckboxWrapper">
                    <Checkbox
                      checked={order.type === item.id}
                      onChange={(e) =>
                        e.target.checked
                          ? setOrder((prev) => ({ ...prev, type: item.id as OrderType }))
                          : setOrder((prev) => ({ ...prev, type: 'limit' }))
                      }
                    />
                    <div className="orderCategoryName">{item.display}</div>
                  </div>
                ))}
              </ORDER_CATEGORY>
              <PLACE_ORDER_BUTTON
                $action={buttonState === ButtonState.CanPlaceOrder}
                onClick={() => (isSpot ? placeOrder() : handlePlaceOrder())}
                $orderSide={order.side}
                $isSpot={isSpot}
              >
                {loading ? <RotatingLoader text="Placing Order" textSize={12} iconSize={18} /> : buttonText}
              </PLACE_ORDER_BUTTON>
            </div>
          </>
        )}
        {isSpot && (
          <FEES>
            <Tooltip color={mode === 'dark' ? '#EEEEEE' : '#1C1C1C'}>
              Solana network fee, is the fee you pay in order to make transaction over the solana blockchain.
            </Tooltip>
            <span>SOL network fee: ~ 0.03</span>
          </FEES>
        )}
      </BODY>
    </WRAPPER>
  )
}

const SELECTOR = styled.div`
  ${tw`bg-black-4 dark:bg-[#555555] w-[160px] h-16 rounded-[5px] pt-2 pb-3 pl-2.5`}
  .selectorDropdown {
    ${tw`cursor-pointer`}
  }
  > div {
    ${tw`flex items-center mb-2`}
    > span {
      ${tw`text-white text-regular font-semibold`}
    }
    > input[type='radio'] {
      ${tw`appearance-none absolute right-3 h-[15px] w-[15px] bg-black-2 rounded-small cursor-pointer`}
    }
    > input[type='radio']:checked:after {
      ${tw`rounded-small w-[9px] h-[9px] relative top-[-4px] left-[3px] inline-block`}
      background: linear-gradient(92deg, #f7931a 0%, #ac1cc7 100%);
      content: '';
    }
  }
`
const SELECTOR_WRAPPER = styled.div`
  .dropdown-input {
    ${tw`bg-black-1 dark:text-grey-5 text-grey-2 p-1 text-regular font-semibold border-[1.5px] border-solid dark:border-grey-1 border-grey-4`}
    outline: none;
    height: 24px;
    width: 135px;
    border-radius: 5px;
    ::placeholder {
      ${tw`text-grey-2 text-tiny font-semibold`}
    }
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
`

const SELECTOR_PROFITLOSS = styled.div`
  ${tw`w-[160px] h-[132px] rounded-[5px] pt-[5px] pb-[5px] pl-[5px]`}
  background-color: ${({ theme }) => theme.bg20};
  .dropdown-items {
    ${tw`cursor-pointer`}
  }
  > div {
    ${tw`flex items-center mb-2`}
    > span {
      ${tw`text-white text-tiny font-semibold`}
    }
    > input[type='radio'] {
      ${tw`appearance-none absolute right-3 h-[15px] w-[15px] bg-black-2 rounded-small cursor-pointer`}
    }
    > input[type='radio']:checked:after {
      ${tw`rounded-small w-[9px] h-[9px] relative top-[-4px] left-[3px] inline-block`}
      background: linear-gradient(92deg, #f7931a 0%, #ac1cc7 100%);
      content: '';
    }
  }
  .green {
    ${tw`text-[#80CE00]`}
  }
  .red {
    ${tw`text-[#F35355]`}
  }
`

const TakeProfitStopLoss: FC<{
  setArrowRotation: Dispatch<SetStateAction<boolean>>
  setDropdownVisible: Dispatch<SetStateAction<boolean>>
  type: number
}> = ({ setArrowRotation, setDropdownVisible, type }) => {
  const [takeProfitAmount, setTakeProfitAmount] = useState<number>(0)
  const [takeProfitIndex, setTakeProfitIndex] = useState<number>(3)
  const [stopLossAmount, setStopLossAmount] = useState<number>(0)
  const [stopLossIndex, setStopLossIndex] = useState<number>(0)

  const isNumber = (e) => {
    setDropdownVisible(true)
    const inputAmt = +e.target.value

    if (!isNaN(inputAmt)) {
      type === 0 ? setTakeProfitIndex(inputAmt) : setStopLossAmount(inputAmt)
    }
  }

  const calcTakeProfit = (value, index) => {
    setTakeProfitIndex(index)
  }

  const calcStopLoss = (value, index) => {
    setStopLossIndex(index)
  }

  const percentArray =
    type === 0
      ? [
          {
            display: '25%',
            value: 0.25,
            key: 1
          },
          {
            display: '50%',
            value: 0.5,
            key: 2
          },
          {
            display: '75%',
            value: 0.75,
            key: 3
          },
          {
            display: '100%',
            value: 1,
            key: 4
          }
        ]
      : [
          {
            display: 'None',
            value: 0,
            key: 0
          },
          {
            display: '-10%%',
            value: 0.1,
            key: 1
          },
          {
            display: '-25%',
            value: 0.25,
            key: 2
          },
          {
            display: '-75%',
            value: 0.75,
            key: 3
          }
        ]

  return (
    <SELECTOR_WRAPPER>
      <SELECTOR_PROFITLOSS>
        {percentArray.map((item, index) => (
          <div
            key={index}
            className="dropdown-items"
            onClick={() => {
              setDropdownVisible(true)
            }}
          >
            <span tw="mr-2 font-semibold text-tiny dark:text-grey-5 text-black-4">{item.display}</span>
            <span className={type === 0 ? 'green' : 'red'} tw="font-semibold text-regular">
              {type === 0 ? '($980)' : '($230)'}
            </span>
            <input
              type="radio"
              name={type === 0 ? 'take-profit' : 'stop-loss'}
              value={item.value}
              checked={type === 0 ? takeProfitIndex === index : stopLossIndex === index}
              onChange={() => (type === 0 ? calcTakeProfit(item.value, index) : calcStopLoss(item.value, index))}
            />
          </div>
        ))}
        <input
          type="number"
          onChange={isNumber}
          placeholder="Enter Price"
          onFocus={isNumber}
          className="dropdown-input"
        />
      </SELECTOR_PROFITLOSS>
    </SELECTOR_WRAPPER>
  )
}

const Overlay: FC<{
  setArrowRotation: Dispatch<SetStateAction<boolean>>
  setDropdownVisible: Dispatch<SetStateAction<boolean>>
  side: OrderSide
}> = ({ setArrowRotation, setDropdownVisible, side }) => {
  const { order, setOrder } = useOrder()

  const handleChange = (display: OrderDisplayType) => {
    setOrder((prevState) => ({ ...prevState, display }))
    setArrowRotation(false)
    setDropdownVisible(false)
  }

  return (
    <SELECTOR>
      {AVAILABLE_ORDERS.filter(({ side: x }) => x === side).map((item, index) => (
        <div key={index} onClick={() => handleChange(item.display)} className="selectorDropdown">
          <span>{item.text}</span>
          <input
            type="radio"
            name="market"
            value={item.display}
            checked={order.display === item.display}
            onChange={() => handleChange(item.display)}
          />
        </div>
      ))}
    </SELECTOR>
  )
}
