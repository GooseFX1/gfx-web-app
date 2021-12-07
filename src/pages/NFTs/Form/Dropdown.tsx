import React, { Dispatch, FC, SetStateAction, useCallback, useState } from 'react'
import styled from 'styled-components'
import { Menu, MenuItem } from '../../../layouts/App/shared'
import { ArrowDropdown } from '../../../components'

const WRAPPER = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  width: 195px;
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
const STYLED_MENU = styled(Menu)`
  min-width: 195px;
  ${({ theme }) => theme.largeBorderRadius}
  background-color: #131313;
  padding: ${({ theme }) => theme.margins['4x']} ${({ theme }) => theme.margins['3.5x']};
  li {
    margin-bottom: ${({ theme }) => theme.margins['2x']};
    padding-bottom: 0 !important;
    &:last-child {
      margin-bottom: 0 !important;
    }
  }
`

const Overlay: FC<{
  setArrowRotation: Dispatch<SetStateAction<boolean>>
  setCurrentTitle: Dispatch<SetStateAction<string>>
  setDropdownVisible: Dispatch<SetStateAction<boolean>>
  days: any
}> = ({ setArrowRotation, setCurrentTitle, setDropdownVisible, days }) => {
  const handleClick = useCallback(
    (name: string) => {
      setArrowRotation(false)
      setCurrentTitle(name)
      setDropdownVisible(false)
    },
    [setArrowRotation, setCurrentTitle, setDropdownVisible]
  )

  return (
    <STYLED_MENU>
      {days.map((item) => (
        <MenuItem onClick={() => handleClick(item.name)}>
          <span>{item.name}</span>
        </MenuItem>
      ))}
    </STYLED_MENU>
  )
}

type DropdownProps = {
  days: any
}

export const Dropdown = ({ days }: DropdownProps) => {
  const [arrowRotation, setArrowRotation] = useState(false)
  const [currentTitle, setCurrentTitle] = useState(days[0].name)
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
            days={days}
          />
        }
        visible={dropdownVisible}
      />
    </WRAPPER>
  )
}
