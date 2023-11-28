import React, { ReactNode } from 'react'
import { SVGDynamicReverseMode } from '../styles'
import tw, { TwStyle, styled } from 'twin.macro'
import 'styled-components/macro'

interface IProps {
  cssStyle: TwStyle | undefined
  height: string
  width: string
  children: ReactNode
  handleDismiss?: (bool: boolean) => void
  [x: string]: any
}

const SNACKBAR = styled.div<{
  $cssStyle: TwStyle | undefined
  $height: string
  $width: string
}>`
  ${tw`flex justify-center items-center rounded px-5 py-1 border-solid border-1`}
  ${({ $cssStyle }) => $cssStyle};
  height: ${({ $height }) => $height};
  width: ${({ $width }) => $width};
`

export const Snackbar = ({ handleDismiss, cssStyle, height, width, children }: IProps): any => (
  <SNACKBAR $cssStyle={cssStyle} $height={height} $width={width}>
    {children}
    {handleDismiss && (
      <button className={'close-button'} onClick={() => handleDismiss(false)} aria-label="Close banner">
        <SVGDynamicReverseMode className="close-icon" src={`/img/assets/close-white-icon.svg`} alt="close" />
      </button>
    )}
  </SNACKBAR>
)
