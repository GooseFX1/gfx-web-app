import { FC, ReactNode } from 'react'
import tw, { TwStyle, styled } from 'twin.macro'
import 'styled-components/macro'
import { Loader } from './Loader'

const BUTTON = styled.button<{ $cssStyle: TwStyle; $height: string; $width: string; $disabled: boolean }>`
  ${tw`flex justify-center items-center`}
  ${({ $cssStyle }) => $cssStyle};
  height: ${({ $height }) => $height};
  width: ${({ $width }) => $width};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
`

const LOADER = () => (
  <div tw="relative top-[-1.6rem]">
    <Loader />
  </div>
)

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
}> = ({ height, width, cssStyle, disabled, children, loading, ...props }) => (
  <>
    <BUTTON $cssStyle={cssStyle} $height={height} $width={width} $disabled={disabled} {...props}>
      {loading ? <LOADER /> : children}
    </BUTTON>
  </>
)
