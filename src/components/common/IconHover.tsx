import { cn, Icon, IconProps } from 'gfx-component-lib'
import { FC } from 'react'

interface IconHoverProps extends Omit<IconProps, 'src'> {
  initialSrc: string
  hoverSrc: string
}

const IconHover: FC<IconHoverProps> = ({ initialSrc, hoverSrc, className, ...rest }) => (
  <div className={'group z-[1]'}>
    <Icon src={initialSrc} className={cn('group-hover:hidden', className)} {...rest} />
    <Icon src={hoverSrc} className={cn('group-hover:inline-block hidden', className)} {...rest} />
  </div>
)

export default IconHover
