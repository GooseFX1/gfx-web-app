import { BaseSyntheticEvent, FC, useState } from 'react'

import { notify } from '../utils'
import { APP_RPC, useDarkMode } from '../context'
import { ThemeToggle } from '../components/ThemeToggle'
import { useConnectionConfig } from '../context'
import { USER_CONFIG_CACHE } from '../types/app_params'
import useBreakPoint from '../hooks/useBreakPoint'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Button,
  Input,
  InputGroup,
  InputElementRight,
  Icon
} from 'gfx-component-lib'
import useBoolean from '../hooks/useBoolean'

export const More: FC = () => {
  const breakpoint = useBreakPoint()
  const [isActive, setIsActive] = useBoolean(false)
  const { mode } = useDarkMode()
  const { endpoint, endpointName, setEndpointName } = useConnectionConfig()
  const [nodeURL, setNodeURL] = useState<string>(endpoint.split('/')[0] + '//' + endpoint.split('/')[2])

  const saveHandler = (e: BaseSyntheticEvent, type: string) => {
    e.preventDefault()

    if (type === 'reset') {
      setEndpointName(APP_RPC.name)
      notify({ message: `Switched to ${APP_RPC.name} (${APP_RPC.network})` })
      return
    }

    if (
      nodeURL.length === 0 ||
      nodeURL === ' ' ||
      !(nodeURL.startsWith('https://') || nodeURL.startsWith('http://')) ||
      nodeURL === endpoint
    )
      return
    const existingUserCache: USER_CONFIG_CACHE = JSON.parse(window.localStorage.getItem('gfx-user-cache'))

    localStorage.setItem(
      'gfx-user-cache',
      JSON.stringify({
        ...existingUserCache,
        endpointName: type === 'custom' ? 'Custom' : APP_RPC.name,
        endpoint: type === 'custom' ? nodeURL : null
      })
    )

    setEndpointName('Custom')
    notify({ message: 'Switched to Custom' })
  }

  const nodeURLHandler = ({ target }) => setNodeURL(target.value)
  if (breakpoint.isMobile || breakpoint.isTablet) return null
  return (
    <DropdownMenu onOpenChange={setIsActive.toggle}>
      <DropdownMenuTrigger>
        <Icon
          key={`${mode}-more-button`}
          src={`/img/mainnav/settings-${mode}-${isActive ? 'active' : 'inactive'}.svg`}
          alt="more"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent className={'flex flex-col gap-3.5 p-2.5 mt-3'} portal={false}>
        <DropdownMenuItem
          variant={'blank'}
          preventCloseOnSelect={true}
          className={'inline-flex w-full justify-center items-center'}
        >
          <ThemeToggle />
        </DropdownMenuItem>
        <DropdownMenuItem variant={'blank'} preventCloseOnSelect={true}>
          {endpointName === 'Custom' ? (
            <Button colorScheme={'blue'} onClick={(e) => saveHandler(e, 'reset')}>
              <span style={{ fontWeight: 600 }}>Reset GFX RPC</span>
            </Button>
          ) : (
            <InputGroup
              rightItem={
                <InputElementRight>
                  <Button
                    variant={'ghost'}
                    disabled={nodeURL.length === 0 || nodeURL === ' ' || nodeURL === endpoint}
                    className={`disabled:dark:text-text-darkmode-tertiary disabled:text-text-lightmode-tertiary
                          dark:text-text-darkmode-primary text-text-lightmode-primary`}
                    onClick={(e) => saveHandler(e, 'custom')}
                  >
                    Set
                  </Button>
                </InputElementRight>
              }
            >
              <Input onChange={(x: BaseSyntheticEvent) => nodeURLHandler(x)} placeholder={'Enter Custom RPC'} />
            </InputGroup>
          )}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
