import React, { Dispatch, FC, SetStateAction, useCallback, useState } from 'react'
import styled from 'styled-components'
import { Menu, MenuItem } from '../../../layouts/App/shared'
import { ArrowDropdown } from '../../../components'

const WRAPPER = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  width: 140px;
  border: none;
  ${({ theme }) => theme.roundedBorders}
  padding: 0 ${({ theme }) => theme.margins['2x']};
  background-color: ${({ theme }) => theme.secondary2};
  cursor: pointer;

  span {
    font-weight: bold;
    color: white;
  }
`

const categories = [
  { name: 'All', icon: 'all' },
  { name: 'Art', icon: 'art' },
  { name: 'Defi', icon: 'defi' },
  { name: 'Domains', icon: 'domains' },
  { name: 'Games', icon: 'games' },
  { name: 'Memes', icon: 'memes' },
  { name: 'Metaverse', icon: 'metaverse' },
  { name: 'Music', icon: 'music' },
  { name: 'Photography', icon: 'photography' },
  { name: 'Punks', icon: 'punks' },
  { name: 'Sports', icon: 'sports' },
  { name: 'Verified', icon: 'verified' },
  { name: 'Unverified', icon: 'unverified' }
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
    <Menu>
      {categories.map((item) => (
        <MenuItem onClick={() => handleClick(item.name)}>
          <span>{item.name}</span>
          <img src={`${process.env.PUBLIC_URL}/img/assets/${item.icon}.svg`} alt="disconnect" />
        </MenuItem>
      ))}
    </Menu>
  )
}

export const Categories: FC = () => {
  const [arrowRotation, setArrowRotation] = useState(false)
  const [currentTitle, setCurrentTitle] = useState(categories[0].name)
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const handleClick = () => {
    setArrowRotation(!arrowRotation)
    setDropdownVisible(!dropdownVisible)
  }

  return (
    <WRAPPER onClick={handleClick}>
      <span>{currentTitle}</span>
      <ArrowDropdown
        arrowRotation={arrowRotation}
        offset={[9, 30]}
        onVisibleChange={handleClick}
        overlay={
          <Overlay
            setArrowRotation={setArrowRotation}
            setCurrentTitle={setCurrentTitle}
            setDropdownVisible={setDropdownVisible}
          />
        }
        visible={dropdownVisible}
      />
    </WRAPPER>
  )
}
