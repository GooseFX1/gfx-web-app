import React, { FC, useState } from 'react'
import styled from 'styled-components'
import { Header } from './Header'
import { LimitPrice } from './LimitPrice'
import { PlaceOrder } from './PlaceOrder'
import { Size } from './Size'
import { Total } from './Total'
import { TypeSelector } from './TypeSelector'
import { useOrder } from '../../../context'

const CONTENT = styled.div<{ $display: boolean }>`
  position: relative;
  opacity: ${({ $display }) => ($display ? '1' : '0')};
  max-height: ${({ $display }) => ($display ? '1000px' : '0')};
  overflow: hidden;
  transition: all ${({ theme }) => theme.mainTransitionTime} ease-in-out;

  > div {
    &:first-child {
      margin: ${({ theme }) => theme.margins['3.5x']} 0 ${({ theme }) => theme.margins['1.5x']};
    }

    &:nth-child(2),
    &:nth-child(4) {
      margin-bottom: ${({ theme }) => theme.margins['1.5x']};
    }
  }
`

const WRAPPER = styled.div`
  margin: ${({ theme }) => theme.margins['3x']} 0;
  padding: ${({ theme }) => theme.margins['2x']} ${({ theme }) => theme.margins['2x']}
    ${({ theme }) => theme.margins['1.5x']};
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg3};
`

export const Order: FC = () => {
  const { order } = useOrder()
  const [arrowRotation, setArrowRotation] = useState(false)
  const [dropdownVisible, setDropdownVisible] = useState(false)

  return (
    <WRAPPER>
      <Header
        dropdownVisible={dropdownVisible}
        setArrowRotation={setArrowRotation}
        setDropdownVisible={setDropdownVisible}
      />
      <CONTENT $display={!order.isHidden}>
        <TypeSelector
          arrowRotation={arrowRotation}
          dropdownVisible={dropdownVisible}
          setArrowRotation={setArrowRotation}
          setDropdownVisible={setDropdownVisible}
        />
        <Size />
        <LimitPrice />
        <Total />
        <PlaceOrder />
      </CONTENT>
    </WRAPPER>
  )
}
