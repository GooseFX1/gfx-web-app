import React, { FC } from 'react'
import styled from 'styled-components'
import { CenteredDiv } from '../../../styles'

const WRAPPER = styled(CenteredDiv)`
  border-bottom: 1px solid ${({ theme }) => theme.appLayoutFooterBorder};
  height: 7vh;
`

const BUTTON = styled.button`
  ${({ theme }) => theme.flexCenter}
  padding: 0 ${({ theme }) => theme.margin(2)};
  border: none;
  ${({ theme }) => theme.largeBorderRadius}
  background-color: ${({ theme }) => theme.bg3};
  cursor: pointer;

  &:not(:first-child) {
    margin-left: ${({ theme }) => theme.margin(2)};
  }

  &:hover {
    ${({ theme }) => theme.smallShadow}
    background-color: ${({ theme }) => theme.grey4};

    > span {
      color: ${({ theme }) => theme.white};
    }
  }

  > span {
    padding: ${({ theme }) => theme.margin(1)} 0;
    font-size: 10px;
    font-weight: 600;
    color: ${({ theme }) => theme.text4};
  }
`

export const Timeline: FC = () => {
  const values = ['1D', '1W', '1M', '3M', '1Y', '5Y']

  return (
    <WRAPPER>
      {values.map((item, index) => (
        <BUTTON key={index} onClick={() => {}}>
          <span>{item}</span>
        </BUTTON>
      ))}
    </WRAPPER>
  )
}
