import React, { FC, ReactNode } from 'react'
import styled from 'styled-components'

const BAR = styled.button<{ $height: string; $width: string }>`
  ${({ theme }) => theme.flexCenter}
  height: ${({ $height }) => $height};
  width: ${({ $width }) => $width};
  display: flex;
  justify-content: left;
  border: none;
  margin: 0;
  padding: 0;
  border-radius: 20px;
  background-color: ${({ theme }) => theme.grey4};
`

export const HeaderBar: FC<{
  height: string
  width: string
}> = ({ height, width, ...props }) => {
  return (
    <div>
      <BAR $height={height} $width={width} {...props}></BAR>
    </div>
  )
}
