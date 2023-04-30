import { FC, useState } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'
import { OrderBook } from '../OrderBook'
import useWindowSize from '../../../utils/useWindowSize'

const WRAPPER = styled.div<{ $index: number; $height: number }>`
  background: ${({ theme }) => theme.bg20};
  position: absolute;
  top: ${({ $height }) => ($height >= 820 ? '85' : '90')}%;
  width: 100%;
  height: 25%;
  border-radius: 25px 25px 0px 0px;
  -webkit-transition: top 500ms ease-out;
  -moz-transition: top 500ms ease-out;
  -o-transition: top 500ms ease-out;
  -ms-transition: top 500ms ease-out;
  transition: top 500ms ease-out;
  overflow: hidden;

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
`

export const OrderBookMobi: FC = () => {
  const [selectedTab, setSelectedTab] = useState<number>(0)
  const [isScollUp, setIsScollUp] = useState<boolean>(true)
  const [initial, setInitial] = useState<number>(0)
  const { height } = useWindowSize()
  const orderbookContainer = document.getElementById('orderbook-wrapper')

  const hanldeObScrollStart = (e) => {
    setInitial(e.touches[0].clientY)
  }

  const handleObScroll = (e) => {
    const finalTouch = e.touches[0].clientY
    if (Math.abs(initial - finalTouch) >= 25 && isScollUp) {
      orderbookContainer.style.top = '160px'
      orderbookContainer.style.height = 'calc(100% - 100px)'
      //setIsScollUp(false)
    } else if (Math.abs(initial - finalTouch) >= 25 && !isScollUp) {
      if (height >= 820) orderbookContainer.style.top = '85%'
      else orderbookContainer.style.top = '90%'
      setTimeout(() => {
        orderbookContainer.style.height = '25%'
      }, 500)
      //setIsScollUp(true)
    }
  }

  const handleObScrollEnd = () => {
    setIsScollUp(!isScollUp)
  }

  return (
    <WRAPPER $index={selectedTab} $height={height} id="orderbook-wrapper">
      <div className="header">
        <div
          tw="absolute h-[35px] w-[70px] top-[7px]"
          onTouchStart={(e) => {
            hanldeObScrollStart(e)
          }}
          onTouchMove={(e) => {
            handleObScroll(e)
          }}
          onTouchEnd={handleObScrollEnd}
        >
          <div tw="h-[5px] w-[34px] bg-[#636363] rounded-bigger mx-auto"></div>
        </div>
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
