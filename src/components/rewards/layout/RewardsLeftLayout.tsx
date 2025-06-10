import { ReactNode } from 'react'
import { cn } from 'gfx-component-lib'
interface RewardsLeftLayoutProps {
  children: ReactNode | ReactNode[]
  className?: string
}
//basis-[389px] min-md:
function RewardsLeftLayout({ children, className }: RewardsLeftLayoutProps): JSX.Element {
  return (
    <div
      className={cn(
        `flex flex-col items-center 
      leading-normal overflow-y-auto grow shrink basis-auto min-lg:basis-[1040px] min-lg:max-h-full
      gap-2 min-lg:gap-3.75
    `,
        className
      )}
    >
      {children}
    </div>
  )
}

export default RewardsLeftLayout
