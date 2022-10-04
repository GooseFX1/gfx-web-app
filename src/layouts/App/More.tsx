import { BaseSyntheticEvent, FC, useState, useEffect } from 'react'
import { Dropdown } from 'antd'
import { logEvent } from 'firebase/analytics'
import styled from 'styled-components'
import tw from 'twin.macro'

import analytics from '../../analytics'
import { CenteredImg } from '../../styles'
import { Menu, MenuItem } from './shared'
import { notify } from '../../utils'
import { SelectRPC } from '../../components'
import { useDarkMode } from '../../context'
import { ThemeToggle } from '../../components/ThemeToggle'
import { useConnectionConfig } from '../../context'

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
  background-color: ${({ theme }) => theme.bg9};
`

const ITEM = styled(MenuItem)`
  justify-content: center;
  cursor: auto;

  & span {
    font-weight: 600;
  }

  &:hover span {
    color: ${({ theme }) => theme.text1};
  }
`

const ItemRow = styled.div`
  ${tw`w-full p-[0 0 2px 0] mt-[4px]`}
  cursor: text;
`

const INPUT = styled.input`
  ${tw`h-[40px] w-full text-[14px] py-0 px-[16px] mt-[4px] text-left`}
  font-weight: 500;
  ${({ theme }) => theme.largeBorderRadius}
  background-color: ${({ theme }) => theme.bg2};
  border-color: transparent;
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
    border-color: purple;
  }
`

const Button = styled.button`
  width: 126px;
  height: 40px;
  margin: 13px 0 0;
  font-weight: 600;
  font-size: 14px;
  padding: 0 ${({ theme }) => theme.margin(2)};
  ${({ theme }) => `padding-left: ${theme.margin(1.5)};`}
  ${({ theme }) => theme.flexCenter};
  ${({ theme }) => theme.roundedBorders};
  ${({ theme }) => theme.smallShadow};
  border: none;
  background-color: ${({ theme }) => theme.secondary7};
  cursor: pointer;
`

const Overlay = () => {
  const { endpoint, network, endpointName, setEndpoint } = useConnectionConfig()
  const [nodeURL, setNodeURL] = useState(endpoint.split('/')[0] + '//' + endpoint.split('/')[2])
  const [isCustomNode, setIsCustomNode] = useState(false)
  const [rpcState, setRpcState] = useState({ endpoint, endpointName, network })

  const handleClickForRPC = (endpoint, endpointName, network) => {
    setIsCustomNode(false)
    setNodeURL(endpoint.split('/')[0] + '//' + endpoint.split('/')[2])
    setRpcState({ endpoint, endpointName, network })
  }

  const saveHandler = () => {
    // analytics logger
    const an = analytics()
    if (isCustomNode) {
      setEndpoint(nodeURL)
      an !== null && logEvent(an, 'rpc-selector', { ...rpcState, endpoint: nodeURL })
      notify({ message: 'Switched to Custom' })
    } else {
      setEndpoint(rpcState.endpoint)
      an !== null && logEvent(an, 'rpc-selector', { ...rpcState })
      notify({ message: `Switched to  ${rpcState.endpointName} (${rpcState.network})` })
    }

    window.sessionStorage.setItem(
      'gfx-user-rpc-preference',
      JSON.stringify({
        ...rpcState,
        endpointName: isCustomNode ? 'Custom' : rpcState.endpointName,
        endpoint: nodeURL || rpcState.endpoint
      })
    )
  }

  const nodeURLHandler = ({ target }) => {
    setNodeURL(target.value)
    setIsCustomNode(rpcState.endpoint !== nodeURL)
  }

  useEffect(() => {
    const savedState = JSON.parse(window.sessionStorage.getItem('gfx-user-rpc-preference'))
    if (savedState) {
      handleClickForRPC(savedState.endpoint, savedState.endpointName, savedState.network)
      setEndpoint(savedState.endpoint)
      savedState.endpointName === 'Custom' && setIsCustomNode(true)
    }
  }, [network])

  return (
    <NewMenu>
      <ITEM>
        <ThemeToggle />
      </ITEM>
      <ITEM>
        <ItemRow>
          <span>RPC EndPoint</span>
          <SelectRPC
            endpointName={rpcState.endpointName}
            handleClickForRPC={handleClickForRPC}
            isCustomNode={isCustomNode}
          />
        </ItemRow>
      </ITEM>
      <ITEM>
        <ItemRow>
          <span>Node URL</span>
          <INPUT
            id="nodeURL"
            onChange={(x: BaseSyntheticEvent) => nodeURLHandler(x)}
            placeholder={'Enter Node URL'}
            value={nodeURL || undefined}
            autoComplete={'off'}
          />
        </ItemRow>
      </ITEM>
      <ITEM>
        <Button onClick={saveHandler}>Save</Button>
      </ITEM>
    </NewMenu>
  )
}

export const More: FC = () => {
  const { mode } = useDarkMode()
  const { network, setEndpoint } = useConnectionConfig()

  useEffect(() => {
    const savedState = JSON.parse(window.sessionStorage.getItem('gfx-user-rpc-preference'))
    if (savedState) {
      setEndpoint(savedState.endpoint)
    }
  }, [network])

  return (
    <Dropdown
      align={{ offset: [0, 16] }}
      destroyPopupOnHide
      overlay={<Overlay />}
      placement="bottomLeft"
      trigger={['click']}
    >
      <ICON $mode={mode === 'dark'}>
        <img src={`/img/assets/more_icon.svg`} alt="more" />
      </ICON>
    </Dropdown>
  )
}
