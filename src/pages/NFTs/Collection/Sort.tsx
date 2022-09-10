import { Dispatch, FC, SetStateAction, useCallback, useState } from 'react'
import styled from 'styled-components'
import { Menu, MenuItem } from '../../../layouts/App/shared'
import { ArrowDropdown } from '../../../components'

const WRAPPER = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  height: 40px;
  width: 100px;
  border: none;
  ${({ theme }) => theme.roundedBorders}
  padding: 0 ${({ theme }) => theme.margin(2)};
  background-color: ${({ theme }) => theme.secondary2};

  span {
    font-weight: bold;
    color: white;
    cursor: pointer;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  > div {
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
`
const MENU = styled(Menu)`
  position: relative;
  background-color: ${({ theme }) => theme.bg2};
  border-radius: 10px;
  padding: ${({ theme }) => theme.margin(2)} ${({ theme }) => theme.margin(3)};
  min-width: 120px;

  &:before {
    border-right-color: transparent;
    border-bottom-color: transparent;
    border-top-color: ${({ theme }) => theme.text2};
    border-left-color: ${({ theme }) => theme.text2};
    top: -5px;
    right: 28px;
    position: absolute;
    z-index: 1;
    display: none;
    width: 10px;
    height: 10px;
    background: transparent;
    border-style: solid;
    border-width: 5px;
    transform: rotate(45deg);
    content: '';
  }
`

const MENU_ITEM = styled(MenuItem)`
  display: block;
  width: 100%;
  text-align: center;

  &li {
    padding-bottom: ${({ theme }) => theme.margin(1.25)};
  }

  > span {
    font-size: 11px;
    text-transform: none;
  }
`

const sorts = [
  { title: 'Price: high to low' },
  { title: 'Price: low to high' },
  { title: 'Ending soon' },
  { title: 'Recently listed' },
  { title: 'Recently sold' },
  { title: 'Charity' }
]

const Overlay: FC<{
  setArrowRotation: Dispatch<SetStateAction<boolean>>
  setCurrentTitle: Dispatch<SetStateAction<string>>
  setDropdownVisible: Dispatch<SetStateAction<boolean>>
}> = ({ setArrowRotation, setCurrentTitle, setDropdownVisible }) => {
  const handleClick = useCallback(
    (name: string) => {
      setArrowRotation(false)
      setCurrentTitle(name)
      setDropdownVisible(false)
    },
    [setArrowRotation, setCurrentTitle, setDropdownVisible]
  )

  return (
    <MENU>
      {sorts.map((item, index) => (
        <MENU_ITEM onClick={() => handleClick(item.title)} key={index}>
          <span>{item.title}</span>
        </MENU_ITEM>
      ))}
    </MENU>
  )
}

export const Sort: FC = () => {
  const [arrowRotation, setArrowRotation] = useState(false)
  const [currentTitle, setCurrentTitle] = useState('Sort by')
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const handleClick = () => {
    setArrowRotation(!arrowRotation)
    setDropdownVisible(!dropdownVisible)
  }

  return (
    <WRAPPER>
      <ArrowDropdown
        arrowRotation={arrowRotation}
        offset={[0, 20]}
        onVisibleChange={handleClick}
        overlay={
          <Overlay
            setArrowRotation={setArrowRotation}
            setCurrentTitle={setCurrentTitle}
            setDropdownVisible={setDropdownVisible}
          />
        }
        visible={dropdownVisible}
        placement="bottomCenter"
      >
        <span>{currentTitle}</span>
      </ArrowDropdown>
    </WRAPPER>
  )
}
