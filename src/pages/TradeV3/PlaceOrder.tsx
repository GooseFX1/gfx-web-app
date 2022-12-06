/* eslint-disable arrow-body-style */
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
  useTokenRegistry
} from '../../context'
import { Input } from 'antd'
import { removeFloatingPointError } from '../../utils'
import { Checkbox } from 'antd'
import { useWallet } from '@solana/wallet-adapter-react'
import { ArrowDropdown } from '../../components'

enum ButtonState {
  Connect = 0,
  CanPlaceOrder = 1,
  NullAmount = 2,
  BalanceExceeded = 3
}

const WRAPPER = styled.div`
  ${tw`h-full w-full border-solid border`}
  border-color: #3c3c3c;
`

const HEADER = styled.div`
  ${tw`h-16 w-full flex flex-col items-center`}

  .pairInfo {
    ${tw`h-1/2 w-full flex justify-between px-2.5 border-solid border-b items-center text-base font-semibold`}
    border-top:none;
    border-left: none;
    border-right: none;
    border-color: #3c3c3c;
    .pairName {
      img {
        height: 20px;
        width: 20px;
        margin-right: 10px;
      }
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
        color: white;
      }
      .overlayBorder {
        height: calc(100% - 2px);
        width: calc(100% - 2px);
        background-color: #131313;
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
  ${tw`flex justify-center items-center flex-col py-3.5`}
  .inputRow {
    ${tw`flex justify-between items-center w-full h-16`}
  }
`

const INPUT_WRAPPER = styled.div`
  ${tw`flex justify-center items-start w-full flex-col h-full px-3`}
  .label {
    ${tw`pb-1 text-[15px]`}
    color: #B5B5B5;
  }
  img {
    height: 20px;
    width: 20px;
  }
  .suffixText {
    ${tw`text-xs font-medium`}
  }
  .ant-input {
    ${tw`text-left font-medium`}
  }
  .ant-input-affix-wrapper {
    ${tw`font-medium h-12`}
    border-radius: 0px;
    background-color: #1c1c1c;
    border: 1px solid #3c3c3c;
  }
  .dropdownContainer {
    ${tw`w-full h-12 flex justify-between items-center px-2`}
    border: 1px solid #3c3c3c;
    background-color: #1c1c1c;
    .ant-dropdown-trigger {
      ${tw`w-full flex justify-end`}
    }
  }
`

const TOTAL_SELECTOR = styled.div`
  ${tw`flex mt-2.5 justify-between items-center px-3`}
  .valueSelector {
    ${tw`cursor-pointer flex justify-center items-center rounded-[36px] w-14 h-[30px] text-xs font-semibold`}
    background-color: #1c1c1c;
    &.selected {
      background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
    }
  }
`

const ORDER_CATEGORY = styled.div`
  ${tw`flex justify-center items-center mt-6`}
  .orderCategoryCheckboxWrapper {
    ${tw`mx-3 flex items-center justify-center`}
    .ant-checkbox-wrapper {
      .ant-checkbox-inner {
        height: 20px;
        width: 20px;
        border-radius: 4px;
      }
    }
    .ant-checkbox-checked .ant-checkbox-inner {
      background-color: #5855ff;
    }
    .orderCategoryName {
      ${tw`text-[15px] font-semibold ml-2`}
      color: #636363;
    }
  }
`

const PLACE_ORDER_BUTTON = styled.button<{ $action: boolean }>`
  ${tw`w-11/12 mt-6 rounded-[30px] h-[30px] text-xs font-semibold`}
  border: none;
  background: ${({ $action }) =>
    $action ? 'linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%)' : '#1C1C1C'};
  color: ${({ $action }) => ($action ? 'white' : '#636363')};
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
  const { selectedCrypto, getSymbolFromPair, getAskSymbolFromPair, getBidSymbolFromPair } = useCrypto()
  const { order, setOrder, setFocused } = useOrder()
  const [selectedTotal, setSelectedTotal] = useState<number>(null)
  const [arrowRotation, setArrowRotation] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)
  const { getTokenInfoFromSymbol } = useTokenRegistry()
  const { connected } = useWallet()

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

  const buttonState = useMemo(() => {
    if (!connected) return ButtonState.Connect
    if (order.total > userBalance) return ButtonState.BalanceExceeded
    if (!order.price || !order.total || !order.size) return ButtonState.NullAmount
    return ButtonState.CanPlaceOrder
  }, [connected, selectedCrypto.pair, order])

  const buttonText = useMemo(() => {
    if (buttonState === ButtonState.BalanceExceeded) return 'Insufficient Balance'
    else if (buttonState === ButtonState.Connect) return 'Connect Wallet'
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
    const total = removeFloatingPointError(value * userBalance)
    if (total) {
      setSelectedTotal(value)
      setFocused('total')
      setOrder((prev) => ({ ...prev, total }))
    } else if (!total && value === 0) {
      setSelectedTotal(value)
      setFocused('total')
      setOrder((prev) => ({ ...prev, total: 0 }))
    }
  }

  const handleDropdownClick = () => {
    setArrowRotation(!arrowRotation)
    setDropdownVisible(!dropdownVisible)
  }
  return (
    <WRAPPER>
      <HEADER>
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
              <div className="dropdownContainer">
                <div>{displayedOrder?.text}</div>
                <ArrowDropdown
                  arrowRotation={arrowRotation}
                  offset={[20, 24]}
                  onVisibleChange={handleDropdownClick}
                  overlay={
                    <Overlay
                      setArrowRotation={setArrowRotation}
                      setDropdownVisible={setDropdownVisible}
                      side={order.side}
                    />
                  }
                  visible={dropdownVisible}
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
        <PLACE_ORDER_BUTTON $action={buttonState === ButtonState.CanPlaceOrder}>{buttonText}</PLACE_ORDER_BUTTON>
      </BODY>
    </WRAPPER>
  )
}

const SELECTOR = styled.div`
  width: 100%;
  flex-direction: column;
  padding: ${({ theme }) => theme.margin(1.5)} 0;
  ${({ theme }) => theme.smallBorderRadius};
  background-color: ${({ theme }) => theme.bg15};
  > span {
    ${({ theme }) => theme.flexCenter}
    width: 100%;
    padding: ${({ theme }) => theme.margin(1.5)} 0;
    font-size: 12px;
    font-weight: bold;
    &:hover {
      background-color: #1f1f1f;
      cursor: pointer;
    }
    &:not(:last-child) {
      margin-bottom: ${({ theme }) => theme.margin(1.5)};
    }
  }
`

const Overlay: FC<{
  setArrowRotation: Dispatch<SetStateAction<boolean>>
  setDropdownVisible: Dispatch<SetStateAction<boolean>>
  side: OrderSide
}> = ({ setArrowRotation, setDropdownVisible, side }) => {
  const { setOrder } = useOrder()

  const handleClick = (display: OrderDisplayType) => {
    setOrder((prevState) => ({ ...prevState, display }))
    setArrowRotation(false)
    setDropdownVisible(false)
  }

  return (
    <SELECTOR>
      {AVAILABLE_ORDERS.filter(({ side: x }) => x === side).map((order, index) => (
        <span key={index} onClick={() => handleClick(order.display)}>
          {order.text}
        </span>
      ))}
    </SELECTOR>
  )
}
