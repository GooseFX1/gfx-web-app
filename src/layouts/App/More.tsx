import { FC, BaseSyntheticEvent, useCallback, useState } from 'react'
import { Dropdown, Input } from 'antd'
import { logEvent } from 'firebase/analytics'
import styled from 'styled-components'

import { Menu, MenuItem } from './shared'
import { CenteredImg } from '../../styles'
import { ThemeToggle } from '../../components/ThemeToggle'
import { SelectRPC } from '../../components'
import analytics from '../../analytics'
import { notify } from '../../utils'
import { useConnectionConfig } from '../../context'

const ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margin(4.5))}
  cursor: pointer;

  ${({ theme }) => theme.mediaWidth.upToSmall`
    margin-left: ${({ theme }) => theme.margin(1)};
  `}
`

const NewMenu = styled(Menu)`
  width: 278px;
  background-color: ${({ theme }) => theme.bg9};
`

const ITEM = styled(MenuItem)`
  justify-content: center;

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
  cursor: pointer;
  margin-top: ${({ theme }) => theme.margin(0.5)};

  ::placeholder {
    color: #636363;
    opacity: 1; /* Firefox */
  }
  :-ms-input-placeholder {
    /* Internet Explorer 10-11 */
    color: #636363;
  }
  ::-ms-input-placeholder {
    /* Microsoft Edge */
    color: #636363;
  }
`

const Button = styled.button`
  width: 126px;
  height: 40px;
  margin: 13px 55px 0;
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
  const [nodeURL, setNodeURL] = useState('')
  const { setEndpoint } = useConnectionConfig()

  const [rpcState, setRpcState] = useState({
    endpoint: null,
    endpointName: null,
    network: null
  })

  const handleClickForRPC = (endpoint, endpointName, network) => {
    setRpcState({ endpoint, endpointName, network })
  }

  const saveHandler = () => {
    setEndpoint(rpcState.endpoint)
    // analytics logger
    const an = analytics()
    an !== null && logEvent(an, 'rpc-selector', { ...rpcState })
    notify({ message: `Switched to  ${rpcState.endpointName} (${rpcState.network}) ` })
  }

  return (
    <NewMenu>
      <ITEM>
        <ThemeToggle />
      </ITEM>
      <ITEM>
        <ItemRow>
          <span>Rpc EndPoint</span>
          <SelectRPC handleClickForRPC={handleClickForRPC} />
        </ItemRow>
      </ITEM>
      <ITEM>
        <ItemRow>
          <span>Node URL</span>
          <INPUT
            id="nodeURL"
            onChange={(x: BaseSyntheticEvent) => {
              !isNaN(x.target.value) && setNodeURL(x.target.value)
            }}
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
