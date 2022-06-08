import React, { FC, ReactNode } from 'react'
import styled from 'styled-components'

const FLOATING_ACTION_BTN = styled.button<{ $height: number }>`
  height: ${({ $height }) => $height}px;
  width: ${({ $height }) => $height}px;
  border: none;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.bg9};
  cursor: pointer;
  transition: box-shadow ${({ theme }) => theme.mainTransitionTime} ease-in-out;
  ${({ theme }) => theme.smallShadow}
  ${({ theme }) => theme.roundedBorders}
  ${({ theme }) => theme.flexCenter}
`

export const FloatingActionButton: FC<{
  children: ReactNode
  height: number
  loading?: boolean
  [x: string]: any
}> = ({ children, height, loading = false, ...props }) => (
  <FLOATING_ACTION_BTN $height={height} {...props}>
    {children}
  </FLOATING_ACTION_BTN>
)
