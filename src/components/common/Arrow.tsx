import { FC } from 'react'
import tw, { TwStyle, styled } from 'twin.macro'
import 'styled-components/macro'
import { useDarkMode } from '../../context'

const ARROW = styled.div<{ $cssStyle: TwStyle; $height: string; $width: string; $invert: boolean }>`
  ${tw`flex justify-center duration-500`}
  ${({ $cssStyle }) => $cssStyle};
  height: ${({ $height }) => $height};
  width: ${({ $width }) => $width};
  transform: ${({ $invert }) => ($invert ? 'rotate(180deg)' : '')};
`

export const Arrow: FC<{
  height: string
  width: string
  invert: boolean
  whiteColor?: boolean
  cssStyle?: TwStyle
  [x: string]: any
}> = ({ height, width, cssStyle, whiteColor, invert, ...props }) => {
  const { mode } = useDarkMode()
  const ArrowImg = !whiteColor ? `/img/assets/arrow-down-${mode}.svg` : `/img/assets/arrow-down-dark.svg`

  return (
    <>
      <ARROW $cssStyle={cssStyle} $height={height} $width={width} $invert={invert} {...props}>
        <img src={ArrowImg} alt="arrow" />
      </ARROW>
    </>
  )
}
