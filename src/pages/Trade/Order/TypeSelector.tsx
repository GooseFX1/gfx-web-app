import React, { Dispatch, FC, SetStateAction, useEffect, useState } from 'react'
import styled from 'styled-components'
import { ArrowDropdown, Tooltip } from '../../../components'
import { AVAILABLE_ORDERS, IOrder, OrderSide, useOrder } from '../../../context'

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

  const handleClick = (order: IOrder) => {
    setOrder(order)
    setDropdownVisible(false)
  }

  return (
    <OVERLAY>
      {AVAILABLE_ORDERS.filter(({ side: x }) => x === side).map((order, index) => (
        <span key={index} onClick={() => handleClick(order)}>{order.text}</span>
      ))}
    </OVERLAY>
  )
}

export const TypeSelector: FC = () => {
  const { order, setOrder } = useOrder()
  const [arrowRotation, setArrowRotation] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)

  // @ts-ignore
  useEffect(() => setOrder(AVAILABLE_ORDERS.find(({ side }) => order.side === side)), [order.side, setOrder])

  const handleClick = () => {
    setDropdownVisible(!dropdownVisible)
    setArrowRotation(!arrowRotation)
  }

  return (
    <WRAPPER onClick={handleClick}>
      <Tooltip>{order.tooltip}</Tooltip>
      <span>{order.text}</span>
      <ArrowDropdown
        arrowRotation={arrowRotation}
        offset={[20, 24]}
        overlay={<Overlay setDropdownVisible={setDropdownVisible} side={order.side} />}
        visible={dropdownVisible}
      />
    </WRAPPER>
  )
}
