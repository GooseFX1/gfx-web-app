import { FC, useState } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { OrderBook } from '../OrderBook'

const WRAPPER = styled.div<{ $index: number }>`
  background: ${({ theme }) => theme.bg20};
  position: absolute;
  top: 85%;
  height: 25%;
  width: 100%;
  z-index: 100;
  border-radius: 25px 25px 0px 0px;
  transition: top 500ms ease-in-out;
  overflow: hidden;
  -ms-overflow-style: none;
  scrollbar-width: none;

  .header {
    ${tw`flex flex-row justify-around items-center h-[49px] relative`}
    border-bottom: ${({ theme }) => '1.5px solid ' + theme.tokenBorder};
  }
  .active {
    ${tw`font-semibold text-regular dark:text-grey-5 text-black-4`}
  }
  .inactive {
    ${tw`font-medium text-regular dark:text-grey-2 text-grey-1`}
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
  ::-webkit-scrollbar {
    display: none;
  }
`
const SLIDER = styled.div<{ $rotateArrow: boolean }>`
  ${tw`absolute h-5 w-1/5 top-0 rounded-b-average flex flex-row justify-center 
    items-center left-[38%] border-[1.5px] border-t-0 border-white border-solid`}
  background: linear-gradient(94deg, #f7931a 0%, #ac1cc7 100%);
  .arrow-icon {
    ${({ $rotateArrow }) => $rotateArrow && 'transform: rotateZ(180deg);'}
    transition: transform 400ms ease-in-out;
  }
`

export const OrderBookMobi: FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [isScrollUp, setIsScrollUp] = useState<boolean>(true)

  const handleOrderbookScroll = () => {
    const orderbookContainer = document.getElementById('orderbook-wrapper')
    if (isScrollUp === true) {
      orderbookContainer.style.top = '160px'
      orderbookContainer.style.overflow = 'scroll'
      orderbookContainer.style.height = 'calc(100% - 130px)'
    } else {
      orderbookContainer.style.top = '85%'
      orderbookContainer.style.overflow = 'hidden'
      setTimeout(() => {
        orderbookContainer.style.height = '25%'
      }, 500)
    }
    setIsScrollUp((prev) => !prev)
  }

  return (
    <WRAPPER $index={selectedTab} id="orderbook-wrapper">
      <div className="header">
        <SLIDER $rotateArrow={isScrollUp} onClick={handleOrderbookScroll}>
          <img className="arrow-icon" src="/img/assets/arrow-down.svg" alt="arrow" width="20px" height="10px" />
        </SLIDER>
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
