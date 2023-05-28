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
import { displayFractional, getPerpsPrice, getProfitAmount } from './perps/utils'
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

const DROPDOWN_ITEMS = styled.div`
  .item {
    color: ${({ theme }) => theme.text11};
  }
  > input[type='radio'] {
    ${tw`appearance-none absolute right-3 h-[15px] w-[15px] rounded-small cursor-pointer`}
    background: ${({ theme }) => theme.bg22};
  }
  > input[type='radio']:checked:after {
    ${tw`rounded-small w-[9px] h-[9px] relative top-[-2px] left-[3px] inline-block`}
    background: linear-gradient(92deg, #f7931a 0%, #ac1cc7 100%);
    content: '';
  }
`

const DROPDOWN_INPUT = styled.div`
  ${tw`relative w-[135px] h-6 rounded-tiny mx-[5px]`}
  border: ${({ theme }) => '1px solid ' + theme.tokenBorder};
  background: ${({ theme }) => theme.bg20};
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type='number'] {
    -moz-appearance: textfield;
  }
  .dropdown-input {
    ${tw`w-[70%] h-full pl-1 pr-2 rounded-tiny py-[5px] text-tiny font-semibold border-0`}
    color: ${({ theme }) => theme.text28};
    background: ${({ theme }) => theme.bg20};
    outline: none;
    ::placeholder {
      ${tw`text-grey-2 text-tiny font-semibold`}
    }
  }
`

