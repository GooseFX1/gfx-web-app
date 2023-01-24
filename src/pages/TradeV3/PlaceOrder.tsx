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
import { Checkbox } from 'antd'
import { useWallet } from '@solana/wallet-adapter-react'
import { ArrowDropdown, Tooltip } from '../../components'
import { useTraderConfig } from '../../context/trader_risk_group'
import { displayFractional } from './perps/utils'
import { PopupCustom } from '../NFTs/Popup/PopupCustom'
import { TradeConfirmation } from './TradeConfirmation'
import { PerpsEndModal } from './PerpsEndModal'
import 'styled-components/macro'

enum ButtonState {
  Connect = 0,
  CanPlaceOrder = 1,
  NullAmount = 2,
  BalanceExceeded = 3,
  CreateAccount = 4
}

const WRAPPER = styled.div`
  ${tw`h-full w-full overflow-y-hidden`}
  border: ${({ theme }) => '1px solid ' + theme.tokenBorder};
  border-bottom-width: 0;
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
        height: 20px;
        width: 20px;
        margin-right: 10px;
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
        //border-color: green; //change to gradient here
        background: linear-gradient(55.89deg, #f7931a 21.49%, #ac1cc7 88.89%);
        color: ${({ theme }) => theme.text1};
      }
      .overlayBorder {
        height: calc(100% - 2px);
        width: calc(100% - 2px);
        background: ${({ theme }) => theme.bg2};
        ${tw`flex justify-center items-center`}
      }
    }
    .gradientBorder:first-child {
      border-bottom-left-radius: 14px;
      .overlayBorder.buy {
        border-bottom-left-radius: 14px;
      }
    }
    .gradientBorder:nth-child(2) {
      border-bottom-right-radius: 14px;
      .overlayBorder.sell {
        border-bottom-right-radius: 14px;
      }
    }
  }
`

const BODY = styled.div`
  ${tw`text-center`}
  height: calc(100% - 65px);
`

const INPUT_GRID_WRAPPER = styled.div`
  ${tw`flex justify-center items-center flex-col py-2`}
  .inputRow {
    ${tw`flex justify-between items-center w-full h-16`}
  }
`

const INPUT_WRAPPER = styled.div`
  ${tw`flex justify-center items-start w-full flex-col h-full px-3`}
  .label {
    ${tw`pb-1 text-tiny font-semibold`}
    color: ${({ theme }) => theme.text29};
  }
  img {
    height: 20px;
    width: 20px;
  }
  .suffixText {
    ${tw`text-tiny font-semibold`}
    color: ${({ theme }) => theme.text29};
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
    font-semibold text-tiny border border-solid rounded-[5px]`}
    color: ${({ theme }) => theme.text21};
    border-color: ${({ theme }) => theme.tokenBorder};
    background: ${({ theme }) => theme.bg2};
  }
  .dropdownContainer.lite {
    .arrow-icon {
      filter: invert(28%) sepia(88%) saturate(1781%) hue-rotate(230deg) brightness(99%) contrast(105%);
    }
  }
`

const TOTAL_SELECTOR = styled.div`
  ${tw`flex mt-[3px] justify-between items-center px-3`}
  .valueSelector {
    ${tw`cursor-pointer flex justify-center items-center rounded-[36px] w-14 h-[30px] text-tiny 
    text-gray-2 font-semibold`}
    background: ${({ theme }) => theme.bg23};
    &.selected {
      background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
      color: ${({ theme }) => theme.text0};
    }
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
      ${tw`text-tiny font-semibold ml-2 text-gray-2`}
    }
  }
