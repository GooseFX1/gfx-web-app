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
        `flex flex-col items-center px-2 py-2.5 min-md:p-7
      leading-normal overflow-y-auto grow shrink basis-[453px] min-md:basis-[1040px] min-md:max-h-full
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
