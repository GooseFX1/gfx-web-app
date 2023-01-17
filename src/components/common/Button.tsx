import { FC, ReactNode } from 'react'
import { TwStyle, styled } from 'twin.macro'
import 'styled-components/macro'
import { Loader } from '../Loader'

const BUTTON = styled.button<{ $cssStyle: TwStyle; $height: string; $width: string; $disabled: boolean }>`
  ${({ $cssStyle }) => $cssStyle};
  height: ${({ $height }) => $height};
  width: ${({ $width }) => $width};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
`

/* Pass Children, Width, Height as mandatory props to render the button 
Pass all the css styles as tailwind classes in cssStyle prop */
export const Button: FC<{
  children: ReactNode
  height: string
  width: string
  cssStyle?: TwStyle
  loading?: boolean
  disabled?: boolean
  [x: string]: any
}> = ({ height, width, children, cssStyle, loading = false, disabled, ...props }) => (
  <>
    <BUTTON $cssStyle={cssStyle} $height={height} $width={width} $disabled={disabled} {...props}>
      {loading ? <Loader /> : children}
    </BUTTON>
  </>
)
