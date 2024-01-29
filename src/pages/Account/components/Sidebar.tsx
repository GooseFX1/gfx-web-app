import { FC } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { useDarkMode } from '../../../context'

const WRAPPER = styled.div`
  ${tw`flex flex-col px-5  w-36`}
  border-right: 1px solid #3C3C3C;
  color: ${({ theme }) => theme.text2};
  height: calc(100vh - 52px);
`

const SPAN = styled.span`
  ${tw`w-full flex  text-tiny`}
  padding-left: 5px;
  margin-top: 15px;
  padding: 4.5px 6px;
  font-size: 13px;
  gap: 5px;
  &:hover {
    cursor: pointer;
  }
  &.selected {
    border-radius: 5px;
    border: 1px solid #f7931a;
    background: linear-gradient(97deg, rgba(247, 147, 26, 0.3) 4.25%, rgba(172, 28, 199, 0.3) 97.61%);
  }
  img:last-child {
    height: 16px;
    width: 16px;
  }
  .svg-to-grey {
    filter: invert(70%);
  }
`

type SidebarProps = {
  selected: number
  setSelected: React.Dispatch<React.SetStateAction<number>>
}
const Sidebar: FC<SidebarProps> = ({ selected, setSelected }) => {
  const handleClick = (num: number) => {
    setSelected(num)
  }
  const { mode } = useDarkMode()
  return (
    <WRAPPER>
      <SPAN className={selected == 0 ? 'selected' : undefined} onClick={() => handleClick(0)}>
        <img
          src={mode != 'lite' ? '/img/assets/account-overview.svg' : '/img/assets/account-overview-dark.svg'}
          alt="account overview icon"
        />
        Overview
      </SPAN>
      <div>
        <SPAN className={selected == 2 ? 'selected' : undefined} onClick={() => handleClick(2)}>
          Deposits
        </SPAN>
        <SPAN className={selected == 3 ? 'selected' : undefined} onClick={() => handleClick(3)}>
          Trades
        </SPAN>
        <SPAN className={selected == 4 ? 'selected' : undefined} onClick={() => handleClick(4)}>
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
