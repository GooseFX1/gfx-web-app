import tw, { TwStyle } from 'twin.macro'
import Button from '../../twComponents/Button'
import React, { ReactNode } from 'react'
import useBreakPoint from '../../../hooks/useBreakPoint'
interface HowItWorksButtonProps {
  link?: string
  children?: ReactNode
  cssClasses?: TwStyle[]
}
function HowItWorksButton({ link, children, cssClasses }: HowItWorksButtonProps): JSX.Element {
  const { isMobile, isTablet } = useBreakPoint()
  return (
    <Button
      cssClasses={[
        tw`border-1 border-solid dark:border-white border-blue-1 text-blue-1 dark:text-white font-semibold
                 text-regular min-md:text-tiny min-w-[35px] min-h-[35px]`
      ]
        .concat(cssClasses ?? [])
        .flat()}
      onClick={() => window.open(link, '_blank')}
    >
      {children ?? (isMobile || isTablet ? '?' : 'How it works')}
    </Button>
  )
}

export default HowItWorksButton
