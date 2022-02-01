import React from 'react'
import styled, { css } from 'styled-components'

export const STYLED_LABLE = styled.span<{ size: string }>`
  ${({ size }) => css`
    display: flex;
    align-items: center;
    font-size: ${size};
    font-weight: 600;
    color: ${({ theme }) => theme.text8};
    line-height: 1;
    margin-bottom: ${({ theme }) => theme.margins['1x']};
    .heart-purple {
      width: 35px;
      height: 35px;
      margin-left: ${({ theme }) => theme.margins['1x']};
      padding-top: ${({ theme }) => theme.margins['1x']};
    }
  `}
`

type Props = {
  label: string
  isIcon?: boolean
  className?: string
  size?: string
}

export const LabelSection = ({ label, isIcon, className, size = '17px' }: Props) => {
  return (
    <STYLED_LABLE className={className} size={size}>
      {label}
      {isIcon && <img className="heart-purple" src={`/img/assets/heart-purple.svg`} alt="" />}
    </STYLED_LABLE>
  )
}
