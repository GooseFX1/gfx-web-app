import React, { FC } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { Menu, Transition } from '@headlessui/react'

const WRAPPER = styled.div`
  ${tw`flex mx-1 mt-4`}
  .selected {
    background: linear-gradient(94deg, #f7931a 0%, #ac1cc7 100%);
  }
  .selected div {
    color: ${({ theme }) => theme.text4};
    background: linear-gradient(97deg, rgba(247, 147, 26, 0.3) 4.25%, rgba(172, 28, 199, 0.3) 97.61%);
  }
  .active-menu-item {
    background: linear-gradient(97deg, #f7931a 4.25%, #ac1cc7 97.61%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
  }

  .menu-item {
    text-align: center;
    width: 100%;
    background: ${({ theme }) => theme.themeToggleButton};
    color: #636363;
    font-weight: 600;
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
  selectedMenuItem: 'Deposits' | 'Trades' | 'Funding'
  setSelectedMenuItem: React.Dispatch<React.SetStateAction<'Deposits' | 'Trades' | 'Funding'>>
}
export const MobileNav: FC<SidebarProps> = ({ selected, setSelected, selectedMenuItem, setSelectedMenuItem }) => {
  const handleClick = (num: number) => {
    setSelected(num)
  }
  const handleMenuItemClick = (item: 'Deposits' | 'Trades' | 'Funding') => {
    setSelectedMenuItem(item)
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
      <div>
        <Menu>
          <Menu.Button className="relative" onClick={() => handleClick(1)}>
            <NAVITEMCONTAINER className={selected == 1 && 'selected'}>
              <NAVITEM>
                <img
                  src={selected == 1 ? '/img/assets/account-history-white.svg' : '/img/assets/account-history.svg'}
                  alt="account history icon"
                />
                History
                <img
                  src={
                    selected == 1 ? '/img/assets/arrow-circle-up.svg' : '/img/assets/arrow-circle-down-black.svg'
                  }
                  alt="dropdown icon"
                />
              </NAVITEM>
            </NAVITEMCONTAINER>
          </Menu.Button>
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items
              className="absolute flex flex-col border-solid
            border-1 border-grey-1 justify-center items-center w-full rounded-md"
            >
              <Menu.Item
                onClick={() => handleMenuItemClick('Deposits')}
                className={selectedMenuItem == 'Deposits' ? 'active-menu-item' : 'menu-item'}
              >
                <span>Deposits</span>
              </Menu.Item>
              <Menu.Item
                onClick={() => handleMenuItemClick('Trades')}
                className={selectedMenuItem == 'Trades' ? 'active-menu-item' : 'menu-item'}
              >
                <span>Trades</span>
              </Menu.Item>
              <Menu.Item
                onClick={() => handleMenuItemClick('Funding')}
                className={selectedMenuItem == 'Funding' ? 'active-menu-item' : 'menu-item'}
              >
                <span>Funding</span>
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </WRAPPER>
  )
}
