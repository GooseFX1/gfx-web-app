import React, { FC } from 'react'
import styled, { css } from 'styled-components'

const LOADER = styled.div<{ $color }>`
  position: absolute;
  top: 0;
  ${({ theme }) => theme.measurements(theme.margin(1))}
  border-radius: 50%;
  font-size: 12px;
  color: ${({ $color }) => `${$color}`};
  text-indent: -9999em;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation: loader 1.8s infinite ease-in-out;
  animation: loader 1.8s infinite ease-in-out;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateY(-8px);
  -webkit-animation-delay: -0.16s;
  animation-delay: -0.16s;

  &:before,
  &:after {
    content: '';
    position: absolute;
    top: 0;
    border-radius: 50%;
    ${({ theme }) => theme.measurements(theme.margin(1))}
    -webkit-animation-fill-mode: both;
    animation-fill-mode: both;
    -webkit-animation: loader 1.8s infinite ease-in-out;
    animation: loader 1.8s infinite ease-in-out;
  }

  &:before {
    left: -16px;
    -webkit-animation-delay: -0.32s;
    animation-delay: -0.32s;
  }

  &:after {
    left: 16px;
  }
`

export const Loader: FC<{ color?: string }> = ({ color }) => {
  const localCSS = css`
    @-webkit-keyframes loader {
      0%,
      80%,
      100% {
        box-shadow: 0 2.5em 0 -1.3em;
      }
      40% {
        box-shadow: 0 2.5em 0 0;
      }
    }

    @keyframes loader {
      0%,
      80%,
      100% {
        box-shadow: 0 2.5em 0 -1.3em;
      }
      40% {
        box-shadow: 0 2.5em 0 0;
      }
    }
  `

  return (
    <>
      <style>{localCSS}</style>
      <LOADER $color={color ? color : 'white'} />
    </>
  )
}
