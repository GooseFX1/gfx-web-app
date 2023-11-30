import { FC, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'

const WRAPPER = styled.div`
  ${tw`flex flex-col px-5  w-36`}
  border-right: 1px solid #3C3C3C;
  height: calc(100vh - 52px);
  div {
    opacity: 0;
    transform: translateY(20px);
    visibility: hidden;
    transition: opacity 0.5s, transform 0.5s, visibility 0s 0.5s;
  }
  .show-history {
    opacity: 1;
    transform: translateY(0);
    visibility: visible;
    transition: opacity 0.5s, transform 0.5s, visibility 0s;
  }
`

const SPAN = styled.span`
  ${tw`w-full flex text-[#636363] text-tiny`}
  padding-left: 5px;
  margin-top: 15px;
  padding: 4.5px 6px;
  font-size: 13px;
  gap: 5px;
  &:hover {
    cursor: pointer;
    /* border-radius: 5px; */
    /* padding-right: 6px; */
    /* border: 1px solid #f7931a; */
    /* background: linear-gradient(97deg, rgba(247, 147, 26, 0.3) 4.25%, rgba(172, 28, 199, 0.3) 97.61%); */
    /* color: #fff; */
  }
  &.selected {
    border-radius: 5px;
    border: 1px solid #f7931a;
    background: linear-gradient(97deg, rgba(247, 147, 26, 0.3) 4.25%, rgba(172, 28, 199, 0.3) 97.61%);
    color: #fff;
  }
  &.history-selected {
    border-radius: 5px;
    color: #fff;
  }
`

type SidebarProps = {
  selected: number
  setSelected: React.Dispatch<React.SetStateAction<number>>
}
const Sidebar: FC<SidebarProps> = ({ selected, setSelected }) => {
  const [historySelected, setHistorySelected] = useState(false)
  const handleClick = (num: number) => {
    setSelected(num)
  }
  const handleHistoryClick = () => {
    setHistorySelected(!historySelected)
  }
  return (
    <WRAPPER>
      <SPAN className={selected == 0 && 'selected'} onClick={() => handleClick(0)}>
        <img
          src={selected == 0 ? '/img/assets/account-overview.svg' : '/img/assets/account-overview-dark.svg'}
          alt="account overview icon"
        />
        Overview
      </SPAN>
      <SPAN className={historySelected && 'history-selected'} onClick={handleHistoryClick}>
        <img
          src={historySelected ? '/img/assets/account-history-white.svg' : '/img/assets/account-history.svg'}
          alt="account history icon"
        />
        History
        <img
          src={historySelected ? '/img/assets/arrow-circle-up.svg' : '/img/assets/arrow-circle-down-black.svg'}
          alt="dropdown icon"
        />
      </SPAN>
      <div className={historySelected && 'show-history'}>
        <SPAN className={selected == 2 && 'selected'} onClick={() => handleClick(2)}>
          Deposits
        </SPAN>
        <SPAN className={selected == 3 && 'selected'} onClick={() => handleClick(3)}>
          Trades
        </SPAN>
        <SPAN className={selected == 4 && 'selected'} onClick={() => handleClick(4)}>
          Funding
        </SPAN>
        {/* <SPAN className={selected == 5 && 'selected'} onClick={() => handleClick(5)}> */}
        {/*   Liquidations */}
        {/* </SPAN> */}
      </div>
    </WRAPPER>
  )
}

export default Sidebar
