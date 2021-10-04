import React, { FC, ReactNode } from 'react'
import styled from 'styled-components'

type Status = 'initial' | 'interact' | 'action' | 'not-allowed'

const BUTTON = styled.button<{ $height: string, $status: Status, $width: string }>`
  ${({ theme }) => theme.flexCenter}
  height: ${({ $height }) => $height};
  width: ${({ $width }) => $width};
  border: none;
  ${({ theme }) => theme.roundedBorders}
  background-color: ${({ $status, theme }) =>
    ($status === 'initial' || $status === 'interact')
      ? theme.secondary3
      : $status === 'action'
        ? theme.secondary2
        : theme.text1h
  };
  cursor: ${({ $status }) => ($status === 'interact' || $status === 'action') ? 'pointer' : $status};

  span {
    font-size: 12px;
    font-weight: bold;
  }
`

export const MainButton: FC<{
  children: ReactNode,
  height: string,
  status: Status,
  width: string,
  [x: string]: any
}> = ({ children, height, status, width, ...props }) => {
  return (
    <BUTTON $height={height} $status={status} $width={width} {...props}>
      {children}
    </BUTTON>
  )
}
