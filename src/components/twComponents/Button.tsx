import React, { ButtonHTMLAttributes, ReactNode } from 'react'
import tw, { TwStyle } from 'twin.macro'
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void
  children: ReactNode
  iconLeft?: ReactNode
  iconRight?: ReactNode
  cssClasses?: TwStyle[]
}
function Button({ onClick, children, iconLeft, iconRight, cssClasses, ...rest }: ButtonProps): JSX.Element {
  return (
    <button
      onClick={onClick}
      css={[
        tw`rounded-full px-1.5 py-1.25 flex items-center gap-1.5 h-7.5 text-regular font-semibold
       whitespace-nowrap overflow-visible justify-center items-center text-grey-1
      `
      ]
        .concat(cssClasses ?? [])
        .flat()}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  )
}

export default Button
