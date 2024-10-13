import React, { forwardRef, HTMLAttributes, SyntheticEvent } from 'react'
import { cn } from 'gfx-component-lib'

type ScrollingHydrateContainerProps = {
  callback?: () => void
  isLoading?: boolean
} & HTMLAttributes<HTMLDivElement>

const ScrollingHydrateContainer = forwardRef<
  HTMLDivElement,
  ScrollingHydrateContainerProps
>(({
  children,
  className,
  callback,
  isLoading,
  ...props
}, ref) => (
  <div
    ref={ref}
    onScroll={(e: SyntheticEvent) => {
      const { scrollTop, scrollHeight, clientHeight } = e.target as HTMLDivElement;
      const progress = (scrollTop / (scrollHeight - clientHeight)) * 100
      if (progress >= 75 && !isLoading) {
        console.log('loading more')
        callback?.()
      }
    }}
    className={cn('max-h-[inherit] overflow-scroll w-full', className)}
    {...props}>
    {children}
  </div>
))
ScrollingHydrateContainer.displayName = 'ScrollingHydrateContainer'
export default ScrollingHydrateContainer