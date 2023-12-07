import React from 'react'
import tw, { TwStyle } from 'twin.macro'
interface RewardsRightLayoutProps {
  children: React.ReactNode | React.ReactNode[]
  cssStyles?: TwStyle[]
}
function RewardsRightLayout({ children, cssStyles }: RewardsRightLayoutProps): JSX.Element {
  return (
    <div
      css={[
        tw`pt-0 pb-2.5 min-md:py-2.5 min-sm:pb-5 px-7.5 flex flex-col gap-2 leading-normal
        font-semibold  flex-1 flex-basis[40%] items-center`
      ]
        .concat(cssStyles ?? [])
        .flat()}
    >
      {children}
    </div>
  )
}

export default RewardsRightLayout
