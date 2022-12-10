import React, { Dispatch, FC, SetStateAction, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ArrowDropdown, Tooltip } from '../../../components'
import { AVAILABLE_ORDERS, OrderDisplayType, OrderSide, useOrder } from '../../../context'
import { CenteredDiv, SpaceBetweenDiv } from '../../../styles'

const SELECTOR = styled(CenteredDiv)`
  flex-direction: column;
  width: 150px;
  padding: ${({ theme }) => theme.margin(1.5)} 0;
  ${({ theme }) => theme.smallBorderRadius};
  background-color: ${({ theme }) => theme.bg15};
  > span {
    ${({ theme }) => theme.flexCenter}
    width: 100%;
    padding: ${({ theme }) => theme.margin(1.5)} 0;
    font-size: 12px;
    font-weight: bold;
    &:hover {
      background-color: #1f1f1f;
      cursor: pointer;
    }
    &:not(:last-child) {
      margin-bottom: ${({ theme }) => theme.margin(1.5)};
    }
  }
`

const WRAPPER = styled(SpaceBetweenDiv)`
  padding: ${({ theme }) => theme.margin(1.5)};
  ${({ theme }) => theme.smallBorderRadius}
  background-color: ${({ theme }) => theme.bg15};
  height: 50px;
  > span {
    font-size: 12px;
    font-weight: bold;
    color: #e7e7e7;
  }
  img {
    height: 20px;
    width: 20px;
  }
`

const Overlay: FC<{
  setArrowRotation: Dispatch<SetStateAction<boolean>>
  setDropdownVisible: Dispatch<SetStateAction<boolean>>
  side: OrderSide
}> = ({ setArrowRotation, setDropdownVisible, side }) => {
  const { setOrder } = useOrder()

  const handleClick = (display: OrderDisplayType) => {
    setOrder((prevState) => ({ ...prevState, display }))
    setArrowRotation(false)
    setDropdownVisible(false)
  }

  return (
    <SELECTOR>
      {AVAILABLE_ORDERS.filter(({ side: x }) => x === side).map((order, index) => (
        <span key={index} onClick={() => handleClick(order.display)}>
          {order.text}
        </span>
      ))}
    </SELECTOR>
  )
}

export const TypeSelector: FC = () => {
  const { order } = useOrder()
  const [arrowRotation, setArrowRotation] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)

  const displayedOrder = useMemo(
    () => AVAILABLE_ORDERS.find(({ display, side }) => display === order.display && side === order.side),
    [order.display, order.side]
  )

  const handleClick = () => {
    setArrowRotation(!arrowRotation)
    setDropdownVisible(!dropdownVisible)
  }

  return (
    <WRAPPER>
      <Tooltip dark>{displayedOrder?.tooltip}</Tooltip>
      <span>{displayedOrder?.text}</span>
      <ArrowDropdown
        arrowRotation={arrowRotation}
        offset={[10, 20]}
        onVisibleChange={handleClick}
        overlay={
          <Overlay setArrowRotation={setArrowRotation} setDropdownVisible={setDropdownVisible} side={order.side} />
        }
        visible={dropdownVisible}
      />
    </WRAPPER>
  )
}
