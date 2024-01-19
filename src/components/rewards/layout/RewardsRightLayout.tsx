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
        tw`pt-0 py-2.5 min-md:py-2.5 min-sm:pb-5 px-7.5 flex flex-col gap-2 leading-normal
        font-semibold flex-[1 1 247px] min-md:flex-[1 1 40%] items-center max-h-[247px] min-md:max-h-[447px]`
      ]
        .concat(cssStyles ?? [])
        .flat()}
    >
      {children}
    </div>
  )
}

export default RewardsRightLayout
