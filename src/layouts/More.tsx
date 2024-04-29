import { FC } from 'react'

import { useDarkMode } from '../context'
import useBreakPoint from '../hooks/useBreakPoint'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Icon } from 'gfx-component-lib'
import useBoolean from '../hooks/useBoolean'
import IconHover from '@/components/common/IconHover'
import { NAV_LINKS, navigateTo, navigateToCurried } from '@/utils/requests'
import SocialLinks from '@/components/common/SocialLinks'

export const More: FC = () => {
  const breakpoint = useBreakPoint()
  const [isActive, setIsActive] = useBoolean(false)
  const { mode } = useDarkMode()

  if (breakpoint.isMobile || breakpoint.isTablet) return null
  return (
    <DropdownMenu onOpenChange={setIsActive.toggle}>
      <DropdownMenuTrigger className="mr-2">
        <Icon
          key={`${mode}-more-button`}
          src={`/img/mainnav/settings-${mode}-${isActive ? 'active' : 'inactive'}.svg`}
          alt="more"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className={`flex flex-col p-2.5 mt-3 mr-[29px] w-[155px]`} portal={false}>
        <DropdownMenuItem
          className={`group text-text-lightmode-primary dark:text-text-darkmode-primary 
        font-bold text-b2`}
          onClick={navigateToCurried(NAV_LINKS.whatsnew, '_blank')}
        >
          <IconHover
            initialSrc={`/img/mainnav/whatsnew-inactive-${mode}.svg`}
            hoverSrc={`/img/mainnav/whatsnew-active-${mode}.svg`}
            size={'sm'}
          />
          &nbsp;What's New
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`group text-text-lightmode-primary dark:text-text-darkmode-primary 
        font-bold text-b2`}
          onClick={navigateToCurried(NAV_LINKS.blog, '_blank')}
        >
          <IconHover
            initialSrc={`/img/mainnav/blog-inactive-${mode}.svg`}
            hoverSrc={`/img/mainnav/blog-active-${mode}.svg`}
            size={'sm'}
          />
          &nbsp;Blog
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`group text-text-lightmode-primary dark:text-text-darkmode-primary 
        font-bold text-b2`}
          onClick={navigateToCurried(NAV_LINKS.docs, '_blank')}
        >
          <IconHover
            initialSrc={`/img/mainnav/docs-inactive-${mode}.svg`}
            hoverSrc={`/img/mainnav/docs-active-${mode}.svg`}
            size={'sm'}
          />
          &nbsp;Docs
        </DropdownMenuItem>
        <DropdownMenuItem className={'flex items-center justify-center gap-2.5'} variant={'blank'}>
          <SocialLinks />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
