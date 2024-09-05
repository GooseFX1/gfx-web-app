import React, { HTMLAttributes, SyntheticEvent } from 'react'
import { cn } from 'gfx-component-lib'

type ScrollingHydrateContainerProps = {
  children: React.ReactNode
  callback?: () => void
  isLoading?: boolean
} & HTMLAttributes<HTMLDivElement>

function ScrollingHydrateContainer({
                                     children,
                                     className,
                                     callback,
                                     isLoading,
                                     ...props
                                   }: ScrollingHydrateContainerProps) {
  return (
    <div
      onScroll={(e: SyntheticEvent)=>{
        const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLDivElement;
        const progress = (scrollTop / ( scrollHeight - clientHeight ) ) * 100
        if (progress >= 75 && !isLoading) {
          console.log('loading more')
          callback?.()
        }
      }}
      className={cn('max-h-[inherit] overflow-scroll w-full', className)}
      {...props}>
      {children}
    </div>
  )
}

export default ScrollingHydrateContainer