import { BaseSyntheticEvent, FC, useCallback, useState } from 'react'
import { Dropdown } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'

import { CenteredImg } from '../styles'
import { Menu, MenuItem } from './shared'
import { notify } from '../utils'
import { APP_RPC, useDarkMode } from '../context'
import { ThemeToggle } from '../components/ThemeToggle'
import { useConnectionConfig } from '../context'
import { USER_CONFIG_CACHE } from '../types/app_params'
import { Button } from '../components'
import useBreakPoint from '../hooks/useBreakPoint'

export const ICON = styled(CenteredImg)<{ $mode: boolean }>`
  ${tw`h-7 w-7 mr-[8px] cursor-pointer`}

  img {
    filter: opacity(${({ $mode }) => ($mode ? 1 : 0.7)});
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    ${tw`ml-[8px]`}
  `}
`

const NewMenu = styled(Menu)`
  ${tw`w-[278px] mt-[16px]`}
  background-color: ${({ theme }) => theme.themeToggleContainer};
  border: 1px solid ${({ theme }) => theme.bg0};

  small {
    ${tw`font-semibold`}
  }
`

const ITEM = styled(MenuItem)`
  ${tw`justify-center cursor-auto mb-2`}

  & span {
    font-weight: 600;
  }

  &:hover span {
    color: ${({ theme }) => theme.text1};
  }
`

const SMALL_TEXT = styled.small`
  color: ${({ theme }) => theme.text6};
`

const INPUT = styled.input`
  ${tw`h-[40px] w-full text-[14px] py-0 px-[16px] text-left`}
  font-weight: 500;
  border-radius: 50px 0 0 50px;
  background-color: ${({ theme }) => theme.themeToggleButton};
  border: none;
  color: ${({ theme }) => theme.text4};

  ::placeholder {
    color: #636363;
    opacity: 1; /* Firefox */
  }
  :-ms-input-placeholder {
    color: #636363; /* Internet Explorer 10-11 */
  }
  ::-ms-input-placeholder {
    color: #636363; /* Microsoft Edge */
  }

  &:focus,
  :active {
    border: transparent;
  }
`

const SetButton = styled.button`
  ${tw`h-[40px] w-[44px] flex justify-center items-center font-semibold 
      text-regular !bg-blue-1 cursor-pointer border-transparent rounded-r-full`}
`

const Overlay = () => {
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

  return (
    <NewMenu>
      <ITEM>
        <ThemeToggle />
      </ITEM>
      {endpointName === 'Custom' ? (
        <Button
          height="36px"
          width="100%"
          cssStyle={tw`bg-blue-1 rounded-circle border-0 mt-3`}
          onClick={(e) => saveHandler(e, 'reset')}
        >
          <span style={{ fontWeight: 600 }}>Reset GFX RPC</span>
        </Button>
      ) : (
        <form onSubmit={(e) => saveHandler(e, 'custom')}>
          <SMALL_TEXT>Custom RPC URL</SMALL_TEXT>
          <ITEM>
            <INPUT
              id="nodeURL"
              onChange={(x: BaseSyntheticEvent) => nodeURLHandler(x)}
              placeholder={'Enter Custom RPC'}
              value={undefined}
              autoComplete={'off'}
            />
            <SetButton type="submit" onClick={(e) => saveHandler(e, 'custom')}>
              Set
            </SetButton>
          </ITEM>
        </form>
      )}
    </NewMenu>
  )
}

export const More: FC = () => {
  const { mode } = useDarkMode()
  const breakpoint = useBreakPoint()
  const [isActive, setIsActive] = useState<string>('inactive')
  const onVisibleChange = useCallback((visible: boolean) => {
    setIsActive(visible ? 'active' : 'inactive')
  }, [])
  if (breakpoint.isMobile || breakpoint.isTablet) return null
  return (
    <Dropdown
      align={{ offset: [0, 16] }}
      destroyPopupOnHide
      overlay={<Overlay />}
      placement="bottomRight"
      trigger={['hover']}
      onVisibleChange={onVisibleChange}
      key={'dropdown'}
    >
      <ICON $mode={mode === 'dark'}>
        <img key={`${mode}-more-button`} src={`/img/assets/more-${mode}-${isActive}.svg`} alt="more" />
      </ICON>
    </Dropdown>
  )
}
