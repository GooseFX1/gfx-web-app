import { FC } from 'react'

import { useDarkMode } from '../context'
import useBreakPoint from '../hooks/useBreakPoint'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, Icon } from 'gfx-component-lib'
import useBoolean from '../hooks/useBoolean'
import IconHover from '@/components/common/IconHover'

export const More: FC = () => {
  const breakpoint = useBreakPoint()
  const [isActive, setIsActive] = useBoolean(false)
  const { mode } = useDarkMode()
  // const { endpoint, endpointName, setEndpointName } = useConnectionConfig()
  // const [nodeURL, setNodeURL] = useState<string>(endpoint.split('/')[0] + '//' + endpoint.split('/')[2])

  // const saveHandler = (e: BaseSyntheticEvent, type: string) => {
  //   e.preventDefault()
  //
  //   if (type === 'reset') {
  //     setEndpointName(APP_RPC.name)
  //     notify({ message: `Switched to ${APP_RPC.name} (${APP_RPC.network})` })
  //     return
  //   }
  //
  //   if (
  //     nodeURL.length === 0 ||
  //     nodeURL === ' ' ||
  //     !(nodeURL.startsWith('https://') || nodeURL.startsWith('http://')) ||
  //     nodeURL === endpoint
  //   )
  //     return
  //   const existingUserCache: USER_CONFIG_CACHE = JSON.parse(window.localStorage.getItem('gfx-user-cache'))
  //
  //   localStorage.setItem(
  //     'gfx-user-cache',
  //     JSON.stringify({
  //       ...existingUserCache,
  //       endpointName: type === 'custom' ? 'Custom' : APP_RPC.name,
  //       endpoint: type === 'custom' ? nodeURL : null
  //     })
  //   )
  //
  //   setEndpointName('Custom')
  //   notify({ message: 'Switched to Custom' })
  // }

  //const nodeURLHandler = ({ target }) => setNodeURL(target.value)
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
        >
          <IconHover
            initialSrc={`/img/mainnav/whatsnew-inactive-${mode}.svg`}
            hoverSrc={`/img/mainnav/whatsnew-active-${mode}.svg`}
          />
          &nbsp;What's New
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`group text-text-lightmode-primary dark:text-text-darkmode-primary 
        font-bold text-b2`}
        >
          <IconHover
            initialSrc={`/img/mainnav/blog-inactive-${mode}.svg`}
            hoverSrc={`/img/mainnav/blog-active-${mode}.svg`}
          />
          &nbsp;Blog
        </DropdownMenuItem>
        <DropdownMenuItem
          className={`group text-text-lightmode-primary dark:text-text-darkmode-primary 
        font-bold text-b2`}
        >
          <IconHover
            initialSrc={`/img/mainnav/docs-inactive-${mode}.svg`}
            hoverSrc={`/img/mainnav/docs-active-${mode}.svg`}
          />
          &nbsp;Docs
        </DropdownMenuItem>
        <DropdownMenuItem className={'flex items-center justify-center gap-2.5'} variant={'blank'}>
          <IconHover
            initialSrc={'/img/mainnav/x-inactive.svg'}
            hoverSrc={`/img/mainnav/x-active-${mode}.svg`}
            size={'sm'}
          />
          <IconHover
            initialSrc={'/img/mainnav/discord-inactive.svg'}
            hoverSrc={`/img/mainnav/discord-active-${mode}.svg`}
            className={'min-w-[25px] max-w-[25px]'}
          />
          <IconHover
            initialSrc={'/img/mainnav/telegram-inactive.svg'}
            hoverSrc={`/img/mainnav/telegram-active-${mode}.svg`}
            className={'min-w-[25px] max-w-[25px]'}
          />
        </DropdownMenuItem>
        {/*<DropdownMenuItem*/}
        {/*  variant={'blank'}*/}
        {/*  preventCloseOnSelect={true}*/}
        {/*  className={'inline-flex w-full justify-center items-center'}*/}
        {/*>*/}
        {/*  <ThemeToggle />*/}
        {/*</DropdownMenuItem>*/}
        {/*<DropdownMenuItem variant={'blank'} preventCloseOnSelect={true}>*/}
        {/*  {endpointName === 'Custom' ? (*/}
        {/*    <Button colorScheme={'blue'} onClick={(e) => saveHandler(e, 'reset')}>*/}
        {/*      <span style={{ fontWeight: 600 }}>Reset GFX RPC</span>*/}
        {/*    </Button>*/}
        {/*  ) : (*/}
        {/*    <InputGroup*/}
        {/*      rightItem={*/}
        {/*        <InputElementRight>*/}
        {/*          <Button*/}
        {/*            variant={'ghost'}*/}
        {/*            disabled={nodeURL.length === 0 || nodeURL === ' ' || nodeURL === endpoint}*/}
        {/*            className={`disabled:dark:text-text-darkmode-tertiary disabled:text-text-lightmode-tertiary*/}
        {/*                  dark:text-text-darkmode-primary text-text-lightmode-primary`}*/}
        {/*            onClick={(e) => saveHandler(e, 'custom')}*/}
        {/*          >*/}
        {/*            Set*/}
        {/*          </Button>*/}
        {/*        </InputElementRight>*/}
        {/*      }*/}
        {/*    >*/}
        {/*      <Input onChange={(x: BaseSyntheticEvent) => nodeURLHandler(x)} placeholder={'Enter Custom RPC'} />*/}
        {/*    </InputGroup>*/}
        {/*  )}*/}
        {/*</DropdownMenuItem>*/}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
