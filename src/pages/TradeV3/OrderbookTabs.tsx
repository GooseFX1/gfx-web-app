/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState } from 'react'
import type { RadioChangeEvent } from 'antd'
import { Radio, Tabs } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'
import { OrderBook } from './OrderBook'
import { useCrypto, useOrder, useOrderBook, usePriceFeed } from '../../context'
import { Loader } from '../../components'
import { getPerpsPrice } from './perps/utils'

const TAB_NAMES = [
  { display: 'Orderbook', key: 'orderbook' },
  { display: 'Recent Trades', key: 'trades' },
  { display: '', key: 'price' }
]

const WRAPPER = styled.div`
  ${tw`w-full flex flex-col h-full overflow-y-hidden`}
  background: ${({ theme }) => theme.bg2};
`

const HEADER_WRAPPER = styled.div`
  ${tw`w-full flex flex-row`}
  .tabGroup {
    ${tw`w-full flex`}
    //antd classes
    .ant-radio-button-wrapper-disabled {
      cursor: default;
      background: ${({ theme }) => theme.bg2} !important;
      color: ${({ theme }) => theme.text1} !important;
    }
    .ant-radio-button-wrapper-checked:not([class*=' ant-radio-button-wrapper-disabled']).ant-radio-button-wrapper {
      background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%) !important;
      position: relative;
      color: ${({ theme }) => theme.text1} !important;
      .ant-radio-button.ant-radio-button-checked {
        height: calc(100% - 2px);
        width: calc(100% - 2px);
        background: ${({ theme }) => theme.bg2};
        top: 1px;
        left: 1px;

        ${tw`flex justify-center items-center absolute`}
      }
    }
    .individualTabs {
      ${tw`w-5/12 text-center h-7 flex justify-center items-center`}
      color: ${({ theme }) => theme.text1} !important;
    }
    .activeTab {
      border: none;
    }
    .inactiveTab {
      //border: none;
    }
    .priceTab {
      ${tw`h-7 w-2/12 flex justify-center items-center text-xs`}
    }
  }
`
const BODY_WRAPPER = styled.div`
  ${tw`w-full flex flex-row h-full`}
`

export const OrderbookTabs: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'orderbook' | 'trades' | 'price'>('orderbook')
  const { prices, tokenInfo, refreshTokenData } = usePriceFeed()
  const { selectedCrypto } = useCrypto()
  const marketData = useMemo(() => prices[selectedCrypto.pair], [prices, selectedCrypto.pair])
  const { orderBook } = useOrderBook()
  const { setOrder, setFocused } = useOrder()
  const perpsPrice = useMemo(() => getPerpsPrice(orderBook), [orderBook])
  const onChange = (e) => {
    setSelectedTab(e.target.value)
  }
  const setOrderPrice = () => {
    setOrder((prevState) => ({ ...prevState, price: perpsPrice }))
    setFocused('price')
  }

  return (
    <WRAPPER>
      <HEADER_WRAPPER>
        <Radio.Group value={selectedTab} onChange={onChange} className="tabGroup">
          {TAB_NAMES.map((item) => (
            <Radio.Button
              key={item.key}
              value={item.key}
              className={
                (item.key !== 'price' ? 'individualTabs ' : 'priceTab ') +
                (item.key === selectedTab ? 'activeTab' : 'inactiveTab')
              }
              disabled={item.key === 'price'}
            >
              {item.key !== 'price' ? (
                item.display
              ) : !perpsPrice ? (
                ''
              ) : (
                <div onClick={setOrderPrice}>${perpsPrice}</div>
              )}
            </Radio.Button>
          ))}
        </Radio.Group>
      </HEADER_WRAPPER>
      <BODY_WRAPPER>{selectedTab === 'orderbook' ? <OrderBook /> : null}</BODY_WRAPPER>
    </WRAPPER>
  )
}
