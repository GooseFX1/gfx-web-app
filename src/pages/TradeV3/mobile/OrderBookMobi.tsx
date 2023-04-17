/* eslint-disable */
import { useEffect, useMemo, useState } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { OrderBook } from '../OrderBook'

const WRAPPER = styled.div<{ $index: number }>`
  background: ${({ theme }) => theme.bg20};
  top: 500px; //do not remove
  height: 100vh;

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
  const [isScollUp, setIsScollUp] = useState<boolean>(true)
  const [initial, setInitial] = useState<number>(0)

  // const handleOrderbookScroll = (e) => {
  //   document.addEventListener('mousemove', eleMouseMove, false)
  //   //console.log(e)
  // }

  // function eleMouseMove(ev) {
  //   console.log('ev', ev)
  //   const ele = document.getElementById('orderbook-wrapper')
  //   const pY = ev.pageY
  //   console.log(pY)

  //   ele.style.top = pY + 'px'

  //   document.addEventListener('mouseup', eleMouseUp, false)
  //   // test = pY;
  //   // console.log("test after py:", test)

  //   var test2 = pY.toString()
  //   test2 = test2 + 'px'
  //   ele.style.height = test2
  // }

  // function eleMouseUp() {
  //   console.log('elemouseup called')
  //   document.removeEventListener('mousemove', eleMouseMove, false)
  //   document.removeEventListener('mouseup', eleMouseUp, false)
  // }

  const handleOrderbookScroll = (e) => {
    //console.log(e.pageY)
    if (initial === 0) {
      setInitial(e.pageY)
    }
    setIsScollUp((prev) => !prev)
    const orderbookContainer = document.getElementById('orderbook-wrapper')
    orderbookContainer.style.width = '100%'
    orderbookContainer.style.zIndex = '100'
    orderbookContainer.style.transition = 'top 400ms ease-in-out'
    if (initial === 0 || isScollUp === true) {
      orderbookContainer.style.position = 'absolute'
      orderbookContainer.style.height = 'calc(100% - 160px)'
      orderbookContainer.style.top = '160px'
    } else {
      orderbookContainer.style.height = '100vh'
      orderbookContainer.style.top = initial + 'px'
      orderbookContainer.style.position = 'fixed'
    }
  }

  return (
    <WRAPPER $index={selectedTab} id="orderbook-wrapper">
      <div className="header">
        {
          <div
            tw="absolute h-[5px] w-[34px] top-[7px] bg-[#636363] rounded-bigger"
            onClick={(e) => {
              handleOrderbookScroll(e)
            }}
          ></div>
        }
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
