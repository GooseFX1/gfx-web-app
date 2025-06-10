import React, { ComponentProps } from 'react'
import { IconWithFallback } from '@/components/common/IconWithFallback'
import { cn } from 'gfx-component-lib'

function IconWithFallbackAndLoader({ src, isLoading, className = '', ...props }: {
  src: string
  isLoading?: boolean
  className?: string
} & ComponentProps<typeof IconWithFallback>) {
  return (
    <IconWithFallback
      src={isLoading ? `/img/assets/toast-loader.svg` : src}
      className={cn(``, isLoading && `animate-spin`, className)}
      {...props}
    />
  )
}

export default IconWithFallbackAndLoader
