import React, { FC } from 'react'
import styled from 'styled-components'
import { ArrowClicker } from '../../components'
import { ButtonWrapper } from './NFTButton'

const NormalButton = styled(ButtonWrapper)`
  justify-content: center;
  background-color: ${({ theme }) => theme.darkButton};
  width: 132px;
  height: 50px;
`

const DropDownButton = styled(ButtonWrapper)`
  justify-content: space-between;
  background-color: ${({ theme }) => theme.secondary2};
  width: 132px;
  height: 50px;
`

interface HeaderButtonProps {
  title: string
  isDropDown?: boolean
}

const HeaderButton: FC<HeaderButtonProps> = ({ title, isDropDown }: HeaderButtonProps) => {
  return isDropDown ? (
    <DropDownButton>
      <span>{title}</span>
      <ArrowClicker />
    </DropDownButton>
  ) : (
    <NormalButton>
      <span>{title}</span>
    </NormalButton>
  )
}

export default HeaderButton
