import { forwardRef, ComponentProps, useRef } from 'react'
import { Icon } from 'gfx-component-lib'
import { useDarkMode } from '@/context'

interface IconWithFallbackProps extends ComponentProps<typeof Icon> {
  fallbackSrcList?: string[]
}

export const IconWithFallback = forwardRef<typeof Icon, IconWithFallbackProps>(
  ({ fallbackSrcList, ...props }, ref) => {
    const { mode } = useDarkMode()
    const loadCount = useRef<number>(0)
    return (
      <Icon
        onError={(e) => {
          if (e.currentTarget instanceof HTMLImageElement) {
            if (fallbackSrcList && loadCount.current < fallbackSrcList.length) {
              e.currentTarget.src = fallbackSrcList[loadCount.current]
              loadCount.current++
            } else {
              e.currentTarget.src = `/img/assets/fallback-token-${mode}.svg`
            }
          }
        }}
        {...props}
        ref={ref}
      />
    )
  }
)

IconWithFallback.displayName = 'IconWithFallback'
