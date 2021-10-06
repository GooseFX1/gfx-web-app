import React, { FC } from 'react'
import styled from 'styled-components'

const WRAPPER = styled.div`
  position: absolute;
  top: 3px;
  left: calc(50% - 10px);
  ${({ theme }) => theme.flexCenter}
  width: 20px;
  height: 4px;
  border-radius: 50px;
  background-color: white;
  cursor: pointer;
`

export const Expand: FC<{ [x: string]: any }> = ({ ...props }) => {
  return <WRAPPER {...props} />
}
