import tw, { TwStyle } from 'twin.macro'
import Button from '../../twComponents/Button'
import React, { ReactNode } from 'react'
interface HowItWorksButtonProps {
  link?: string
  children?: ReactNode
  cssClasses?: TwStyle[]
}
function HowItWorksButton({ link, children, cssClasses }: HowItWorksButtonProps): JSX.Element {
  return (
    <Button
      cssClasses={[
        tw`border-1 border-solid dark:border-white border-blue-1 text-blue-1 dark:text-white font-semibold
                 text-tiny`
      ]
        .concat(cssClasses ?? [])
        .flat()}
      onClick={() =>
        window.open(link ?? 'https://docs.goosefx.io/tokenomics/stake-rewards-and-fee-share', '_blank')
      }
    >
      {children ?? 'How it works?'}
    </Button>
  )
}

export default HowItWorksButton
