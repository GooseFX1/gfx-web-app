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
        tw`flex flex-col flex-1 flex-basis[60%] items-center py-2.5 min-md:pb-0 px-3.75 min-md:px-7.5
      leading-normal overflow-y-auto
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
