import { FC, ReactNode } from 'react'
import tw, { TwStyle, styled } from 'twin.macro'
import 'styled-components/macro'
import { Loader } from './Loader'

const BUTTON = styled.button<{ $cssStyle: TwStyle; $height: string; $width: string; $disabled: boolean }>`
  ${tw`flex justify-center border-none rounded-full items-center min-w-[80px]`}
  ${({ $cssStyle }) => $cssStyle};
  height: ${({ $height }) => $height};
  width: ${({ $width }) => $width};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};

  .pinkGradient {
    border: 10px solid;
    background: linear-gradient(97deg, #f7931a 2%, #ac1cc7 99%);
  }
  &:disabled {
    opacity: 0.6;
  }
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
  height?: string
  width?: string
  cssStyle?: TwStyle
  loading?: boolean
  disabled?: boolean
  [x: string]: any
}> = ({ height, width, cssStyle, disabled, children, loading, ...props }) => (
  <>
    <BUTTON
      $cssStyle={cssStyle}
      $height={height}
      $width={width}
      $disabled={disabled}
      disabled={disabled}
      {...props}
    >
      {loading ? <LOADER /> : children}
    </BUTTON>
  </>
)
