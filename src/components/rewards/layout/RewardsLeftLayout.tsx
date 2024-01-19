import { ReactNode } from 'react'
import tw, { TwStyle } from 'twin.macro'
interface RewardsLeftLayoutProps {
  children: ReactNode | ReactNode[]
  cssStyles?: TwStyle[]
  className?: string
}
function RewardsLeftLayout({ children, cssStyles, className }: RewardsLeftLayoutProps): JSX.Element {
  return (
    <div
      className={className}
      css={[
        tw`flex flex-col items-center py-2.5 min-md:pb-0 px-3.75 min-md:px-7.5
      leading-normal overflow-y-auto  flex-[1 1 389px]  min-md:flex-[1 1 60%]
    `
      ]
        .concat(cssStyles ?? [])
        .flat()}
    >
      {children}
    </div>
  )
}

export default RewardsLeftLayout
