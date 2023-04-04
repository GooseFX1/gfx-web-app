/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useMemo, useState } from 'react'
import type { RadioChangeEvent } from 'antd'
import { Radio, Tabs } from 'antd'
import { OrderBook } from './OrderBook'
import { useCrypto, useOrder, useOrderBook, usePriceFeed } from '../../context'
import { Loader } from '../../components'
import { getPerpsPrice } from './perps/utils'
import tw, { styled } from 'twin.macro'

const TAB_NAMES = [
  { display: 'Orderbook', key: 'orderbook' },
  { display: 'Recent Trades', key: 'trades' }
  //{ display: '', key: 'price' }
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
    .ant-radio-button-wrapper:last-child {
      border-radius: 0 !important;
    }
    .ant-radio-button-wrapper-checked:not([class*=' ant-radio-button-wrapper-disabled']).ant-radio-button-wrapper {
      position: relative;
      color: ${({ theme }) => theme.text1} !important;
      .ant-radio-button.ant-radio-button-checked {
        //top: 1px;
        //left: 1px;

        ${tw`flex justify-center items-center absolute`}
      }
    }
    .individualTabs {
      ${tw`w-full text-center h-full flex justify-center items-center dark:text-[#B5B5B5] text-[#636363]`}
      background: ${({ theme }) => theme.bg20} !important;
    }
    .activeTab {
      border: none;
      .ant-radio-button-checked {
        background: linear-gradient(94deg, rgba(247, 147, 26, 0.4) 0%, rgba(172, 28, 199, 0.4) 100%);
      }
    }
    .inactiveTab {
      ${tw`h-full !bg-grey-5 dark:!bg-black-1`}
      border: 1px solid ${({ theme }) => theme.tokenBorder};
    }
    .priceTab {
      ${tw`h-7 w-2/12 flex justify-center items-center text-xs`}
    }
    .container {
      ${tw`h-8 w-full pt-px`}
    }
    .active-field {
      ${tw`p-[2px]`}
      background: linear-gradient(94deg, #f7931a 0%, #ac1cc7 100%);
    }
  }
`
const BODY_WRAPPER = styled.div`
  ${tw`w-full flex flex-row h-full border-[1px] border-solid dark:border-[#3c3c3c] border-[#CACACA]`}
  border-top: none;
`
const FOOTER_WRAPPER = styled.div`
  ${tw`w-full flex flex-row h-7 border-[1px] border-solid dark:border-[#3c3c3c] border-[#CACACA]`}
  border-top: none;
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
          {TAB_NAMES.map((item, index) => (
            <div className={'container ' + (item.key === selectedTab ? 'active-field' : '')} key={index}>
              <Radio.Button
                key={item.key}
                value={item.key}
                className={'individualTabs ' + (item.key === selectedTab ? 'activeTab' : 'inactiveTab')}
                disabled={item.key === 'price'}
              >
                {item.display}
              </Radio.Button>
            </div>
          ))}
        </Radio.Group>
      </HEADER_WRAPPER>
      <BODY_WRAPPER>{selectedTab === 'orderbook' ? <OrderBook /> : null}</BODY_WRAPPER>
      {/*<FOOTER_WRAPPER>Hello</FOOTER_WRAPPER>*/}
    </WRAPPER>
  )
}
