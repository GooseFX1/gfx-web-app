import IconHover, { IconHoverProps } from '@/components/common/IconHover'
import { navigateTo } from '@/utils/requests'
import { FC } from 'react'
import { ThemeMode, useDarkMode } from '@/context'
import { SOCIAL_MEDIAS } from '@/constants'
// should match scheme for icon as in SocialLink - helps automate behavior
export type Social = 'x' | 'discord' | 'telegram'

interface SocialLinkProps extends Omit<IconHoverProps, 'initialSrc' | 'hoverSrc' | 'onClick'> {
  mode: ThemeMode
  social: Social
  link: string
  shouldUseModeForInitialSrc?: boolean
  shouldUseModeForHoverSrc?: boolean
}

const SocialLink: FC<SocialLinkProps> = ({
  mode,
  size,
  social,
  link,
  shouldUseModeForInitialSrc = false,
  shouldUseModeForHoverSrc = true,
  ...rest
}) => (
  <IconHover
    initialSrc={`/img/mainnav/${social}-inactive${shouldUseModeForInitialSrc ? `-${mode}` : ''}.svg`}
    hoverSrc={`/img/mainnav/${social}-active${shouldUseModeForHoverSrc ? `-${mode}` : ''}.svg`}
    size={size ?? 'sm'}
    onClick={navigateTo(link, '_blank')}
    {...rest}
  />
)

const SocialLinks: FC = () => {
  const { mode } = useDarkMode()
  return (
    <>
      <SocialLink social={'x'} link={SOCIAL_MEDIAS.twitter} mode={mode} shouldUseModeForHoverSrc={false} />
      <SocialLink social={'discord'} link={SOCIAL_MEDIAS.discord} mode={mode} shouldUseModeForHoverSrc={false} />
      <SocialLink social={'telegram'} link={SOCIAL_MEDIAS.telegram} mode={mode} shouldUseModeForHoverSrc={false} />
    </>
  )
}

export default SocialLinks

export { SocialLink }