const DROPDOWN_SAVE = styled.div`
  &.save-disable {
    ${tw`text-tiny text-grey-1 font-semibold cursor-not-allowed absolute bottom-[10px] right-[10px] z-[100]`}
    pointer-events: none;
  }
  &.save-enable.dark {
    ${tw`text-tiny text-white font-semibold cursor-pointer absolute bottom-[10px] right-[10px] z-[100]`}
  }
  &.save-enable.lite {
    ${tw`text-tiny text-blue-1 font-semibold cursor-pointer absolute bottom-[10px] right-[10px] z-[100]`}
  }
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

const INPUT_WRAPPER = styled.div<{ $halfWidth?: boolean }>`
  ${tw`flex justify-center items-start flex-col h-full px-3`}
  width: ${({ $halfWidth }) => ($halfWidth ? '50%' : '100%')};
  .label {
    ${tw`pb-1 text-tiny font-semibold dark:text-grey-2 text-grey-1`}
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
    font-semibold text-tiny border border-solid rounded-[5px] cursor-pointer relative`}
    color: ${({ theme }) => theme.text21};
    border-color: ${({ theme }) => theme.tokenBorder};
    background: ${({ theme }) => theme.bg2};
    .green {
      ${tw`text-green-3 w-[90%] text-left text-regular`}
    }
    .red {
      ${tw`text-red-2 w-[90%] text-left text-regular`}
      overflow-y: hidden;
    }
  }
  .dropdownContainer.lite {
    .arrow-icon {
      filter: invert(28%) sepia(88%) saturate(1781%) hue-rotate(230deg) brightness(99%) contrast(105%);
    }
  }
  .focus-border {
    ${tw`rounded-tiny p-px`}
    background: linear-gradient(94deg, #f7931a 0%, #ac1cc7 100%);
  }
  .take-profit {
    ${tw`cursor-pointer border-[1.5px] border-solid border dark:border-grey-2 border-grey-1`}
    .ant-dropdown-trigger {
      ${tw`w-full h-full justify-end absolute right-[10px]`}
    }
  }
  .stop-loss {
    ${tw`cursor-not-allowed border-[1.5px] border-solid border dark:border-grey-2 border-grey-1`}
  }
  .disable {
    ${tw`cursor-not-allowed`}
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
  ${tw`flex justify-center items-center mt-3.75 h-5 mr-auto`}
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
  ${tw`mt-3 rounded-[30px] h-[30px] text-tiny font-semibold border-0 border-none mr-[5px]`}
  background: ${({ $action, $orderSide, theme }) =>
    $action ? ($orderSide === 'buy' ? '#71C25D' : '#F06565') : theme.bg23};
  color: ${({ $action }) => ($action ? 'white' : '#636363')};
  width: ${({ $isSpot }) => ($isSpot ? '95%' : '50%')};
  cursor: ${({ $action }) => ($action ? 'pointer' : 'not-allowed')};
`

const FEES = styled.div`
  ${tw`flex items-center justify-center my-2`}

  div {
    ${tw`ml-0 mr-[5px]`}
    img {
      ${tw`!ml-0 !h-3.5 !w-3.5`}
    }
  }

  span {
    ${tw`font-semibold text-tiny text-gray-2 ml-[5px]`}
  }
`

const SETTING_MODAL = styled(PopupCustom)`
  ${tw`!h-[536px] !w-[500px] rounded-bigger dark:bg-black-2 bg-grey-5`}

  .ant-modal-header {
    ${tw`rounded-tl-half rounded-tr-half px-[25px] pt-5 pb-0 border-b-0 dark:bg-black-2 bg-grey-5`}
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
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false)
  const { getTokenInfoFromSymbol } = useTokenRegistry()
  const { connected } = useWallet()
  const { mode } = useDarkMode()
  const { height } = useWindowSize()
  const [loading, setLoading] = useState<boolean>(false)
  const geoBlocked = useBlacklisted()
  //Take profit state:
  const [takeProfitVisible, setTakeProfitVisible] = useState(false)
  const [takeProfitArrow, setTakeProfitArrow] = useState(false)
  const [takeProfitAmount, setTakeProfitAmount] = useState<number>(null)
  const [takeProfitIndex, setTakeProfitIndex] = useState<number>(0)
  const [takeProfitInput, setTakeProfitInput] = useState<number>(null)
  const [profits, setProfits] = useState<any>(['', '', '', ''])

  const TAKE_PROFIT_ARRAY = [
    {
      display: 'None',
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
    order.side === 'buy'
      ? {
          display: '100%',
          value: 1,
          key: 3
        }
      : {
          display: '75%',
          value: 0.75,
          key: 3
        }
  ]

  useEffect(() => {
    const obj = []
    TAKE_PROFIT_ARRAY.map((item, index) => {
      if (Number.isNaN(+order.price)) obj.push('')
      else {
        if (index === 0) obj.push('')
        else {
          const profit = getProfitAmount(order.side, order.price, item.value)
          obj.push(profit.toFixed(2))
        }
      }
    })
    setProfits(obj)
  }, [order])

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
      if (geoBlocked) return ButtonState.isGeoBlocked
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

  const handleMenuClick = (e) => {
    if (e.key !== '4') {
      setTakeProfitVisible(false)
      setTakeProfitArrow(false)
    } else setTakeProfitVisible(true)
  }

  const handleOpenChange = (flag) => {
    setTakeProfitArrow(!takeProfitArrow)
    setTakeProfitVisible(flag)
  }

  const handleDropdownInput = (e) => {
    const inputAmt = e.target.value.replace(/[^0-9]\./g, '')
    if (!isNaN(+inputAmt)) setTakeProfitInput(+inputAmt)
  }

  const handleSave = (e) => {
    setTakeProfitIndex(null)
    setTakeProfitArrow(false)
    setTakeProfitVisible(false)
    setTakeProfitAmount(takeProfitInput)
  }

  const checkDisabled = () => {
    if (!+order.price) return true
    if (order.side === 'buy' && takeProfitInput < +order.price) return true
    if (order.side === 'sell' && takeProfitInput > +order.price) return true
    if (!takeProfitInput) return true
  }

  const calcTakeProfit = (value, index) => {
    setTakeProfitIndex(index)
    setTakeProfitArrow(!takeProfitArrow)
    setTakeProfitInput(null)
  }

  const getTakeProfitItems = () => {
    let items = []
    items = TAKE_PROFIT_ARRAY.map((item, index) => {
      const html = (
        <DROPDOWN_ITEMS tw="mb-2 flex flex-row px-[5px]" onClick={() => calcTakeProfit(item.value, index)}>
          <span className="item" tw="mr-2 font-semibold text-tiny text-grey-5">
            {item.display}
          </span>
          <span tw="font-semibold text-tiny mr-auto text-green-3">
            {index === 0 ? '' : profits[index] ? '($' + profits[index] + ')' : '(-)'}
          </span>
          <input
            type="radio"
            name="take-profit"
            value={item.value}
            checked={takeProfitIndex === index}
            onChange={() => calcTakeProfit(item.value, index)}
          />
        </DROPDOWN_ITEMS>
      )
      return {
        label: html,
        key: index
      }
    })
    const inputHTML = (
      <DROPDOWN_INPUT>
        <input
          type="number"
          onChange={handleDropdownInput}
          placeholder="Price"
          className="dropdown-input"
          value={takeProfitInput ? takeProfitInput : ''}
        />
      </DROPDOWN_INPUT>
    )
    items.push({
      label: inputHTML,
      key: 4
    })
    const saveBtnHTML = (
      <DROPDOWN_SAVE
        className={checkDisabled() ? 'save-disable' : 'save-enable ' + `${mode}`}
        onClick={!checkDisabled() && handleSave}
      >
        Save
      </DROPDOWN_SAVE>
    )
    items.push({
      label: saveBtnHTML,
      key: 5
    })
    return items
  }

  const getTakeProfitParam = () => {
    if (takeProfitIndex === 0) return null
    if (takeProfitIndex !== null) {
      const numPrice = +order.price
      if (Number.isNaN(numPrice)) return null

      const profitPrice =
        numPrice +
        (order.side === 'buy'
          ? TAKE_PROFIT_ARRAY[takeProfitIndex].value * numPrice
          : -TAKE_PROFIT_ARRAY[takeProfitIndex].value * numPrice)
      return profitPrice
    } else if (takeProfitAmount > 0) {
      return takeProfitAmount
    } else return null
  }

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
            >
              <TradeConfirmation setVisibility={setConfirmationModal} takeProfit={getTakeProfitParam()} />
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
                  offset={[-120, 15]}
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
                />
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
              onClick={() => (buttonState !== ButtonState.CanPlaceOrder ? null : placeOrder())}
              $orderSide={order.side}
              $isSpot={isSpot}
            >
              {loading ? <RotatingLoader text="Placing Order" textSize={12} iconSize={18} /> : buttonText}
            </PLACE_ORDER_BUTTON>
          </>
        ) : (
          <>
            <div tw="flex flex-row">
              <INPUT_WRAPPER $halfWidth={true}>
                <div className="label">Take Profit</div>
                <div className={`dropdownContainer ${mode} take-profit`}>
                  <span className="green">
                    {takeProfitIndex === 0
                      ? 'None'
                      : takeProfitIndex !== null
                      ? profits[takeProfitIndex]
                        ? '$' + profits[takeProfitIndex]
                        : '(-)'
                      : '$' + takeProfitAmount}
                  </span>
                  <ArrowDropdown
                    arrowRotation={takeProfitArrow}
                    overlayClassName={`takep-stopl-container ${mode}`}
                    offset={[11, 9]}
                    onVisibleChange={null}
                    placement="bottomLeft"
                    menu={{ items: getTakeProfitItems(), onClick: handleMenuClick }}
                    overlay={<></>}
                    measurements="11px !important"
                    onOpenChange={handleOpenChange}
                    open={takeProfitVisible}
                  />
                </div>
              </INPUT_WRAPPER>
              <INPUT_WRAPPER $halfWidth={true}>
                <div className="label disable">Stop Loss</div>
                <div className={`dropdownContainer ${mode} stop-loss`}>
                  <span className="red">None</span>
                  <ArrowDropdown
                    arrowRotation={false}
                    overlayClassName="takep-stopl-container"
                    offset={[11, 9]}
                    onVisibleChange={null}
                    placement="bottomLeft"
                    menu={{ getTakeProfitItems, onClick: handleMenuClick }}
                    overlay={<></>}
                    measurements="11px !important"
                    onOpenChange={null}
                    open={false}
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
                onClick={() => (buttonState !== ButtonState.CanPlaceOrder ? null : handlePlaceOrder())}
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
  ${tw`w-[150px] h-16 rounded-tiny pt-2 pb-3 pl-2.5 relative`}
  background: ${({ theme }) => theme.bg26};
  .selectorDropdown {
    ${tw`cursor-pointer`}
  }
  > div {
    ${tw`flex items-center mb-2`}
    > span {
      ${tw`text-regular font-semibold`}
      color: ${({ theme }) => theme.text4};
    }
    > input[type='radio'] {
      ${tw`appearance-none absolute right-3 h-[15px] w-[15px] rounded-small cursor-pointer`}
      background: ${({ theme }) => theme.bg23};
    }
    > input[type='radio']:checked:after {
      ${tw`rounded-small w-[9px] h-[9px] relative top-[-4px] left-[3px] inline-block`}
      background: linear-gradient(92deg, #f7931a 0%, #ac1cc7 100%);
      content: '';
    }
  }
`

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
