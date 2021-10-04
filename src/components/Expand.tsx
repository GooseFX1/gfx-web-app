import React, { FC } from 'react'
import styled from 'styled-components'

const WRAPPER = styled.div`
  position: absolute;
  top: 0;
  left: calc(50% - 20px);
  ${({ theme }) => theme.flexCenter}
  width: 40px;
  height: 7px;
  border: 1px solid ${({ theme }) => theme.text1};
  border-bottom-left-radius: 50px;
  border-bottom-right-radius: 50px;
  background-color: ${({ theme }) => theme.bg1};
  cursor: pointer;

  > span {
    padding-bottom: 2px;
    font-size: 16px;
    line-height: 7px;
    color: ${({ theme }) => theme.text1};
  }
`

export const Expand: FC<{ [x: string]: any }> = ({ ...props }) => {
  return (
    <WRAPPER {...props}>
      <span>•</span>
      <span>•</span>
      <span>•</span>
    </WRAPPER>
  )
}
