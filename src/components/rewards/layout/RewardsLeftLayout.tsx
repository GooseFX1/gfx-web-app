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
        `flex flex-col items-center p-2.5 min-md:p-3.75
      leading-normal overflow-y-auto grow shrink basis-[350px] min-md:basis-3/5 min-md:max-h-full
      gap-2 min-md:gap-3.75
    `,
        className
      )}
    >
      {children}
    </div>
  )
}

export default RewardsLeftLayout
