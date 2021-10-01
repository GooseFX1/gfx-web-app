import React, { FC, ReactNode } from 'react'
import styled from 'styled-components'

type Status = 'initial' | 'interact' | 'action' | 'not-allowed'

const BUTTON = styled.button<{ $status: Status }>`
  ${({ theme }) => theme.flexCenter}
  height: 50px;
  width: 170px;
  border: none;
  ${({ theme }) => theme.roundedBorders}
  background-color: ${({ $status, theme }) =>
    ($status === 'initial' || $status === 'interact')
      ? theme.secondary3
      : $status === 'action'
        ? theme.secondary2
        : theme.grey4
  };
  cursor: ${({ $status }) => ($status === 'interact' || $status === 'action') ? 'pointer' : $status};

  span {
    font-size: 12px;
    font-weight: bold;
  }
`

export const MainButton: FC<{
  children: ReactNode,
  status: Status,
  [x: string]: any
}> = ({ children, status, ...props }) => {
  return (
    <BUTTON $status={status} {...props}>
      {children}
    </BUTTON>
  )
}
