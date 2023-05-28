import React, { FC } from 'react'
import styled from 'styled-components'

const GRADIENT_TEXT = styled.span`
  background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-family: Montserrat !important;
  background-clip: text;
  text-fill-color: transparent;
  width: fit-content;
`
export const GradientText: FC<{
  text: string | number
  fontSize: number
  fontWeight: number
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  lineHeight?: number
}> = ({ text, fontSize, fontWeight, lineHeight, onClick }) => (
  <GRADIENT_TEXT
    style={{
      fontSize: fontSize + 'px',
      fontWeight: fontWeight ? fontWeight : 600,
      lineHeight: lineHeight ? lineHeight + 'px' : 'auto'
    }}
    onClick={onClick}
  >
    {text}
  </GRADIENT_TEXT>
)
