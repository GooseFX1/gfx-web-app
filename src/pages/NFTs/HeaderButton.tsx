import React, { FC } from 'react'
import styled from 'styled-components'
import { ArrowClicker } from '../../components'
import { ButtonWrapper } from './NFTButton'

const NORMAL_BUTTON = styled(ButtonWrapper)`
  justify-content: center;
  background-color: ${({ theme }) => theme.darkButton};
  width: 132px;
  height: 50px;
`

const DRODOWN_BUTTON = styled(ButtonWrapper)`
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
    <DRODOWN_BUTTON>
      <span>{title}</span>
      <ArrowClicker />
    </DRODOWN_BUTTON>
  ) : (
    <NORMAL_BUTTON>
      <span>{title}</span>
    </NORMAL_BUTTON>
  )
}

export default HeaderButton
