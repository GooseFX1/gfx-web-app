/* eslint-disable */
import { MouseEventHandler, useCallback, useEffect, useMemo, useState } from 'react'
import tw, { styled } from 'twin.macro'
import { Input, Checkbox, Slider, Drawer } from 'antd'
import {
  AVAILABLE_ORDERS,
  OrderType,
  useAccounts,
  useCrypto,
  useOrder,
  useTokenRegistry,
  OrderDisplayType,
  useDarkMode,
  useOrderBook,
  useWalletModal
} from '../../../context'
import { RotatingLoader } from '../../../components/RotatingLoader'
import { Picker } from '../Picker'
import { useWallet } from '@solana/wallet-adapter-react'
import useBlacklisted from '../../../utils/useBlacklisted'
import { useTraderConfig } from '../../../context/trader_risk_group'
import 'styled-components/macro'
import { Tooltip } from '../../../components'
import { TradeConfirmation } from '../TradeConfirmation'
import { PopupCustom } from '../../NFTs/Popup/PopupCustom'
import { Connect } from '../../../layouts'
import { removeFloatingPointError } from '../../../utils'
import { getPerpsPrice } from '../perps/utils'
import { getProfitAmount } from '../perps/utils'

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
  .orderSide {
    ${tw`w-full flex items-center justify-center`}
    .gradientBorder {
      ${tw`w-1/2 font-semibold text-center h-full flex items-center justify-center cursor-pointer`}
      border:none;
      color: #636363;
      background-color: #3c3c3c;
      border-radius: 32px;
      margin-right: 5px;
      &.selected {
        background: linear-gradient(94deg, #f7931a 0%, #ac1cc7 100%);
        padding: 2px;
        color: ${({ theme }) => theme.text1};
      }
      .holder {
        background: ${({ theme }) => theme.bg20};
        height: 100%;
        width: 100%;
        border-radius: 32px;
      }
      .overlayBorder {
        height: 100%;
        width: 100%;
        background: ${({ theme }) => theme.bg2};
        border-radius: 32px;
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
  .use-max {
    background: linear-gradient(94deg, #f7931a 0%, #ac1cc7 100%);
    padding: 2px;
    color: ${({ theme }) => theme.text1};
    margin-right: 20px;
    height: 40px;
    border-radius: 36px;
    width: 40%;
  }
  .white-bg {
    background: ${({ theme }) => theme.bg20};
    height: 100%;
    width: 100%;
    border-radius: 36px;
  }
  .use-max-holder {
    background: linear-gradient(94deg, rgba(247, 147, 26, 0.4) 0%, rgba(172, 28, 199, 0.4) 100%);
    height: 100%;
    width: 100%;
    border-radius: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ffffff;
    font-weight: 600;
    font-size: 15px;
  }
`

const INPUT_WRAPPER = styled.div<{ $rotateArrow: boolean }>`
  ${tw`flex justify-center items-start w-full flex-col h-full px-3`}
  .label {
    ${tw`pb-1 flex flex-row justify-evenly text-regular font-semibold dark:text-grey-2 text-grey-1`}
    > span {
      ${tw`text-regular font-semibold`}
      color: ${({ theme }) => theme.text37};
    }
  }
  .label2 {
    ${tw`pb-1`}
    > span {
      ${tw`text-regular font-semibold`}
      color: ${({ theme }) => theme.text37};
    }
  }
  .width2 {
    width: 100%;
  }
  .width {
    margin-left: -5%;
    width: 100%;
  }
  .space {
    width: 100%;
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
  .arrow-icon {
    ${({ $rotateArrow }) => $rotateArrow && 'transform: rotateZ(180deg);'}
    transition: transform 400ms ease-in-out;
  }
  .ant-input-affix-wrapper {
    ${tw`font-medium rounded-[5px] border border-solid h-[45px]`}
    background: ${({ theme }) => theme.bg20};
    border-color: ${({ theme }) => theme.tokenBorder};
  }
  .ant-input-affix-wrapper:not(.ant-input-affix-wrapper-disabled):hover {
    border-color: ${({ theme }) => theme.tokenBorder};
  }
  .ant-input-affix-wrapper:focus,
  .ant-input-affix-wrapper-focused {
    box-shadow: none;
  }
  .drawer {
    ${tw`w-full h-[45px] flex justify-between items-center px-2 font-semibold text-tiny rounded-[10px]`}
    color: ${({ theme }) => theme.text21};
    border: 1.5px solid ${({ theme }) => theme.text28};
    background: ${({ theme }) => theme.bg20};
  }
  .holder {
    ${tw`flex items-center justify-between w-full`}
  }
  // .focus-border {
  //   background: linear-gradient(94deg, #f7931a 0%, #ac1cc7 100%);
  //   border-radius: 5px;
  //   padding: 1px;
  // }
`
const TITLE = styled.span`
  font-size: 20px;
  font-weight: 600;
  background-image: -webkit-linear-gradient(0deg, #f7931a 0%, #ac1cc7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 30px;
  margin-left: 8px;
`

const SETTING_MODAL = styled(PopupCustom)`
  ${tw`!h-[392px] !w-11/12 rounded-bigger`}
  background-color: ${({ theme }) => theme.bg25};

  .ant-modal-header {
    ${tw`rounded-t-half rounded-tl-half rounded-tr-half px-[25px] pt-5 pb-0 border-b-0 mb-2.5`}
    background-color: ${({ theme }) => theme.bg25};
  }
  .ant-modal-content {
    ${tw`shadow-none`}
  }
  .ant-modal-body {
    ${tw`py-0 px-[25px]`}
  }
`

const LEVERAGE_WRAPPER = styled.div`
  ${tw`pl-[5px] w-[95%] text-left mt-[-8px]`}
  .ant-slider-rail {
    ${tw`h-[6px] dark:bg-[#262626] bg-grey-1`}
  }
  .ant-slider-with-marks {
    ${tw`mb-2`}
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
`

const ORDER_CATEGORY = styled.div`
  ${tw`flex justify-center items-center h-5`}
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
      ${tw`text-tiny font-semibold ml-2 dark:text-[#B5B5B5] text-[#636363]`}
    }
  }
`

const PLACE_ORDER_BUTTON = styled.button<{ $action: boolean; $orderSide: string; connected: boolean }>`
  ${tw`w-[95%] mt-3 rounded-[30px] h-[45px] text-tiny font-semibold border-0 border-none mx-auto block`}
  background: ${({ $action, $orderSide, $connected, theme }) =>
    $action ? ($orderSide === 'buy' ? '#71C25D' : '#F06565') : !$connected ? '#8d4cdd' : theme.bg23};
  color: ${({ $action, $connected }) => ($action || !$connected ? 'white' : '#636363')};
`

const SELECTOR = styled.div`
  > .selectorDropdown {
    ${tw`mb-7 ml-[75px]`}
    > span {
      ${tw`text-white text-regular font-semibold`}
    }
    > input[type='radio'] {
      ${tw`appearance-none absolute right-[80px] h-[30px] w-[30px] bg-black-1 rounded-circle cursor-pointer`}
    }
    > input[type='radio']:checked:after {
      ${tw`rounded-circle w-[24px] h-[24px] relative top-[3px] left-[3px] inline-block`}
      background: linear-gradient(92deg, #f7931a 0%, #ac1cc7 100%);
      content: '';
    }
  }
`
const TAKEPROFITSELECTOR = styled.div`
  ${tw`flex flex-row mb-6 mx-10`}
  > .active {
    ${tw`rounded-half text-white`}
    background: linear-gradient(92deg, #f7931a 0%, #ac1cc7 100%);
  }
  > .selectorDropdown {
    ${tw`w-1/4 text-center flex flex-row justify-center items-center h-10`}
    > input[type='radio'] {
      ${tw`appearance-none absolute right-[80px] h-[30px] w-[30px] bg-black-1 rounded-circle`}
    }
    > input[type='radio']:checked:after {
      ${tw`rounded-circle w-[24px] h-[24px] relative top-[3px] left-[3px] inline-block`}
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

const HEADER = styled.div`
  ${tw`flex items-center justify-center mb-6`}

  .cta {
    ${tw`rounded-bigger w-[120px] h-[35px] mr-[13px] cursor-pointer`}

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

    .background-container {
      ${tw`h-full w-full rounded-bigger`}
      background-color: ${({ theme }) => theme.text0};
    }
  }
  .disable {
  }
`

const TAKEPROFITWRAPPER = styled.div`
  ${tw`relative`}
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  /* Firefox */
  input[type='number'] {
    -moz-appearance: textfield;
  }
  > input {
    ${tw`bg-white dark:bg-black-1 dark:text-grey-5 text-black-4 p-3 text-regular font-semibold ml-10 w-4/5 h-[45px] rounded-[10px]`}
    outline: none;
    border: ${({ theme }) => '1.5px solid ' + theme.tokenBorder};
  }
  .selected-val {
    ${tw`dark:text-grey-5 text-black-4 text-average font-semibold text-center mb-7`}
  }
  .save-disable {
    ${tw`text-tiny text-grey-1 font-semibold absolute bottom-[15px] right-[50px] z-[100]`}
  }
  .save-enable {
    ${tw`text-tiny text-white font-semibold absolute bottom-[15px] right-[50px] z-[100]`}
  }
`

const TAKE_PROFIT_ARRAY = [
  {
    display: '25%',
    value: 0.25
  },
  {
    display: '50%',
    value: 0.5
  },
  {
    display: '75%',
    value: 0.75
  },
  {
    display: '100%',
    value: 1
  }
]

const TakeProfitStopLoss = ({ isTakeProfit, index, setIndex, input, setInput, setVisibility }) => {
  const percentArray = isTakeProfit ? ['25%', '50%', '75%', '100%'] : ['None', '10%', '25%', '75%']
  const [takeProfitAmt, setTakeProfitAmt] = useState<string>(null)
  const [takeProfitIndex, setTakeProfitIndex] = useState<number>(3)
  const [profits, setProfits] = useState<any>(['', '', '', ''])

  const { order } = useOrder()

  useEffect(() => {
    setTakeProfitIndex(index)
    setTakeProfitAmt(input)
  }, [])

  useEffect(() => {
    const obj = []
    TAKE_PROFIT_ARRAY.map((item) => {
      if (Number.isNaN(+order.price)) obj.push('')
      else {
        const profit = getProfitAmount(order.side, order.price, item.value)
        obj.push(profit.toFixed(2))
      }
    })
    setProfits(obj)
  }, [order])

  const isNumber = (e) => {
    const inputAmt = e.target.value.replace(/[^0-9]\./g, '')
    if (!inputAmt || inputAmt === '') setTakeProfitAmt(null)
    else if (!isNaN(inputAmt)) {
      if (isTakeProfit) {
        setTakeProfitAmt(inputAmt)
        setInput(+inputAmt)
        setTakeProfitIndex(null)
        setIndex(null)
      }
    }
  }

  const handleClicks = (index) => {
    setTakeProfitAmt(null)
    setInput(0)
    setIndex(index)
    setTakeProfitIndex(index)
    setVisibility(false)
  }

  const handleSave = () => {
    setTakeProfitAmt(null)
    setInput(null)
    setIndex(null)
    setTakeProfitIndex(null)
    setVisibility(false)
  }

  return (
    <TAKEPROFITWRAPPER>
      <div className="selected-val">
        <span>
          {takeProfitIndex !== null
            ? TAKE_PROFIT_ARRAY[takeProfitIndex].display
            : Number(takeProfitAmt) > 0
            ? '$' + takeProfitAmt
            : 'N/A'}
        </span>
        {!takeProfitAmt && (
          <span tw="!text-[#80CE00] ml-2">{profits[index] ? '($' + profits[index] + ')' : '(-)'}</span>
        )}
      </div>
      <TAKEPROFITSELECTOR>
        {TAKE_PROFIT_ARRAY.map((item, index) => (
          <div
            key={index}
            className={takeProfitIndex === index ? 'active selectorDropdown' : 'selectorDropdown'}
            onClick={() => handleClicks(index)}
          >
            <span tw="font-semibold text-regular dark:text-grey-5 text-black-4">{item.display}</span>
          </div>
        ))}
      </TAKEPROFITSELECTOR>
      <span tw="ml-10">Custom Price</span>
      <input value={takeProfitAmt} onChange={isNumber} placeholder="$0.00" type="number" />
      <span className={'save-enable'} onClick={handleSave}>
        Clear
      </span>
    </TAKEPROFITWRAPPER>
  )
}

export const PlaceOrderMobi = () => {
  const { order, setOrder, focused, setFocused, placeOrder } = useOrder()
  const { selectedCrypto, getSymbolFromPair, getAskSymbolFromPair, getBidSymbolFromPair, isSpot } = useCrypto()
  const { connect, connected, wallet, publicKey } = useWallet()
  const { getTokenInfoFromSymbol } = useTokenRegistry()
  const { setVisible: setModalVisible } = useWalletModal()
  const { traderInfo } = useTraderConfig()
  const bid = useMemo(() => getBidSymbolFromPair(selectedCrypto.pair), [getBidSymbolFromPair, selectedCrypto.pair])
  const { getUIAmount } = useAccounts()
  const [loading, setLoading] = useState<boolean>(false)
  const [selectedTotal, setSelectedTotal] = useState<number>(null)
  const { orderBook } = useOrderBook()
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false)
  const [showMarketDrawer, setShowMarketDrawer] = useState<boolean>(false)
  const [showProfitLossDrawer, setShowProfitLossDrawer] = useState<boolean>(false)
  const [drawerType, setDrawerType] = useState<number>(0)

  const [profitIndex, setProfitIndex] = useState<number>(null)
  const [profitPrice, setProfitPrice] = useState<number>(0)

  const elem = document.getElementById('dex-mobi-home')
  const { mode } = useDarkMode()
  const geoBlocked = useBlacklisted()

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

  const symbol = useMemo(
    () => getAskSymbolFromPair(selectedCrypto.pair),
    [getAskSymbolFromPair, selectedCrypto.pair]
  )

  const tokenInfo = useMemo(
    () => getTokenInfoFromSymbol(getSymbolFromPair(selectedCrypto.pair, order.side)),
    [getSymbolFromPair, getTokenInfoFromSymbol, order.side, selectedCrypto.pair]
  )

  const userBalance = useMemo(() => (tokenInfo ? getUIAmount(tokenInfo.address) : 0), [tokenInfo, getUIAmount])

  const getTokenSymbol = useMemo(
    () =>
      order.side === 'buy' ? getBidSymbolFromPair(selectedCrypto.pair) : getAskSymbolFromPair(selectedCrypto.pair),
    [order, selectedCrypto]
  )

  const maxQtyNum: number = useMemo(() => {
    const maxQty = Number(traderInfo.maxQuantity)
    if (Number.isNaN(maxQty)) return 0
    return maxQty
  }, [traderInfo.maxQuantity, order.size])

  const handlePlaceOrder = async () => {
    if (buttonState === ButtonState.CanPlaceOrder) {
      setLoading(true)
      setConfirmationModal(true)
      //await newOrder()
      setLoading(false)
    }
  }

  const handleWalletModal = useCallback(() => {
    if (!connected && !publicKey) {
      setModalVisible(true)
    }
  }, [setModalVisible, publicKey, connected])

  const displayedOrder = useMemo(
    () => AVAILABLE_ORDERS.find(({ display, side }) => display === order.display && side === order.side),
    [order.display, order.side]
  )

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
  }, [connected, wallet, buttonState, order.side, selectedCrypto.type])

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

  const getMarks = () => {
    const markObj = {}
    for (let i = 2; i <= 10; i = i + 2) {
      markObj[i] = <span className="markSpan">{i + 'x'}</span>
    }
    return markObj
  }

  const handleChange = (display: OrderDisplayType) => {
    setOrder((prevState) => ({ ...prevState, display }))
    setShowMarketDrawer(false)
  }

  const perpsBidBalance: number = useMemo(() => {
    if (!traderInfo || !traderInfo.balances || !traderInfo.traderRiskGroup) return 0
    const balanceBid = Number(traderInfo.marginAvailable)
    return balanceBid
  }, [traderInfo])

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

  const getTakeProfitParam = () => {
    if (profitIndex !== null) {
      const numPrice = +order.price
      if (Number.isNaN(numPrice)) return null

      const profitPrice =
        numPrice +
        (order.side === 'buy'
          ? TAKE_PROFIT_ARRAY[profitIndex].value * numPrice
          : -TAKE_PROFIT_ARRAY[profitIndex].value * numPrice)
      return profitPrice
    } else if (profitPrice > 0) {
      return profitPrice
    } else return null
  }

  return (
    <WRAPPER>
      {showMarketDrawer && (
        <Drawer
          title={null}
          placement="bottom"
          closable={false}
          key="bottom"
          open={true}
          getContainer={elem}
          height="182px"
        >
          <div tw="text-center text-average font-semibold dark:text-grey-2 text-black-4 mb-7">Order Type</div>
          <img
            src={`/img/assets/close-gray-icon.svg`}
            alt="close-icon"
            tw="absolute top-5 right-5"
            height="18px"
            width="18px"
            onClick={() => setShowMarketDrawer(false)}
          />
          <SELECTOR>
            {AVAILABLE_ORDERS.filter(({ side: x }) => x === order.side).map((item, index) => (
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
        </Drawer>
      )}
      {showProfitLossDrawer && (
        <Drawer
          title={null}
          placement="bottom"
          closable={false}
          key="bottom"
          open={true}
          getContainer={elem}
          height="276px"
          className="takep-stopl-container"
        >
          <HEADER>
            <div className={drawerType === 0 ? 'active cta' : 'cta'} onClick={() => setDrawerType(0)}>
              <div className={mode !== 'dark' ? 'white-background background-container' : 'background-container'}>
                <div className={drawerType === 0 ? 'gradient-bg btn' : 'btn'}>Take Profit</div>
              </div>
            </div>
            {/* <div className={drawerType === 1 ? 'active cta' : 'cta disable'} onClick={() => setDrawerType(0)}>
              <div className={mode !== 'dark' ? 'white-background background-container' : 'background-container'}>
                <div className={drawerType === 1 ? 'gradient-bg btn' : 'btn'}>Stop loss</div>
              </div>
            </div> */}
          </HEADER>
          <img
            src={`/img/assets/close-gray-icon.svg`}
            alt="close-icon"
            tw="absolute top-5 right-5"
            height="18px"
            width="18px"
            onClick={() => setShowProfitLossDrawer(false)}
          />
          <TakeProfitStopLoss
            isTakeProfit={drawerType === 0 ? true : false}
            index={profitIndex}
            setIndex={setProfitIndex}
            input={profitPrice}
            setInput={setProfitPrice}
            setVisibility={setShowProfitLossDrawer}
          />
        </Drawer>
      )}
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
            <TradeConfirmation setVisibility={setConfirmationModal} takeProfit={getTakeProfitParam()} />
          </SETTING_MODAL>
        </>
      )}
      <div tw="flex flex-row mb-3">
        <INPUT_WRAPPER $rotateArrow={showMarketDrawer}>
          <div className="drawer">
            <Tooltip color={mode === 'dark' ? '#EEEEEE' : '#1C1C1C'}>
              Limit order is executed only when the market reaches the amount you specify.{' '}
            </Tooltip>
            <div
              tw="text-regular font-semibold text-grey-5 w-1/2 text-center"
              onClick={() => setShowMarketDrawer(true)}
            >
              {displayedOrder?.text}
            </div>
            <img
              className="arrow-icon"
              src={`/img/assets/arrow-down.svg`}
              alt="arrow"
              onClick={() => setShowMarketDrawer(true)}
            />
          </div>
        </INPUT_WRAPPER>
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
      </div>
      <div tw="flex flex-row items-end mb-3">
        <INPUT_WRAPPER>
          <div className="label holder">
            <span>Size</span>
            <div>
              <span
                tw="mr-2.5 text-average font-semibold dark:text-grey-5 text-blue-1"
                onClick={() => {
                  handleClick(0.5)
                }}
              >
                Half
              </span>
              <span
                tw="text-average font-semibold dark:text-grey-5 text-blue-1"
                onClick={() => {
                  handleClick(0.999)
                }}
              >
                Max
              </span>
            </div>
          </div>
          <div className={focused === 'size' ? 'focus-border space' : 'space'}>
            <Input
              suffix={
                <>
                  <span className="suffixText">{symbol}</span>
                  <img src={`/img/crypto/${symbol}.svg`} alt="" />
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
        {!isSpot && (
          <INPUT_WRAPPER $rotateArrow={showProfitLossDrawer}>
            {/*<div className="label width">*/}
            <div className="label2 width2">
              <span tw="text-regular font-semibold text-grey-5 mr-1">Take Profit</span>
              {/*<span tw="text-regular font-semibold text-grey-5 mr-1">/</span>
              <span tw="text-regular font-semibold text-grey-5">Stop loss</span>*/}
            </div>
            <div className="drawer" onClick={() => setShowProfitLossDrawer(true)}>
              <span tw="text-regular font-semibold text-grey-5 mr-1">
                {profitIndex !== null
                  ? TAKE_PROFIT_ARRAY[profitIndex].display
                  : profitPrice > 0
                  ? '$' + profitPrice
                  : 'N/A'}
              </span>
              {/*<span tw="text-regular font-semibold text-grey-5 mr-1">/</span>
              <span tw="text-regular font-semibold text-grey-5">25%</span>*/}
              <img src={`/img/assets/arrow-down.svg`} className="arrow-icon" alt="arrow" />
            </div>
          </INPUT_WRAPPER>
        )}
      </div>
      <div tw="flex flex-row">
        <INPUT_WRAPPER>
          <span className="label">Price</span>
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
        <INPUT_WRAPPER>
          <span className="label">Amount</span>
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
      <LEVERAGE_WRAPPER>
        <div className="leverageText">Leverage</div>
        <div className="leverageBar">
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
        onClick={() => {
          buttonState === ButtonState.Connect ? handleWalletModal() : isSpot ? placeOrder() : handlePlaceOrder()
        }}
        $orderSide={order.side}
        $connected={connected}
      >
        {loading ? <RotatingLoader text="Placing Order" textSize={12} iconSize={18} /> : buttonText}
      </PLACE_ORDER_BUTTON>
      <div tw="flex flex-row justify-between my-2 mx-5">
        {isSpot ? (
          <>
            {' '}
            <span tw="text-regular font-semibold dark:text-grey-2">Available balance:</span>
            <span tw="text-regular font-semibold dark:text-grey-5">
              {userBalance && userBalance.toFixed(4)} {getTokenSymbol}
            </span>
          </>
        ) : (
          <>
            {' '}
            <span tw="text-regular font-semibold dark:text-grey-2">Available margin:</span>
            <span tw="text-regular font-semibold dark:text-grey-5">
              {Number(traderInfo.marginAvailable).toFixed(2)} $
            </span>
          </>
        )}
      </div>
    </WRAPPER>
  )
}
