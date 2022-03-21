import { BaseSyntheticEvent, FC, useState } from 'react'
import { Dropdown, Input } from 'antd'
import { logEvent } from 'firebase/analytics'
import styled from 'styled-components'

import analytics from '../../analytics'
import { CenteredImg } from '../../styles'
import { Menu, MenuItem } from './shared'
import { notify } from '../../utils'
import { SelectRPC } from '../../components'
import { ThemeToggle } from '../../components/ThemeToggle'
import { useConnectionConfig } from '../../context'

const ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margin(4.5))}
  cursor: pointer;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-left: ${({ theme }) => theme.margin(1)};
  `}
`

const NewMenu = styled(Menu)`
  width: ${({ theme }) => theme.margin(34.75)};
  background-color: ${({ theme }) => theme.bg9};
  margin-top: ${({ theme }) => theme.margin(2)};
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
  width: 100%;
  margin-top: ${({ theme }) => theme.margin(0.5)};
  padding: 0 0 2px 0;
  cursor: text;
`

const INPUT = styled(Input)`
  font-size: 13px;
  font-weight: 500;
  text-align: start;
  padding: 0px ${({ theme }) => theme.margin(2)};
  height: 36px;
  ${({ theme }) => theme.largeBorderRadius}
  background-color: ${({ theme }) => theme.bg10};
  border-color: ${({ theme }) => theme.bg10};
  color: ${({ theme }) => theme.text4};
  margin-top: ${({ theme }) => theme.margin(0.5)};

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
`

const Button = styled.button`
  width: 126px;
  height: 40px;
  margin: 13px 0 0;
  font-weight: 500;
  font-size: 14px;
  padding: 0 ${({ theme }) => theme.margin(2)};
  ${({ theme }) => `padding-left: ${theme.margin(1.5)};`}
  ${({ theme }) => theme.flexCenter};
  border: none;
  ${({ theme }) => theme.roundedBorders};
  ${({ theme }) => theme.smallShadow};
  background-color: ${({ theme }) => theme.secondary2};
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
  }

  const nodeURLHandler = ({ target }) => {
    setNodeURL(target.value)
    setIsCustomNode(rpcState.endpoint !== nodeURL)
  }

  return (
    <NewMenu>
      <ITEM>
        <ThemeToggle />
      </ITEM>
      <ITEM>
        <ItemRow>
          <span>RPC EndPoint</span>
          <SelectRPC handleClickForRPC={handleClickForRPC} isCustomNode={isCustomNode} />
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
  return (
    <Dropdown
      align={{ offset: [0, 16] }}
      destroyPopupOnHide
      overlay={<Overlay />}
      placement="bottomLeft"
      trigger={['click']}
    >
      <ICON>
        <img src={`/img/assets/more_icon.svg`} alt="more" />
      </ICON>
    </Dropdown>
  )
}
