import React, { Dispatch, FC, SetStateAction, useMemo, useState } from 'react'
import styled from 'styled-components'
import { ArrowDropdown, Tooltip } from '../../../components'
import { AVAILABLE_ORDERS, OrderDisplayType, OrderSide, useOrder } from '../../../context'
import { CenteredDiv, SpaceBetweenDiv, TRADE_ORDER_WIDTH } from '../../../styles'

const SELECTOR = styled(CenteredDiv)`
  flex-direction: column;
  width: ${({ theme }) => `calc(${TRADE_ORDER_WIDTH} - 2 * ${theme.margins['1x']})`};
  padding: ${({ theme }) => theme.margins['1.5x']} 0;
  ${({ theme }) => theme.smallBorderRadius}
  background-color: #131313;

  > span {
    ${({ theme }) => theme.flexCenter}
    width: 100%;
    padding: ${({ theme }) => theme.margins['1.5x']} 0;
    font-size: 12px;
    font-weight: bold;

    &:hover {
      background-color: #1f1f1f;
      cursor: pointer;
    }

    &:not(:last-child) {
      margin-bottom: ${({ theme }) => theme.margins['1.5x']};
    }
  }
`

const WRAPPER = styled(SpaceBetweenDiv)`
  padding: ${({ theme }) => theme.margins['1.5x']};
  ${({ theme }) => theme.smallBorderRadius}
  background-color: ${({ theme }) => theme.grey5};

  > span {
    font-size: 12px;
    font-weight: bold;
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
        offset={[20, 24]}
        onVisibleChange={handleClick}
        overlay={
          <Overlay setArrowRotation={setArrowRotation} setDropdownVisible={setDropdownVisible} side={order.side} />
        }
        visible={dropdownVisible}
      />
    </WRAPPER>
  )
}
