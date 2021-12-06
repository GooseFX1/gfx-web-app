import React from 'react'
import styled from 'styled-components'

export const STYLED_LABLE = styled.span`
  display: flex;
  align-items: center;
  font-size: 17px;
  font-weight: 600;
  color: ${({ theme }) => theme.text1};
  line-height: 1;
  margin-bottom: ${({ theme }) => theme.margins['1x']};
  .heart-purple {
    width: 35px;
    height: 35px;
    margin-left: ${({ theme }) => theme.margins['1x']};
    padding-top: ${({ theme }) => theme.margins['1x']};
  }
`

type Props = {
  label: string
  isIcon?: boolean
  className?: string
}

export const LabelSection = ({ label, isIcon, className }: Props) => {
  return (
    <STYLED_LABLE className={className}>
      {label}
      {isIcon && <img className="heart-purple" src={`${process.env.PUBLIC_URL}/img/assets/heart-purple.svg`} alt="" />}
    </STYLED_LABLE>
  )
}