`

const PLACE_ORDER_BUTTON = styled.button<{ $action: boolean; $orderSide: string }>`
  ${tw`w-11/12 mt-3 rounded-[30px] h-[30px] text-tiny font-semibold border-0 border-none`}
  background: ${({ $action, $orderSide, theme }) =>
    $action ? ($orderSide === 'buy' ? '#71C25D' : '#F06565') : theme.bg23};
  color: ${({ $action }) => ($action ? 'white' : '#636363')};
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
  background: -webkit-linear-gradient(92deg, #f7931a 0%, #ac1cc7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  line-height: 30px;
  margin-left: 8px;
`

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
    value: 1,
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
  const { getUIAmount, balances } = useAccounts()
  const { selectedCrypto, getSymbolFromPair, getAskSymbolFromPair, getBidSymbolFromPair, isSpot } = useCrypto()
  const { order, setOrder, setFocused, placeOrder } = useOrder()
  const { newOrder, traderInfo } = useTraderConfig()
  const [selectedTotal, setSelectedTotal] = useState<number>(null)
  const [arrowRotation, setArrowRotation] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const [confirmationModal, setConfirmationModal] = useState<boolean>(false)
  const [perpsEndModal, setPerpsEndModal] = useState<boolean>(false)
  const { getTokenInfoFromSymbol } = useTokenRegistry()
  const { connected } = useWallet()
  const { mode } = useDarkMode()

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
    const balanceBid = Number(displayFractional(traderInfo?.traderRiskGroup.cashBalance))
    return balanceBid
  }, [traderInfo])

  const perpsAskBalance: number = useMemo(() => {
    if (!traderInfo || !traderInfo.balances || !traderInfo.balances[0] || !traderInfo.traderRiskGroup) return 0
    const balanceAsk = Math.abs(Number(traderInfo.balances[0].balance))
    return balanceAsk
  }, [traderInfo])

  const buttonState = useMemo(() => {
    if (isSpot) {
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
      const balanceBid = Number(displayFractional(traderInfo?.traderRiskGroup.cashBalance))
      if (order.side === 'buy' && order.total > perpsBidBalance) return ButtonState.BalanceExceeded
      if (order.side === 'sell' && order.size > perpsAskBalance) return ButtonState.BalanceExceeded
      return ButtonState.CanPlaceOrder
    }
  }, [connected, selectedCrypto.pair, order, isSpot, traderInfo])

  const buttonText = useMemo(() => {
    if (buttonState === ButtonState.BalanceExceeded) return 'Insufficient Balance'
    else if (buttonState === ButtonState.Connect) return 'Connect Wallet'
    else if (buttonState === ButtonState.CreateAccount) return 'Create Account!'
    if (order.side === 'buy') return 'BUY ' + symbol
    else return 'SELL ' + symbol
  }, [buttonState, order.side])

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
      const finalValue =
        order.side === 'buy'
          ? removeFloatingPointError(value * +perpsBidBalance)
          : removeFloatingPointError(value * +perpsAskBalance)
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
    }
  }

  const handleDropdownClick = () => {
    setArrowRotation(!arrowRotation)
    setDropdownVisible(!dropdownVisible)
  }
  return (
    <WRAPPER>
      <HEADER>
        {perpsEndModal && (
          <>
            <END_MODAL
              visible={true}
              centered={true}
              footer={null}
              title={
                <span tw="dark:text-grey-5 text-black-4 text-[25px] font-semibold mb-4.5">
                  Fortune Favours The Bold!
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
              <PerpsEndModal />
            </END_MODAL>
          </>
        )}
        {confirmationModal && (
          <>
            <SETTING_MODAL
              visible={true}
              centered={true}
              footer={null}
              title={
                <>
                  <span tw="dark:text-grey-5 text-black-4 text-[25px] font-semibold">Market Long</span>
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
              <TradeConfirmation />
            </SETTING_MODAL>
          </>
        )}
        <div className="pairInfo">
          <div className="pairName">
            <img src={`/img/crypto/${symbol}.svg`} alt="" />
            {symbol + '/' + bid}
          </div>
          {selectedCrypto.type !== 'crypto' ? <div className="pairLeverage">20x</div> : null}
        </div>
        <div className="orderSide">
          <div
            className={order.side === 'buy' ? 'selected gradientBorder' : 'gradientBorder'}
            onClick={() => handleOrderSide('buy')}
          >
            <div className="overlayBorder buy">Buy</div>
          </div>
          <div
            className={order.side === 'sell' ? 'selected gradientBorder' : 'gradientBorder'}
            onClick={() => handleOrderSide('sell')}
          >
            <div className="overlayBorder sell">Sell</div>
          </div>
        </div>
      </HEADER>
      <BODY>
        <INPUT_GRID_WRAPPER>
          <div className="inputRow">
            <INPUT_WRAPPER>
              <div className="label">Order Type</div>
              <div className={`dropdownContainer ${mode}`}>
                <div>{displayedOrder?.text}</div>
                <ArrowDropdown
                  arrowRotation={arrowRotation}
                  offset={[-125, 15]}
                  onVisibleChange={handleDropdownClick}
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
              <Input
                suffix={<span className="suffixText">{bid}</span>}
                onFocus={() => setFocused('price')}
                maxLength={15}
                onBlur={() => setFocused(undefined)}
                value={order.price ? order.price : ''}
                onChange={(e) => numberCheck(e.target.value, 'price')}
                placeholder={'0.00'}
              />
            </INPUT_WRAPPER>
          </div>
          <div className="inputRow">
            <INPUT_WRAPPER>
              <div className="label">Size</div>
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
            </INPUT_WRAPPER>
            <INPUT_WRAPPER>
              <div className="label">Amount</div>
              <Input
                suffix={<span className="suffixText">{bid}</span>}
                onFocus={() => setFocused('total')}
                maxLength={15}
                onBlur={() => setFocused(undefined)}
                value={order.total ? order.total : ''}
                onChange={(e) => numberCheck(e.target.value, 'total')}
                placeholder={'0.00'}
              />
            </INPUT_WRAPPER>
          </div>
        </INPUT_GRID_WRAPPER>
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
          onClick={() => (isSpot ? placeOrder() : newOrder())}
          $orderSide={order.side}
        >
          {buttonText}
        </PLACE_ORDER_BUTTON>
        <FEES>
          <Tooltip color={mode === 'dark' ? '#EEEEEE' : '#1C1C1C'}>
            Solana network fee, is the fee you pay in order to make transaction over the solana blockchain.
          </Tooltip>
          <span>SOL network fee: ~ 0.03</span>
        </FEES>
      </BODY>
    </WRAPPER>
  )
}

const SELECTOR = styled.div`
  ${tw`bg-black-4 dark:bg-[#555555] w-[160px] h-16 rounded-[5px] pt-2 pb-3 pl-2.5`}
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
        <div key={index}>
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
