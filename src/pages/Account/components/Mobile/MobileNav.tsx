import React, { FC } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'

const WRAPPER = styled.div`
  ${tw`flex mx-1 mt-4`}
  .selected {
    border: 1px solid linear-gradient(94deg, #f7931a 0%, #ac1cc7 100%);
  }
  .selected div {
    color: ${({ theme }) => theme.text4};
    background: linear-gradient(97deg, rgba(247, 147, 26, 0.3) 4.25%, rgba(172, 28, 199, 0.3) 97.61%);
  }
`

const NAVITEMCONTAINER = styled.div`
  ${tw`w-[190px] rounded-[5px] p-[1px]`}
  background: none;
`
const NAVITEM = styled.div`
  ${tw`flex items-center rounded-[5px] justify-center gap-1`}
  background: none;
  color: ${({ theme }) => theme.text17};
`

type SidebarProps = {
  selected: number
  setSelected: React.Dispatch<React.SetStateAction<number>>
}
export const MobileNav: FC<SidebarProps> = ({ selected, setSelected }) => {
  const handleClick = (num: number) => {
    setSelected(num)
  }
  return (
    <WRAPPER>
      <NAVITEMCONTAINER className={selected == 0 && 'selected'}>
        <NAVITEM onClick={() => handleClick(0)}>
          <img
            src={selected == 0 ? '/img/assets/account-overview.svg' : '/img/assets/account-overview-dark.svg'}
            alt="account overview icon"
          />
          Overview
        </NAVITEM>
      </NAVITEMCONTAINER>
      <NAVITEMCONTAINER className={selected == 1 && 'selected'}>
        <NAVITEM onClick={() => handleClick(1)}>
          <img
            src={selected == 1 ? '/img/assets/account-history-white.svg' : '/img/assets/account-history.svg'}
            alt="account history icon"
          />
          History
          <img
            src={selected == 1 ? '/img/assets/arrow-circle-up.svg' : '/img/assets/arrow-circle-down-black.svg'}
            alt="dropdown icon"
          />
        </NAVITEM>
      </NAVITEMCONTAINER>
    </WRAPPER>
  )
}
