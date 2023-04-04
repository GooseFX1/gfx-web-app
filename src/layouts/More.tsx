import { BaseSyntheticEvent, FC, useState } from 'react'
import { Dropdown } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'

import { CenteredImg } from '../styles'
import { Menu, MenuItem } from './shared'
import { notify } from '../utils'
import { useDarkMode } from '../context'
import { ThemeToggle } from '../components/ThemeToggle'
import { useConnectionConfig } from '../context'
import { USER_CONFIG_CACHE } from '../types/app_params'

const ICON = styled(CenteredImg)<{ $mode: boolean }>`
  ${tw`h-[36px] w-[36px] cursor-pointer`}

  img {
    filter: opacity(${({ $mode }) => ($mode ? 1 : 0.7)});
  }

  ${({ theme }) => theme.mediaWidth.upToSmall`
    ${tw`ml-[8px]`}
  `}
`

const NewMenu = styled(Menu)`
  ${tw`w-[278px] mt-[16px]`}
  background-color: ${({ theme }) => theme.bg20};

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

const INPUT = styled.input`
  ${tw`h-[40px] w-full text-[14px] py-0 px-[16px] text-left`}
  font-weight: 500;
  border-radius: 50px 0 0 50px;
  background-color: ${({ theme }) => theme.bg2};
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

const Button = styled.button`
  ${tw`h-[40px] w-[44px] flex justify-center items-center font-semibold 
      text-regular bg-purple-1 cursor-pointer border-transparent rounded-r-full`}
`

const Overlay = () => {
  const { endpoint, network, endpointName, setEndpointName } = useConnectionConfig()
  const [nodeURL, setNodeURL] = useState<string>(endpoint.split('/')[0] + '//' + endpoint.split('/')[2])
  const [isCustomNode, setIsCustomNode] = useState<boolean>(endpointName === 'Custom')

  const saveHandler = (e: BaseSyntheticEvent) => {
    e.preventDefault()
    if (nodeURL.length === 0 || nodeURL === ' ') return

    const existingUserCache: USER_CONFIG_CACHE = JSON.parse(window.localStorage.getItem('gfx-user-cache'))
    window.localStorage.setItem(
      'gfx-user-cache',
      JSON.stringify({
        ...existingUserCache,
        endpointName: isCustomNode ? 'Custom' : endpointName,
        endpoint: isCustomNode ? nodeURL : null
      })
    )

    if (isCustomNode) {
      setEndpointName('Custom')
      notify({ message: 'Switched to Custom' })
    } else {
      setEndpointName(endpointName)
      notify({ message: `Switched to  ${endpointName} (${network})` })
    }
  }

  const nodeURLHandler = ({ target }) => {
    setNodeURL(target.value)
    setIsCustomNode(endpoint !== target.value)
  }

  return (
    <NewMenu>
      <ITEM>
        <ThemeToggle />
      </ITEM>
      <small>Custom RPC URL</small>
      <ITEM>
        <INPUT
          id="nodeURL"
          onChange={(x: BaseSyntheticEvent) => nodeURLHandler(x)}
          placeholder={'Enter Custom RPC'}
          value={undefined}
          autoComplete={'off'}
        />
        <Button onClick={saveHandler}>Set</Button>
      </ITEM>
    </NewMenu>
  )
}

export const More: FC = () => {
  const { mode } = useDarkMode()

  return (
    <Dropdown
      align={{ offset: [0, 16] }}
      destroyPopupOnHide
      overlay={<Overlay />}
      placement="bottomRight"
      trigger={['hover']}
    >
      <ICON $mode={mode === 'dark'}>
        <img src={`/img/assets/more_icon.svg`} alt="more" />
      </ICON>
    </Dropdown>
  )
}
