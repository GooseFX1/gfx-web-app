import React, { Dispatch, FC, SetStateAction, useCallback, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Menu, MenuItem } from '../layouts/App/shared'
import { ArrowDropdown } from '../components'
import { SVGDynamicReverseMode } from '../styles'

const WRAPPER = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 45px;
  width: 150px;
  border: none;
  ${({ theme }) => theme.roundedBorders}
  padding: 0 ${({ theme }) => theme.margin(2)};
  background-color: ${({ theme }) => theme.secondary2};
  cursor: pointer;

  span {
    font-weight: bold;
    color: white;
  }
`

const STYLED_POOL_MENU = styled(Menu)`
  &.dot-menu {
    min-width: 251px;
    background-color: #1e1e1e;
    padding: ${({ theme }) => theme.margin(4.5)} ${({ theme }) => theme.margin(2.5)};
    li {
      padding-bottom: 25px;
      display: flex;
      span {
        font-family: Avenir;
        font-size: 15px;
        font-weight: 900;
        color: #fff;
      }
      .black-dot {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background-color: #0f0f0f;
        display: flex;
        align-items: center;
      }

      .green-dot {
        width: 12px;
        height: 12px;
        margin: 0 auto;
        border-radius: 50%;
        background-color: #50bb35;
        display: block;
      }
    }
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
  currentTitle?: string
  type?: string
  onChange?: (val: any) => void
}> = ({ setArrowRotation, setCurrentTitle, setDropdownVisible, categories, currentTitle, type, onChange }) => {
  const handleClick = useCallback(
    (name: string) => {
      setArrowRotation(false)
      setCurrentTitle(name)
      setDropdownVisible(false)
      onChange && onChange(name)
    },
    [onChange, setArrowRotation, setCurrentTitle, setDropdownVisible]
  )
  return (
    <STYLED_POOL_MENU className={`${type === 'dot' ? 'dot-menu' : ''}`}>
      {categories.map((item, index) => (
        <MenuItem
          onClick={() => handleClick(item.name)}
          className={`${currentTitle === item.name ? 'active' : ''}`}
          key={index}
        >
          <span>{item.name}</span>
          {type !== 'dot' ? (
            <SVGDynamicReverseMode src={`/img/assets/${item.icon}.svg`} alt="disconnect" />
          ) : (
            <span className="black-dot">{currentTitle === item.name && <span className="green-dot"></span>}</span>
          )}
        </MenuItem>
      ))}
    </STYLED_POOL_MENU>
  )
}

export const Categories: FC<{
  categories: CategoryItem[]
  type?: string
  chosenCategory?: string
  [x: string]: any
  onChange?: (title: string) => void
}> = ({ categories, type, onChange, chosenCategory, ...rest }) => {
  const [arrowRotation, setArrowRotation] = useState(false)
  const [currentTitle, setCurrentTitle] = useState(chosenCategory || categories[0]?.name)
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const handleClick = () => {
    setArrowRotation(!arrowRotation)
    setDropdownVisible(!dropdownVisible)
  }

  useEffect(() => {
    setCurrentTitle(chosenCategory || categories[0]?.name)
  }, [chosenCategory])

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
            currentTitle={currentTitle}
            type={type}
            onChange={onChange}
          />
        }
        visible={dropdownVisible}
      />
    </WRAPPER>
  )
}
