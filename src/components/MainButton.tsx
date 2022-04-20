import React, { FC, ReactNode } from 'react'
import styled from 'styled-components'
import { Loader } from './Loader'

type Status = 'initial' | 'action' | 'not-allowed'

const BUTTON = styled.button<{ $height: string; $status: Status; $width: string; $radius: string }>`
  position: relative;
  ${({ theme }) => theme.flexCenter}
  height: ${({ $height }) => $height};
  width: ${({ $width }) => $width};
  border: none;
  border-radius: ${({ $radius }) => $radius};
  ${({ theme }) => theme.roundedBorders}
  background-color: ${({ $status, theme }) => ($status === 'action' ? theme.secondary3 : theme.bg10)};
  cursor: ${({ $status }) => ($status === 'action' ? 'pointer' : $status)};
  transition: background-color ${({ theme }) => theme.mainTransitionTime} ease-in-out;

  ${({ theme, $status }) =>
    $status === 'action' &&
    `
    &:hover {
      background-color: ${theme.secondary2};
    }
  `}

  span {
    font-size: 12px;
    font-weight: bold;
    color: white;
  }

  &:disabled {
    background: grey;
    cursor: not-allowed;
  }
`

export const MainButton: FC<{
  children: ReactNode
  height: string
  status: Status
  width: string
  loading?: boolean
  radius?: string
  [x: string]: any
}> = ({ children, height, loading = false, status, width, radius, ...props }) => {
  return (
    <BUTTON $height={height} $status={status} $width={width} $radius={radius} {...props}>
      {loading ? <Loader /> : children}
    </BUTTON>
  )
}
