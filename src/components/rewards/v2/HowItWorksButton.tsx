import tw, { TwStyle } from 'twin.macro'
import Button from '../../twComponents/Button'
import React, { ReactNode } from 'react'
import { Icon } from 'gfx-component-lib'
interface HowItWorksButtonProps {
  link?: string
  children?: ReactNode
  cssClasses?: TwStyle[]
}
function HowItWorksButton({ link, cssClasses }: HowItWorksButtonProps): JSX.Element {
  return (
    <Button
      cssClasses={[
        tw`border-none min-md:text-tiny min-w-[35px] min-h-[35px]`
      ]
        .concat(cssClasses ?? [])
        .flat()}
      onClick={() => window.open(link, '_blank')}
    >
      <Icon src={'/img/assets/help_icon.svg'} />
    </Button>
  )
}

export default HowItWorksButton
