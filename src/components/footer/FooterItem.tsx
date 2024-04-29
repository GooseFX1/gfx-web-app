import { FC, HTMLAttributes } from 'react'
import { cn } from 'gfx-component-lib'
export interface FooterItemProps extends HTMLAttributes<HTMLDivElement> {
  title: string
}
export const FooterItem: FC<FooterItemProps> = ({ title, className, children, ...rest }) => (
  <div className={cn('flex flex-col items-start min-lg:flex-row min-md:items-center gap-1', className)} {...rest}>
    <p className={'text-b3 font-bold text-text-lightmode-secondary dark:text-text-darkmode-secondary'}>{title}</p>
    {children}
  </div>
)

export const FooterItemContent: FC<HTMLAttributes<HTMLDivElement>> = ({ children, className, ...rest }) => (
  <div
    className={cn(
      `inline-flex gap-1 items-center font-bold text-b3 text-text-lightmode-primary
   dark:text-text-darkmode-primary h-[25px]`,
      className
    )}
    {...rest}
  >
    {children}
  </div>
)
