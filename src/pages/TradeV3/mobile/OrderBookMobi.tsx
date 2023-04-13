/* eslint-disable */
import { useMemo, useState } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { OrderBook } from '../OrderBook'

const WRAPPER = styled.div<{ $index: number }>`
  background: ${({ theme }) => theme.bg20};

  .header {
    ${tw`flex flex-row justify-around items-center h-[49px] relative`}
    border-bottom: ${({ theme }) => '1.5px solid ' + theme.tokenBorder};
  }
  .active {
    font-size: 15px;
    font-weight: 600;
    color: #eeeeee;
  }
  .inactive {
    font-size: 15px;
    font-weight: 500;
    color: #b5b5b5;
  }

  .tab {
    &:after {
      ${tw`absolute bottom-0 block h-[7px] w-[60px] rounded-t-circle`}
      content: '';
      left: ${({ $index }) => 50 * $index + 15}%;
      background: linear-gradient(94deg, #f7931a 0%, #ac1cc7 100%);
      transition: left 500ms ease-in-out;
    }
  }
`

export const OrderBookMobi = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0)

  return (
    <WRAPPER $index={selectedTab}>
      <div className="header">
        <div tw="absolute h-[5px] w-[34px] top-[7px] bg-[#636363] rounded-bigger"></div>
        <span className={selectedTab === 0 ? 'tab active' : 'tab inactive'} onClick={() => setSelectedTab(0)}>
          Orderbook
        </span>
        <span className={selectedTab === 1 ? 'active' : 'inactive'} onClick={() => setSelectedTab(1)}>
          Recent Trades
        </span>
      </div>
      {selectedTab === 0 ? <OrderBook /> : null}
    </WRAPPER>
  )
}
