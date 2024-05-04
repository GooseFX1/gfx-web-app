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
  useTokenRegistry,
  useConnectionConfig
} from '../../context'
import { checkMobile, removeFloatingPointError } from '../../utils'
import { Dropdown } from 'antd'
import { useWallet } from '@solana/wallet-adapter-react'
import { ArrowDropdown, PopupCustom } from '../../components'
import { useTraderConfig } from '../../context/trader_risk_group'
import { getPerpsPrice, getProfitAmount } from './perps/utils'
import { TradeConfirmation } from './TradeConfirmation'
import 'styled-components/macro'
import { RotatingLoader } from '../../components/RotatingLoader'
import { Picker } from './Picker'
import useWindowSize from '../../utils/useWindowSize'
import { DepositWithdraw } from './perps/DepositWithdrawNew'
import {
  BlackGradientBg,
  ContentLabel,
  GradientButtonWithBorder,
  InfoLabel,
  PerpsLayout,
  TitleLabel
} from './perps/components/PerpsGenericComp'
import {
  Button,
  Checkbox,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  IconTooltip,
  Input,
  InputElementRight,
  InputGroup,
  Slider,
  Tabs,
  TabsList,
  TabsTrigger
} from 'gfx-component-lib'
import useBoolean from '@/hooks/useBoolean'
import { CircularArrow } from '@/components/common/Arrow'
import { Connect } from '../../layouts/Connect'
const MAX_SLIDER_THRESHOLD = 9.9 // If the slider is more than num will take maximum leverage
const DECIMAL_ADJUSTMENT_FACTOR = 1000 // For three decimal places, adjust if needed

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
  &.selected {
    ${tw`dark:bg-black-1 bg-grey-5`}
  }
  .span-selected {
    background: linear-gradient(92deg, #f7931a 0%, #ac1cc7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
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
    ${tw`text-tiny text-grey-1 font-semibold cursor-not-allowed absolute bottom-[10px] right-[15px] z-[100]`}
    pointer-events: none;
  }
  &.save-enable.dark {
    ${tw`text-tiny text-white font-semibold cursor-pointer absolute bottom-[10px] right-[15px] z-[100]`}
  }
  &.save-enable.lite {
    ${tw`text-tiny text-blue-1 font-semibold cursor-pointer absolute bottom-[10px] right-[15px] z-[100]`}
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
      display: inline-flex;
      align-items: center;
      color: ${({ theme }) => theme.text32};
      img {
        ${tw`h-5 w-5 mr-2.5`}
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
        //background: linear-gradient(94deg, #f7931a 0%, #ac1cc7 100%);
        //padding: 2px;
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
      .active.buy {
        background: rgba(128, 206, 0, 0.35);
        border: 1px solid #80ce00;
      }
      .active.sell {
        background: rgba(243, 83, 85, 0.35);
        border: 1px solid #f35355;
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

const SETTING_MODAL_DEPOSIT = styled(PopupCustom)`
  ${tw`!h-[356px] !w-[628px] rounded-half`}
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

const INPUT_WRAPPER = styled.div<{ $halfWidth?: boolean }>`
  ${tw`flex justify-center items-start flex-col h-full px-3`}
  width: ${({ $halfWidth }) => ($halfWidth ? '50%' : '100%')};
  .label {
    ${tw`pb-1 text-tiny font-semibold dark:text-grey-2 text-grey-1`}
  }
  img {
    height: 20px;
    width: 20px;
    object-fit: contain;
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

const MODALHEADER = styled.div`
  ${tw`flex items-center`}

  .cta {
    ${tw`rounded-bigger w-[120px] h-[40px] mr-[13px] cursor-pointer`}

    .btn {
      ${tw`flex items-center justify-center text-regular font-semibold w-full h-full`}
      color: ${({ theme }) => theme.text37};
    }

    .gradient-bg {
      ${tw`h-full w-full rounded-bigger `}
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
      background-color: ${({ theme }) => theme.white};
    }
  }

  img {
    ${tw`ml-auto h-10 w-10 cursor-pointer mr-[50px]`}
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

const PLACE_ORDER_BUTTON = styled.button<{
  $action: boolean
  $orderSide: string
  $isDevnet: boolean
  $isDeposit?: boolean
}>`
  ${tw`mt-3 w-1/2 rounded-[30px] h-[30px] text-tiny font-semibold border-0 border-none mr-[5px]`}
  background: ${({ $action, $orderSide, theme }) =>
    $action ? ($orderSide === 'buy' ? '#71C25D' : '#F06565') : theme.bg23};
  color: ${({ $action }) => ($action ? 'white' : '#636363')};
  cursor: ${({ $action, $isDeposit }) => ($action || $isDeposit ? 'pointer' : 'not-allowed')};
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

const ModalHeader: FC<{ setTradeType: (tradeType: string) => void; tradeType: string }> = ({
  setTradeType,
  tradeType
}) => {
  const { mode } = useDarkMode()
  return (
    <MODALHEADER>
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
      {/*<img src="/img/assets/refresh.svg" alt="refresh-icon" />*/}
    </MODALHEADER>
  )
}

export const PlaceOrder: FC = () => {
  const { getUIAmount } = useAccounts()
  const { selectedCrypto, getSymbolFromPair, getAskSymbolFromPair, getBidSymbolFromPair, isDevnet } = useCrypto()
  const { order, setOrder, focused, setFocused } = useOrder()
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
  const { blacklisted } = useConnectionConfig()
  const { wallet } = useWallet()
  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])

  //Take profit state:
  const [takeProfitVisible, setTakeProfitVisible] = useState(false)
  const [takeProfitArrow, setTakeProfitArrow] = useState(false)
  const [takeProfitAmount, setTakeProfitAmount] = useState<number>(null)
  const [takeProfitIndex, setTakeProfitIndex] = useState<number>(null)
  const [takeProfitInput, setTakeProfitInput] = useState<number>(null)
  const [profits, setProfits] = useState<any>(['', '', '', ''])
  const [depositWithdrawModal, setDepositWithdrawModal] = useState<boolean>(false)
  const [tradeType, setTradeType] = useState<string>('deposit')
  const [firstLoad, setFirstLoad] = useState<boolean>(true)
  const [isOpen, setIsOpen] = useBoolean(false)

  const TAKE_PROFIT_ARRAY = [
    {
      display: '10%',
      value: 0.1,
      key: 1
    },
    {
      display: '25%',
      value: 0.25,
      key: 2
    },
    order.side === 'buy'
      ? {
          display: '50%',
          value: 0.5,
          key: 3
        }
      : {
          display: '75%',
          value: 0.75,
          key: 3
        }
  ]

  useEffect(() => {
    setOrder((prevState) => ({ ...prevState, size: '' }))
  }, [Number(traderInfo.currentLeverage).toFixed(1), publicKey])

  useEffect(() => {
    const obj = []
    TAKE_PROFIT_ARRAY.map((item, index) => {
      if (Number.isNaN(+order.price)) obj.push('')
      else {
        const profit = getProfitAmount(order.side, order.price, item.value)
        obj.push(profit.toFixed(2))
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
    if (blacklisted) return ButtonState.isGeoBlocked
    if (!connected) return ButtonState.Connect
    if (!traderInfo?.traderRiskGroupKey) return ButtonState.CreateAccount
    if (!order.price || !order.total || !order.size) return ButtonState.NullAmount
    if (order.size > maxQtyNum) return ButtonState.BalanceExceeded
    if (order.size < 0.01) return ButtonState.OrderTooSmall
    //if (order.total > perpsBidBalance) return ButtonState.BalanceExceeded
    return ButtonState.CanPlaceOrder
  }, [connected, selectedCrypto.pair, order, isDevnet, traderInfo])

  const buttonText = useMemo(() => {
    if (buttonState === ButtonState.BalanceExceeded) return 'Insufficient Balance'
    else if (buttonState === ButtonState.Connect) return 'Connect Wallet'
    else if (buttonState === ButtonState.isGeoBlocked) return 'Georestricted'
    else if (buttonState === ButtonState.CreateAccount) return 'Deposit!'
    else if (buttonState === ButtonState.OrderTooSmall) return 'Minimum size 0.01'
    else if (buttonState === ButtonState.NullAmount) return 'Enter Amount'

    if (order.side === 'buy') return 'LONG ' + symbol
    else return 'SHORT ' + symbol
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
  function isValidDecimal(input) {
    const num = Number(input)
    const scaled = num * 1000

    if (scaled === Math.round(scaled)) {
      return true
    } else {
      return false
    }
  }

  const numberCheck = (input: string, source: string) => {
    if (!isNaN(+input)) {
      setSelectedTotal(null)
      switch (source) {
        case 'size':
          if (isValidDecimal(input)) setOrder((prev) => ({ ...prev, size: input }))
          break
        case 'total':
          if (isValidDecimal(input)) setOrder((prev) => ({ ...prev, total: input }))
          break
        case 'price':
          if (isValidDecimal(input)) setOrder((prev) => ({ ...prev, price: input }))
          break
      }
    }
  }

  const handleClick = (value: number) => {
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

  useEffect(() => {
    if (firstLoad && traderInfo.onChainPrice !== '0') {
      setOrder((prev) => ({ ...prev, price: traderInfo.onChainPrice, size: '' }))
      setFirstLoad(false)
      handleSliderChange(0)
    }
  }, [traderInfo.onChainPrice, firstLoad])

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
    const percentage1 = (newLev / availLeverage) * maxQty
    const percentage2 = Number(percentage1.toFixed(3))
    if (newLev > availLeverage) return
    if (isNaN(percentage2)) {
      setOrder((prev) => ({ ...prev, size: 0 }))
      return
    }
    if (percentage2 < maxQty) setOrder((prev) => ({ ...prev, size: percentage2 }))
    // if (percentage2 > 1) setOrder((prev) => ({ ...prev, size: Math.floor(percentage2) }))
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
    return false
  }

  const calcTakeProfit = (value, index) => {
    setTakeProfitIndex(index)
    setTakeProfitInput(null)
  }

  const getTakeProfitItems = () => {
    let items = []

    items = TAKE_PROFIT_ARRAY.map((item, index) => {
      const html = (
        // <DROPDOWN_ITEMS
        //   tw="mb-1 flex flex-row p-[5px] w-[90%] mx-auto rounded-[3px]"
        //   onClick={() => calcTakeProfit(item.value, index)}
        //   className={takeProfitIndex === index ? 'selected' : ''}
        // >
        //   <span
        //     tw="mr-2 font-semibold text-regular dark:text-grey-2 text-grey-1"
        //     className={takeProfitIndex === index ? 'span-selected' : ''}
        //   >
        //     {item.display}
        //   </span>
        //   <span
        //     tw="font-semibold text-regular mr-auto dark:text-grey-2 text-grey-1"
        //     className={takeProfitIndex === index ? 'span-selected' : ''}
        //   >
        //     {index === 0 ? '' : profits[index] ? '($' + profits[index] + ')' : '(-)'}
        //   </span>
        // </DROPDOWN_ITEMS>
        <DropdownMenuItem variant={'default'} onClick={() => setOrder((prev) => ({ ...prev, display: 'limit' }))}>
          <ContentLabel>
            <div className="flex w-[200px]" onClick={() => calcTakeProfit(item.value, index)}>
              <p className={cn('font-bold cursor-pointer mr-1')}>{item.display}</p>
              <p className={cn('font-bold cursor-pointer')}>
                {index === 0 ? '' : profits[index] ? '($' + profits[index] + ')' : '(-)'}
              </p>
            </div>
          </ContentLabel>
        </DropdownMenuItem>
      )

      return html
    })

    const saveHtml = (
      <DropdownMenuItem variant={'blank'} onSelect={(e) => e.preventDefault()}>
        <InputGroup
          rightItem={
            <InputElementRight>
              <Button
                variant={'ghost'}
                disabled={checkDisabled()}
                className={cn(`cursor-pointer ${checkDisabled() ? '' : '!text-white'}`)}
                onClick={!checkDisabled() && handleSave}
              >
                Save
              </Button>
            </InputElementRight>
          }
        >
          <Input
            //  className={checkDisabled() ? 'save-disable' : 'save-enable ' + `${mode}`}
            // onClick={!checkDisabled() && handleSave}
            onChange={handleDropdownInput}
            type="number"
            className={'dark:border-border-darkmode-secondary'}
            placeholder={'Enter custom price'}
          />
        </InputGroup>
      </DropdownMenuItem>
    )

    return [...items, saveHtml]
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
    if (!publicKey) return 0
    const initLeverage = Number(traderInfo.currentLeverage)
    const availLeverage = Number(traderInfo.availableLeverage)
    const qty = maxQtyNum
    let orderSize = order.size || 0
    // we do this so that the displayed leverage doesn't exceed 10x
    if (Number(orderSize) > qty) {
      orderSize = qty
    }
    //const availMargin = Number(traderInfo.marginAvailable)
    let percentage = 0
    percentage = (Number(orderSize) / qty) * availLeverage

    //else if (order.total < availMargin) percentage = (Number(order.total) / Number(availMargin)) * availLeverage
    if (isNaN(Number((initLeverage + percentage).toFixed(2)))) return 0
    return Number((initLeverage + percentage).toFixed(2))
    //return Number(initLeverage.toFixed(2))
  }, [maxQtyNum, order.size, publicKey, traderInfo.currentLeverage, traderInfo.availableLeverage])

  const displayPair = useMemo(() => {
    return selectedCrypto.display
  }, [selectedCrypto.pair, selectedCrypto.type])

  useEffect(() => {
    // Check if the slider is at its maximum value
    // Calculate adjusted size based on maximum quantity so that we get 2 decimal places
    if (sliderValue > MAX_SLIDER_THRESHOLD) {
      const adjustedSize = Math.floor(maxQtyNum * DECIMAL_ADJUSTMENT_FACTOR) / DECIMAL_ADJUSTMENT_FACTOR
      setOrder((prevState) => ({ ...prevState, size: adjustedSize }))
    }
  }, [sliderValue, maxQtyNum])

  // return (
  //   <WRAPPER>
  //     {depositWithdrawModal && (
  //       <SETTING_MODAL_DEPOSIT
  //         visible={true}
  //         centered={true}
  //         footer={null}
  //         title={<ModalHeader setTradeType={setTradeType} tradeType={tradeType} />}
  //         closeIcon={
  //           <img
  //             src={`/img/assets/close-${mode === 'lite' ? 'gray' : 'white'}-icon.svg`}
  //             height="20px"
  //             width="20px"
  //             onClick={() => setDepositWithdrawModal(false)}
  //           />
  //         }
  //       >
  //         <DepositWithdraw tradeType={tradeType} setDepositWithdrawModal={setDepositWithdrawModal} />
  //       </SETTING_MODAL_DEPOSIT>
  //     )}
  //     <HEADER>
  //       {confirmationModal && (
  //         <>
  //           <SETTING_MODAL
  //             visible={true}
  //             centered={true}
  //             footer={null}
  //             title={
  //               <>
  //                 <span tw="dark:text-grey-5 text-black-4 text-[25px] font-semibold">
  //                   {order.display === 'limit' ? 'Limit ' : 'Market '}
  //                   {order.side === 'buy' ? 'Long' : 'Short'}
  //                 </span>
  //                 <TITLE>SOL-PERP</TITLE>
  //               </>
  //             }
  //             closeIcon={
  //               <img
  //                 src={`/img/assets/close-${mode === 'lite' ? 'gray' : 'white'}-icon.svg`}
  //                 height="20px"
  //                 width="20px"
  //                 onClick={() => setConfirmationModal(false)}
  //               />
  //             }
  //           >
  //             <TradeConfirmation setVisibility={setConfirmationModal} takeProfit={getTakeProfitParam()} />
  //           </SETTING_MODAL>
  //         </>
  //       )}
  //       <div className="pairInfo">
  //         <div className="pairName">
  //           <img src={`/img/crypto/${symbol}.svg`} alt="" />
  //           {displayPair}
  //         </div>
  //         {<div className="pairLeverage">{sliderValue}</div>}
  //       </div>
  //       <div className="orderSide">
  //         <div
  //           className={order.side === 'buy' ? 'selected gradientBorder' : 'gradientBorder'}
  //           onClick={() => handleOrderSide('buy')}
  //         >
  //           <div className="holder">
  //             <div
  //               className={order.side === 'buy' ? 'active overlayBorder buy' : 'inactive overlayBorder buy'}
  //               css={[tw`text-regular font-bold`]}
  //             >
  //               {'Buy'}
  //             </div>
  //           </div>
  //         </div>
  //         <div
  //           className={order.side === 'sell' ? 'selected gradientBorder' : 'gradientBorder'}
  //           onClick={() => handleOrderSide('sell')}
  //         >
  //           <div className="holder">
  //             <div
  //               className={order.side === 'sell' ? 'active overlayBorder sell' : 'inactive overlayBorder sell'}
  //               css={[tw`text-regular font-bold`]}
  //             >
  //               {'Sell'}
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </HEADER>
  //     <BODY>
  //       <INPUT_GRID_WRAPPER>
  //         <div className="inputRow">
  //           <INPUT_WRAPPER>
  //             <div className="label">Order Type</div>
  //             <div className={`dropdownContainer ${mode}`} onClick={handleDropdownClick}>
  //               <div css={[tw`text-regular font-bold`]}>{displayedOrder?.text}</div>
  //               <ArrowDropdown
  //                 arrowRotation={arrowRotation}
  //                 offset={[-115, 10]}
  //                 onVisibleChange={() => {
  //                   setDropdownVisible(true)
  //                 }}
  //                 placement="bottomLeft"
  //                 overlay={
  //                   <Overlay
  //                     setArrowRotation={setArrowRotation}
  //                     setDropdownVisible={setDropdownVisible}
  //                     side={order.side}
  //                   />
  //                 }
  //                 visible={dropdownVisible}
  //                 measurements="13px !important"
  //                 overlayClassName={mode}
  //               />
  //             </div>
  //           </INPUT_WRAPPER>
  //           <INPUT_WRAPPER>
  //             <div className="label">Price</div>
  //             <div className={focused === 'price' ? 'focus-border' : ''}>
  //               <Input
  //                 suffix={<span className="suffixText">{bid}</span>}
  //                 onFocus={() => setFocused('price')}
  //                 maxLength={15}
  //                 onBlur={() => setFocused(undefined)}
  //                 value={order.price ? order.price : ''}
  //                 onChange={(e) => numberCheck(e.target.value, 'price')}
  //                 placeholder={'0.00'}
  //                 disabled={order.display === 'market'}
  //                 style={order.display === 'market' ? { border: '1px solid #f06565' } : null}
  //               />
  //             </div>
  //           </INPUT_WRAPPER>
  //         </div>
  //         <div className="inputRow">
  //           <INPUT_WRAPPER>
  //             <div className="label">Size</div>
  //             <div className={focused === 'size' ? 'focus-border' : ''}>
  //               <Input
  //                 suffix={
  //                   <>
  //                     <img src={`/img/crypto/${symbol}.svg`} alt="" />
  //                     <span className="suffixText">{symbol}</span>
  //                   </>
  //                 }
  //                 placeholder={'0.00'}
  //                 onFocus={() => setFocused('size')}
  //                 maxLength={15}
  //                 onBlur={() => setFocused(undefined)}
  //                 value={order.size ?? ''}
  //                 onChange={(e) => numberCheck(e.target.value, 'size')}
  //               />
  //             </div>
  //           </INPUT_WRAPPER>
  //           <INPUT_WRAPPER>
  //             <div className="label">Amount</div>
  //             <div className={focused === 'total' ? 'focus-border' : ''}>
  //               <Input
  //                 suffix={<span className="suffixText">{bid}</span>}
  //                 onFocus={() => setFocused('total')}
  //                 maxLength={15}
  //                 onBlur={() => setFocused(undefined)}
  //                 value={order.total ? order.total : ''}
  //                 onChange={(e) => numberCheck(e.target.value, 'total')}
  //                 placeholder={'0.00'}
  //               />
  //             </div>
  //           </INPUT_WRAPPER>
  //         </div>
  //       </INPUT_GRID_WRAPPER>
  //       {
  //         //isDevnet ? (
  //         //  <TOTAL_SELECTOR>
  //         //    {TOTAL_VALUES.map((item) => (
  //         //      <div
  //         //        key={item.key}
  //         //        className={'valueSelector ' + (item.value === selectedTotal ? 'selected' : '')}
  //         //        onClick={() => handleClick(item.value)}
  //         //      >
  //         //        {item.display}
  //         //      </div>
  //         //    ))}
  //         //  </TOTAL_SELECTOR>
  //         //) :
  //         <LEVERAGE_WRAPPER>
  //           <div className={height > 790 ? 'leverageText' : 'smallScreenLeverageText'}>Leverage</div>
  //           <div className={height > 790 ? 'leverageBar' : 'smallScreenLeverageBar'}>
  //             <Picker>
  //               <Slider
  //                 max={10}
  //                 onChange={(e) => handleSliderChange(e)}
  //                 step={0.0001}
  //                 value={sliderValue}
  //                 trackStyle={{
  //                   height: '6px'
  //                 }}
  //                 handleStyle={{
  //                   height: '20px',
  //                   width: '20px',
  //                   background: 'white',
  //                   border: '2px solid #FFFFFF',
  //                   position: 'relative',
  //                   bottom: '2px'
  //                 }}
  //                 marks={getMarks()}
  //               />
  //             </Picker>
  //           </div>
  //         </LEVERAGE_WRAPPER>
  //       }
  //       {
  //         //isDevnet ? (
  //         //  <>
  //         //    <ORDER_CATEGORY>
  //         //      {ORDER_CATEGORY_TYPE.map((item) => (
  //         //        <div key={item.id} className="orderCategoryCheckboxWrapper">
  //         //          <Checkbox
  //         //            checked={order.type === item.id}
  //         //            onChange={(e) =>
  //         //              e.target.checked
  //         //                ? setOrder((prev) => ({ ...prev, type: item.id as OrderType }))
  //         //                : setOrder((prev) => ({ ...prev, type: 'limit' }))
  //         //            }
  //         //          />
  //         //          <div className="orderCategoryName">{item.display}</div>
  //         //        </div>
  //         //      ))}
  //         //    </ORDER_CATEGORY>
  //         //    <PLACE_ORDER_BUTTON
  //         //      $action={buttonState === ButtonState.CanPlaceOrder}
  //         //      //onClick={() => (buttonState !== ButtonState.CanPlaceOrder ? null : placeOrder())}
  //         //      $orderSide={order.side}
  //         //      $isDevnet={isDevnet}
  //         //    >
  //         //      {loading ? <RotatingLoader text="Placing Order" textSize={12} iconSize={18} /> : buttonText}
  //         //    </PLACE_ORDER_BUTTON>
  //         //  </>
  //         //) :
  //         <>
  //           <div tw="flex flex-row">
  //             <INPUT_WRAPPER $halfWidth={true}>
  //               <div className="label">Take Profit</div>
  //               <div className={`dropdownContainer ${mode} take-profit`}>
  //                 <span className="green" css={[tw`text-regular font-bold`]}>
  //                   {takeProfitIndex === 0
  //                     ? 'None'
  //                     : takeProfitIndex !== null
  //                     ? profits[takeProfitIndex]
  //                       ? '$' + profits[takeProfitIndex]
  //                       : '(-)'
  //                     : '$' + takeProfitAmount}
  //                 </span>
  //                 <ArrowDropdown
  //                   arrowRotation={takeProfitArrow}
  //                   overlayClassName={`takep-stopl-container ${mode}`}
  //                   offset={[11, 9]}
  //                   onVisibleChange={null}
  //                   placement="bottomLeft"
  //                   menu={{ items: getTakeProfitItems(), onClick: handleMenuClick }}
  //                   overlay={<></>}
  //                   measurements="11px !important"
  //                   onOpenChange={handleOpenChange}
  //                   open={takeProfitVisible}
  //                 />
  //               </div>
  //             </INPUT_WRAPPER>
  //             <INPUT_WRAPPER $halfWidth={true}>
  //               <div className="label disable">Stop Loss</div>
  //               <div className={`dropdownContainer ${mode} stop-loss`} css={[tw`text-regular font-bold`]}>
  //                 <span className="red" css={[tw`text-regular font-bold`]}>
  //                   None
  //                 </span>
  //                 <ArrowDropdown
  //                   arrowRotation={false}
  //                   overlayClassName="takep-stopl-container"
  //                   offset={[11, 9]}
  //                   onVisibleChange={null}
  //                   placement="bottomLeft"
  //                   menu={{ getTakeProfitItems, onClick: handleMenuClick }}
  //                   overlay={<></>}
  //                   measurements="11px !important"
  //                   onOpenChange={null}
  //                   open={false}
  //                 />
  //               </div>
  //             </INPUT_WRAPPER>
  //           </div>
  //           <div tw="flex flex-row mt-[-6px]">
  //             <ORDER_CATEGORY>
  //               {ORDER_CATEGORY_TYPE.map((item) => (
  //                 <div key={item.id} className="orderCategoryCheckboxWrapper">
  //                   <Checkbox
  //                     checked={order.type === item.id}
  //                     onChange={(e) =>
  //                       e.target.checked
  //                         ? setOrder((prev) => ({ ...prev, type: item.id as OrderType }))
  //                         : setOrder((prev) => ({ ...prev, type: 'limit' }))
  //                     }
  //                   />
  //                   <div className="orderCategoryName">{item.display}</div>
  //                 </div>
  //               ))}
  //             </ORDER_CATEGORY>
  //             <PLACE_ORDER_BUTTON
  //               $action={buttonState === ButtonState.CanPlaceOrder}
  //               onClick={() =>
  //                 buttonState === ButtonState.CreateAccount
  //                   ? setDepositWithdrawModal(true)
  //                   : buttonState !== ButtonState.CanPlaceOrder
  //                   ? null
  //                   : handlePlaceOrder()
  //               }
  //               $orderSide={order.side}
  //               $isDevnet={isDevnet}
  //               $isDeposit={buttonState === ButtonState.CreateAccount}
  //             >
  //               {loading ? <RotatingLoader text="Placing Order" textSize={12} iconSize={18} /> : buttonText}
  //             </PLACE_ORDER_BUTTON>
  //           </div>
  //         </>
  //       }
  //       {/*{
  //       isDevnet && (
  //         <FEES>
  //           <Tooltip color={mode === 'dark' ? '#EEEEEE' : '#1C1C1C'}>
  //             Solana network fee, is the fee you pay in order to make transaction over the solana blockchain.
  //           </Tooltip>
  //           <span>SOL network fee: ~ 0.03</span>
  //         </FEES>
  //       )}*/}
  //     </BODY>
  //   </WRAPPER>
  // )
  return (
    <div className={cn('h-full')}>
      <PerpsLayout>
        <LongShortTitleLayout handleOrderSide={handleOrderSide} />
        <LeverageRatioTile sliderValue={sliderValue} />
        {confirmationModal && (
          <TradeConfirmation
            open={confirmationModal}
            setVisibility={setConfirmationModal}
            takeProfit={getTakeProfitParam()}
          />
        )}

        <div className="px-2.5 flex flex-col sm:pb-2.5 py-1 sm:h-auto h-[calc(100% - 80px)]">
          <div className={cn('flex mb-2.5')}>
            <div className={cn('flex w-1/2 flex-col')}>
              <div className="pb-1">
                {' '}
                <InfoLabel> Order type</InfoLabel>
              </div>
              {/* <Input className={cn('w-auto min-w-[100px] mr-2')} /> */}
              <DropdownMenu open={isOpen} onOpenChange={setIsOpen.set}>
                <DropdownMenuTrigger asChild={true}>
                  <Button
                    variant="outline"
                    onClick={setIsOpen.on}
                    colorScheme={mode === 'lite' ? 'blue' : 'white'}
                    className={cn('max-content mr-2 h-[30px] sm:h-[35px]')}
                  >
                    <div className="flex w-full items-center justify-between">
                      <div className="flex">
                        <IconTooltip tooltipType={'outline'}>
                          <p>Limit</p>
                        </IconTooltip>
                        <h4 className={cn('ml-1')}>{order.display === 'limit' ? 'Limit ' : 'Market '}</h4>
                      </div>

                      <img
                        style={{
                          height: '18px',
                          width: '18px',
                          transform: `rotate(${isOpen ? '0deg' : '180deg'})`,
                          transition: 'transform 0.2s ease-in-out'
                        }}
                        src={`/img/mainnav/connect-chevron-${mode}.svg`}
                        alt={'connect-chevron'}
                      />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent asChild>
                  <div className={'flex flex-col gap-1.5 items-start  max-w-[250px]'}>
                    <DropdownMenuItem
                      variant={'default'}
                      onClick={() => setOrder((prev) => ({ ...prev, display: 'limit' }))}
                    >
                      <p className={cn('font-bold w-[90px] cursor-pointer')}>Limit</p>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOrder((prev) => ({ ...prev, display: 'market' }))}>
                      <p className={cn('font-bold w-[90px] cursor-pointer')}>Market</p>
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className={cn('flex w-1/2 flex-col')}>
              <div className="pb-1">
                {' '}
                <InfoLabel>Price</InfoLabel>{' '}
              </div>
              <div className={cn('w-full flex')}>
                <Input
                  placeholder={'0.00 USD'}
                  value={order.price ?? ''}
                  onChange={(e) => numberCheck(e.target.value, 'price')}
                  disabled={order.display === 'market'}
                  className={cn(`mr-2 p-1 h-[30px] sm:h-[35px] min-w-[100px] text-right`, order.price && `pr-12`)}
                />
                <div className="relative">
                  {order.price && (
                    <p className={cn('mt-[9px] right-3 absolute mr-1')}>
                      <InfoLabel>
                        <p>USD</p>{' '}
                      </InfoLabel>
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className={cn('flex mb-2.5')}>
            <div className={cn('flex w-1/2 flex-col')}>
              <div className="pb-1">
                {' '}
                <InfoLabel>Size</InfoLabel>{' '}
              </div>
              <div className={cn('w-full flex')}>
                <Input
                  placeholder={'0.00 SOL'}
                  value={order.size ?? ''}
                  onChange={(e) => numberCheck(e.target.value, 'size')}
                  className={cn(`mr-2 p-1 h-[30px] sm:h-[35px] min-w-[100px] text-right`, order.size && `pr-12`)}
                />
                <div className="relative">
                  {Number(order.size) !== 0 && (
                    <InfoLabel>
                      <p className={cn('mt-[9px] right-3 absolute mr-1')}>SOL</p>
                    </InfoLabel>
                  )}
                </div>
              </div>
            </div>
            <div className={cn('flex w-1/2 flex-col')}>
              <div className="pb-1">
                {' '}
                <InfoLabel>Amount</InfoLabel>{' '}
              </div>
              <div className={cn('w-full flex')}>
                <Input
                  placeholder={'0.00 USD'}
                  value={order.total !== 0 ? order.total : ''}
                  onChange={(e) => numberCheck(e.target.value, 'total')}
                  className={cn(
                    `mr-2 p-1 sm:text-[15px] h-[30px] sm:h-[35px] min-w-[100px] text-right`,
                    order.total && `pr-12`
                  )}
                />
                <div className="relative">
                  {Number(order.total) !== 0 && (
                    <InfoLabel>
                      <p className={cn('mt-[9px] right-[15px] absolute')}>USD</p>
                    </InfoLabel>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={cn('flex mb-2.5 flex-col')}>
            <div className="pb-1">
              {' '}
              <InfoLabel>Take Profit {takeProfitVisible} </InfoLabel>{' '}
            </div>
            <div className={cn('w-full flex')}>
              <div className="w-1/2 flex">
                <Input
                  placeholder={'0.00 USD'}
                  value={
                    takeProfitIndex === null
                      ? takeProfitAmount
                        ? takeProfitAmount
                        : ''
                      : profits[takeProfitIndex]
                      ? '$' + profits[takeProfitIndex] + ' USD'
                      : '(-)'
                  }
                  onChange={(e) => {
                    setTakeProfitIndex(null)
                    setTakeProfitAmount(Number(e.target.value))
                  }}
                  className={cn(
                    `mr-2 p-1 h-[30px] sm:h-8.75 min-w-[100px] text-right`,
                    (takeProfitIndex || takeProfitAmount) && `pr-1`
                  )}
                />
                {/* {Number(takeProfitIndex) !== 0 || takeProfitAmount !== 0 && (
                  <InfoLabel>
                    <p className={cn('mt-1.5 right-[12px] absolute')}>USD</p>
                  </InfoLabel>
                )} */}
              </div>
              <div className="w-1/2">
                <Tabs>
                  <TabsList className="!p-0">
                    {TAKE_PROFIT_ARRAY.map((elem, index) => (
                      <TabsTrigger
                        className={cn('w-[33%] h-[35px]')}
                        size="xl"
                        key={index}
                        value={index.toString()}
                        variant="primary"
                        onClick={(e) => calcTakeProfit(elem.value, index)}
                      >
                        <TitleLabel whiteText={takeProfitIndex === index}>{elem.display}</TitleLabel>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>
            {/* <DropdownMenu open={takeProfitVisible} onOpenChange={setTakeProfitVisible}>
              <DropdownMenuTrigger asChild={true}>
                <Button
                  colorScheme={mode === 'lite' ? 'blue' : 'white'}
                  variant="outline"
                  onClick={() => setTakeProfitVisible(true)}
                  className={cn('max-content mr-2 h-[30px]')}
                >
                  <div className="flex w-full justify-between">
                    {takeProfitIndex === 0
                      ? 'None'
                      : takeProfitIndex !== null
                      ? profits[takeProfitIndex]
                        ? '$' + profits[takeProfitIndex]
                        : '(-)'
                      : '$' + takeProfitAmount}
                    <img
                      style={{
                        transform: `rotate(${takeProfitVisible ? '0deg' : '180deg'})`,
                        transition: 'transform 0.2s ease-in-out'
                      }}
                      src={`/img/mainnav/connect-chevron-${mode}.svg`}
                      alt={'connect-chevron'}
                    />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent asChild>
                <div className={'flex flex-col gap-1.5 items-start  max-w-[250px]'}>{getTakeProfitItems()}</div>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </div>
          <div className={cn('flex mb-2.5 flex-col')}>
            <InfoLabel>Leverage</InfoLabel>
            <div className={cn('mt-2.5')}>
              <Slider
                max={10}
                thumbSize="md"
                value={[sliderValue]}
                onValueChange={(e) => handleSliderChange(e)}
                step={0.1}
                min={0}
              >
                {sliderValue}x
              </Slider>
              <div className={cn('h-5 w-full flex items-center justify-center mt-3')}>
                <div className={cn('flex w-full justify-center')}>
                  <TitleLabel> 2X</TitleLabel>
                </div>
                <div className={cn('flex w-full justify-center')}>
                  <TitleLabel> 4X</TitleLabel>
                </div>
                <div className={cn('flex w-full justify-center')}>
                  <TitleLabel> 8X</TitleLabel>
                </div>
                <div className={cn('flex w-full justify-center')}>
                  <TitleLabel> 10X</TitleLabel>
                </div>
              </div>
            </div>
          </div>
          <div className={cn('flex items-center mt-auto')}>
            {ORDER_CATEGORY_TYPE.map((item) => (
              <div key={item.id} className={cn('flex mr-2 items-center')}>
                <Checkbox
                  checked={order.type === item.id}
                  onCheckedChange={(checked: boolean) => {
                    checked
                      ? setOrder((prev) => ({ ...prev, type: item.id as OrderType }))
                      : setOrder((prev) => ({ ...prev, type: 'limit' }))
                  }}
                />
                <div className="ml-1">
                  <InfoLabel>{item.display}</InfoLabel>
                </div>
              </div>
            ))}
            {!checkMobile() ? (
              <div className={cn('ml-auto w-full')}>
                {publicKey ? (
                  <Button
                    className={cn('min-w-[170px] !w-full h-[30px]')}
                    variant="default"
                    colorScheme="blue"
                    size="lg"
                    onClick={() => handlePlaceOrder()}
                    disabled={buttonState !== ButtonState.CanPlaceOrder}
                  >
                    <h4>{buttonText}</h4>
                  </Button>
                ) : (
                  <Connect customButtonStyle="!w-[100%]" containerStyle="!w-[100%]" />
                )}
              </div>
            ) : publicKey ? (
              <ButtonForMobile
                buttonText={buttonText}
                handlePlaceOrder={handlePlaceOrder}
                buttonState={buttonState}
              />
            ) : null}
          </div>
        </div>
      </PerpsLayout>
    </div>
  )
}

const ButtonForMobile: FC<{ buttonText; handlePlaceOrder; buttonState }> = ({
  buttonText,
  handlePlaceOrder,
  buttonState
}) => (
  <BlackGradientBg>
    <div className={cn('w-full absolute flex items-center justify-center')}>
      <Button
        className={cn('min-w-[170px] !w-[90%] h-10 mb-2 disabled:opacity-80')}
        variant="default"
        colorScheme="blue"
        size="lg"
        onClick={() => handlePlaceOrder()}
        disabled={buttonState !== ButtonState.CanPlaceOrder}
      >
        <h4>{buttonText}</h4>
      </Button>
    </div>
  </BlackGradientBg>
)

const LeverageRatioTile: FC<{ sliderValue }> = ({ sliderValue }) => (
  <div className={cn('px-2.5 py-1')}>
    <div className={cn('h-8.75 flex items-center justify-between')}>
      <div className={cn('flex items-center')}>
        <img src={'/img/crypto/SOL.svg'} className={cn('h-6 mr-2 w-6')} />
        <InfoLabel> SOL-PERP </InfoLabel>
      </div>
      <div className="w-[43px] h-[23px]">
        <GradientButtonWithBorder radius={5} height={23}>
          <InfoLabel>
            <h5 className={'!dark:text-white mt-0.5'}> {sliderValue}x </h5>
          </InfoLabel>
        </GradientButtonWithBorder>
      </div>
    </div>
  </div>
)

const LongShortTitleLayout: FC<{ handleOrderSide: (string) => void }> = ({ handleOrderSide }) => {
  const { order } = useOrder()
  return (
    <div className={cn('flex items-center sm:p-[5px]')}>
      <div
        onClick={() => handleOrderSide('buy')}
        className={cn(`h-[35px] w-[50%] flex items-center duration-200 cursor-pointer rounded-[3px]
       justify-center ${order.side === 'buy' && 'bg-green-4'}`)}
      >
        <TitleLabel whiteText={order.side === 'buy'}> Long </TitleLabel>
      </div>
      <div
        onClick={() => handleOrderSide('sell')}
        className={cn(`h-[35px] w-[50%] flex items-center duration-200 cursor-pointer rounded-[3px]
      justify-center ${order.side === 'sell' && 'bg-red-1'}`)}
      >
        <TitleLabel whiteText={order.side === 'sell'}> Short </TitleLabel>
      </div>
    </div>
  )
}
const SELECTOR = styled.div`
  ${tw`w-[150px] h-[60px] rounded-tiny py-1 dark:bg-black-2 bg-white`}
  border: 1px solid ${({ theme }) => theme.text4};
  .selectorDropdown {
    ${tw`cursor-pointer`}
  }
  .selected {
    ${tw`dark:bg-black-1 bg-grey-5`}
    border: 1px solid ${({ theme }) => theme.borderForCard};
    > span {
      background: linear-gradient(92deg, #f7931a 0%, #ac1cc7 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
  > div {
    ${tw`flex items-center mb-1 w-11/12 mx-auto h-[22px] p-[5px]`}
    border: 1px solid ${({ theme }) => theme.bg20};
    > span {
      ${tw`text-regular font-semibold text-grey-1`}
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
        <div
          key={index}
          onClick={() => handleChange(item.display)}
          className={order.display === item.display ? 'selected selectorDropdown' : 'selectorDropdown'}
        >
          <span>{item.text}</span>
        </div>
      ))}
    </SELECTOR>
  )
}
