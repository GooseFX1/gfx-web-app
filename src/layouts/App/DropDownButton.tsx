import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { Menu, MenuItem } from './shared'
import { ArrowDropdown } from '../../components'
import { MainText } from '../../styles'

// TODO: refactor this component and '../../components/Categories.tsx' into one component
const DROP_DOWN_WRAPPER = MainText(styled.button`
  ${({ theme }) => theme.flexCenter}
  height: ${({ theme }) => theme.margin(5)};
  border: none;
  ${({ theme }) => theme.roundedBorders}
  padding: 0 ${({ theme }) => theme.margin(2)};
  background-color: ${({ theme }) => theme.textBox};
  span {
    font-size: 12px;
    font-weight: bold;
    color: white;
    cursor: pointer;
  }
  .ant-dropdown-arrow {
    display: none;
  }
`)

type listItem = { displayName: string; value: string; icon: string }

const Overlay: FC<{
  onOptionClick: (currentOption: listItem) => void
  options: Array<listItem>
  folder: string
}> = ({ onOptionClick, options, folder }) => (
  <Menu>
    {options.map((item, index) => (
      <MenuItem onClick={() => onOptionClick(item)} key={index}>
        <span>{item.displayName}</span>
        <img src={`/img/${folder}/${item.icon}.svg`} alt="icon" />
      </MenuItem>
    ))}
  </Menu>
)

const DropdownButton: FC<{
  title: string
  handleSelect: (selectedOption: string) => void
  options: Array<listItem>
  style?: any
  className?: string
  folder: string
}> = ({ title, handleSelect, options, style, className, folder = 'assets' }) => {
  const [arrowRotation, setArrowRotation] = useState(false)
  const [currentTitle, setCurrentTitle] = useState(title)

  const onOptionClick = (item: listItem) => {
    setArrowRotation(false)
    setCurrentTitle(item.displayName)
    handleSelect(item.value)
  }

  return (
    <DROP_DOWN_WRAPPER style={style} className={className}>
      <span>{currentTitle}</span>
      <ArrowDropdown
        arrow
        arrowRotation={arrowRotation}
        offset={[20, 10]}
        onVisibleChange={() => {
          //empty function that needs to be filled
        }}
        overlay={<Overlay options={options} onOptionClick={onOptionClick} folder={folder} />}
        setArrowRotation={setArrowRotation}
      />
    </DROP_DOWN_WRAPPER>
  )
}

export default DropdownButton
