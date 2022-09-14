import React, { Dispatch, FC, SetStateAction, useCallback, useState } from 'react'
import styled from 'styled-components'
import { DatePicker } from 'antd'
import { Menu, MenuItem } from '../../../layouts/App/shared'
import { ArrowDropdown } from '../../../components'
import { OverlayConsumer } from '../../../context/overlay'
import { useDarkMode } from '../../../context'

const WRAPPER = styled.button`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  width: 195px;
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
const STYLED_MENU = styled(Menu)`
  min-width: 195px;
  ${({ theme }) => theme.largeBorderRadius}
  background-color: #131313;
  padding: ${({ theme }) => theme.margin(4)} ${({ theme }) => theme.margin(3.5)};
  li {
    margin-bottom: ${({ theme }) => theme.margin(2)};
    padding-bottom: 0 !important;
    > span {
      color: #fff;
    }
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
  open: boolean
  setOpen: (val: boolean) => void
  doOverlay: (val: boolean) => void
}> = ({ setArrowRotation, setCurrentTitle, setDropdownVisible, days, setOpen, doOverlay }) => {
  const handleClick = useCallback(
    (name: string) => {
      setArrowRotation(false)
      setCurrentTitle(name)
      setDropdownVisible(false)
    },
    [setArrowRotation, setCurrentTitle, setDropdownVisible]
  )

  const onClickItem = ({ index, name }) => {
    if (index === 4) {
      setOpen(true)
      doOverlay(true)
    } else {
      handleClick(name)
      setOpen(false)
    }
  }

  return (
    <STYLED_MENU>
      {days.map((item, index) => (
        <MenuItem onClick={() => onClickItem({ index, name: item?.name })} key={index}>
          <span>{item.name}</span>
        </MenuItem>
      ))}
    </STYLED_MENU>
  )
}

const STYLED_DROPDOWN = styled.div`
  position: relative;
  .date-picker-custom {
    height: 50px !important;
    width: 195px;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: 0;
    opacity: 0;
  }
`

type DropdownProps = {
  days: any
}

export const Dropdown = ({ days }: DropdownProps) => {
  const { mode } = useDarkMode()
  const [arrowRotation, setArrowRotation] = useState(false)
  const [currentTitle, setCurrentTitle] = useState(days[0].name)
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const handleClick = () => {
    setArrowRotation(!arrowRotation)
    setDropdownVisible(!dropdownVisible)
  }

  const [open, setOpen] = useState(false)

  const onOk = ({ value, doOverlay }) => {
    setCurrentTitle(value.format('YYYY-MM-DD HH:mm'))
    setOpen(false)
    doOverlay(false)
  }

  return (
    <OverlayConsumer>
      {({ doOverlay }) => (
        <STYLED_DROPDOWN>
          {open && (
            <DatePicker
              className="date-picker-custom"
              dropdownClassName={mode === 'lite' ? 'light-date-pick-popup' : ''}
              open={open}
              showTime
              format="YYYY-MM-DD HH:mm"
              onOk={(value) => onOk({ value, doOverlay })}
            />
          )}
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
                  open={open}
                  setOpen={setOpen}
                  doOverlay={doOverlay}
                />
              }
              visible={dropdownVisible}
            />
          </WRAPPER>
        </STYLED_DROPDOWN>
      )}
    </OverlayConsumer>
  )
}
