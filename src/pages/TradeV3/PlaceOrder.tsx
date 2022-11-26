/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { useCrypto, useOrder, useOrderBook } from '../../context'
import { Input } from 'antd'

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
    div {
      ${tw`w-1/2 font-semibold text-center border border-solid h-full flex items-center justify-center`}
      border-color: #3c3c3c;
      color: #636363;
      &.selected {
        border-color: green; //change to gradient here
        color: white;
      }
    }
    div:first-child {
      border-bottom-left-radius: 14px;
    }
    div:nth-child(2) {
      border-bottom-right-radius: 14px;
    }
  }
`

const BODY = styled.div`
  ${tw``}
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
    ${tw`pb-1`}
  }
  img {
    height: 20px;
    width: 20px;
  }
  .suffixText {
    ${tw`text-xs font-medium`}
  }
  .ant-input {
    ${tw`text-left`}
  }
`

export const PlaceOrder: FC = () => {
  const { selectedCrypto, getAskSymbolFromPair, getBidSymbolFromPair } = useCrypto()
  const { order, setOrder } = useOrder()
  const symbol = useMemo(
    () => getAskSymbolFromPair(selectedCrypto.pair),
    [getAskSymbolFromPair, selectedCrypto.pair]
  )

  const bid = useMemo(() => getBidSymbolFromPair(selectedCrypto.pair), [getBidSymbolFromPair, selectedCrypto.pair])

  const handleOrderSide = (side) => {
    if (side !== order.side) setOrder((prevState) => ({ ...prevState, side }))
  }
  return (
    <WRAPPER>
      <HEADER>
        <div className="pairInfo">
          <div className="pairName">
            <img src={`/img/crypto/${symbol}.svg`} alt="" />
            SOL/USDC
          </div>
          {selectedCrypto.type !== 'crypto' ? <div className="pairLeverage">20x</div> : null}
        </div>
        <div className="orderSide">
          <div className={order.side === 'buy' ? 'selected' : ''} onClick={() => handleOrderSide('buy')}>
            Buy
          </div>
          <div className={order.side === 'sell' ? 'selected' : ''} onClick={() => handleOrderSide('sell')}>
            Sell
          </div>
        </div>
      </HEADER>
      <BODY>
        <INPUT_GRID_WRAPPER>
          <div className="inputRow">
            <INPUT_WRAPPER>
              <div className="label">Order Type</div>
              <Input />
            </INPUT_WRAPPER>
            <INPUT_WRAPPER>
              <div className="label">Price</div>
              <Input suffix={<span className="suffixText">{bid}</span>} pattern="\d+" placeholder={'0.00'} />
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
                pattern="\d+(\.\d+)?"
                placeholder={'0.00'}
              />
            </INPUT_WRAPPER>
            <INPUT_WRAPPER>
              <div className="label">Amount</div>
              <Input
                suffix={<span className="suffixText">{bid}</span>}
                pattern="\d+(\.\d+)?"
                placeholder={'0.00'}
              />
            </INPUT_WRAPPER>
          </div>
        </INPUT_GRID_WRAPPER>
      </BODY>
    </WRAPPER>
  )
}
