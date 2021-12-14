import React, { Dispatch, FC, SetStateAction, useCallback, useState } from 'react'
import styled from 'styled-components'
import { Menu, MenuItem } from '../layouts/App/shared'
import { ArrowDropdown } from '../components'

const WRAPPER = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  width: 150px;
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

type CategoryItem = {
  name: string
  icon: string
}

const Overlay: FC<{
  setArrowRotation: Dispatch<SetStateAction<boolean>>
  setCurrentTitle: Dispatch<SetStateAction<string>>
  setDropdownVisible: Dispatch<SetStateAction<boolean>>
  categories: Array<CategoryItem>
}> = ({ setArrowRotation, setCurrentTitle, setDropdownVisible, categories }) => {
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

export const Categories: FC<{
  categories: CategoryItem[]
  [x: string]: any
}> = ({ categories, ...rest }) => {
  const [arrowRotation, setArrowRotation] = useState(false)
  const [currentTitle, setCurrentTitle] = useState(categories[0]?.name)
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const handleClick = () => {
    setArrowRotation(!arrowRotation)
    setDropdownVisible(!dropdownVisible)
  }

  return (
    <WRAPPER onClick={handleClick} {...rest}>
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
            categories={categories}
          />
        }
        visible={dropdownVisible}
      />
    </WRAPPER>
  )
}
