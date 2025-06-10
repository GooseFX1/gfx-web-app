import React from 'react'
import { cn } from 'gfx-component-lib'
interface RewardsRightLayoutProps {
  children: React.ReactNode | React.ReactNode[]
  className?: string
}
//basis-[247px] min-md:
function RewardsRightLayout({ children, className }: RewardsRightLayoutProps): JSX.Element {
  return (
    <div
      className={cn(
        `p-2 min-lg:p-7 flex flex-col gap-2 leading-normal
        font-semibold grow shrink-0 items-center basis-[262px] min-lg:basis-[400px]
        min-lg:rounded-tr-[10px]`,
        className
      )}
    >
      {children}
    </div>
  )
}

export default RewardsRightLayout
