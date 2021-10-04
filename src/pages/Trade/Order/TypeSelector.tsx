import React, { Dispatch, FC, SetStateAction, useMemo } from 'react'
import styled from 'styled-components'
import { ArrowDropdown, Tooltip } from '../../../components'
import { AVAILABLE_ORDERS, OrderDisplayType, OrderSide, useOrder } from '../../../context'

const OVERLAY = styled.div`
  ${({ theme }) => theme.flexCenter}
  flex-direction: column;
  width: calc(265px - 2 * ${({ theme }) => theme.margins['1x']});
  padding: ${({ theme }) => theme.margins['1.5x']} 0;
  ${({ theme }) => theme.smallBorderRadius}
  background-color: ${({ theme }) => theme.grey5};

  > span {
    ${({ theme }) => theme.flexCenter}
    width: 100%;
    padding: ${({ theme }) => theme.margins['1.5x']} 0;
    font-size: 12px;
    font-weight: bold;

    &:hover {
      background-color: ${({ theme }) => theme.bg2};
      cursor: pointer;
    }

    &:not(:last-child) {
      margin-bottom: ${({ theme }) => theme.margins['1.5x']};
    }
  }
`

const WRAPPER = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.margins['1.5x']};
  ${({ theme }) => theme.smallBorderRadius}
  background-color: ${({ theme }) => theme.grey5};
  cursor: pointer;

  > span {
    font-size: 12px;
    font-weight: bold;
  }
`

const Overlay: FC<{
  setDropdownVisible: Dispatch<SetStateAction<boolean>>
  side: OrderSide
}> = ({ setDropdownVisible, side }) => {
  const { setOrder } = useOrder()

  const handleClick = (display: OrderDisplayType) => {
    setOrder((prevState) => ({ ...prevState, display }))
    setDropdownVisible(false)
  }

  return (
    <OVERLAY>
      {AVAILABLE_ORDERS.filter(({ side: x }) => x === side).map((order, index) => (
        <span key={index} onClick={() => handleClick(order.display)}>
          {order.text}
        </span>
      ))}
    </OVERLAY>
  )
}

export const TypeSelector: FC<{
  arrowRotation: boolean
  dropdownVisible: boolean
  setArrowRotation: Dispatch<SetStateAction<boolean>>
  setDropdownVisible: Dispatch<SetStateAction<boolean>>
}> = ({ arrowRotation, dropdownVisible, setArrowRotation, setDropdownVisible }) => {
  const { order } = useOrder()

  const displayedOrder = useMemo(
    () => AVAILABLE_ORDERS.find(({ display, side }) => display === order.display && side === order.side),
    [order.display, order.side]
  )

  const handleClick = () => {
    setArrowRotation(!arrowRotation)
    setDropdownVisible(!dropdownVisible)
  }

  return (
    <WRAPPER onClick={handleClick}>
      <Tooltip>{displayedOrder?.tooltip}</Tooltip>
      <span>{displayedOrder?.text}</span>
      <ArrowDropdown
        arrowRotation={arrowRotation}
        offset={[20, 24]}
        overlay={<Overlay setDropdownVisible={setDropdownVisible} side={order.side} />}
        visible={dropdownVisible}
      />
    </WRAPPER>
  )
}
