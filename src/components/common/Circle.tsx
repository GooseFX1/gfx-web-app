import { FC } from 'react'
import { cn } from 'gfx-component-lib'

type CircleProps = {
  className?: string
}
export const Circle: FC<CircleProps> = ({ className }) => <div className={cn('rounded-full w-3 h-3', className)} />
