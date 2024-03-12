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
        `pt-0 py-2.5 min-md:py-2.5 min-sm:pb-5 px-7.5 flex flex-col gap-2 leading-normal
        font-semibold grow shrink-0 items-center basis-[287px] min-md:basis-[512px]
        min-md:rounded-tr-[10px]`,
        className
      )}
    >
      {children}
    </div>
  )
}

export default RewardsRightLayout
