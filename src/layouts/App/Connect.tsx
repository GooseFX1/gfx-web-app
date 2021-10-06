import React, { Dispatch, FC, MouseEventHandler, SetStateAction, useCallback, useMemo, useState } from 'react'
import { Select } from 'antd'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { Menu, MenuItem } from './shared'
import { ArrowDropdown } from '../../components'
import { ENDPOINTS, useConnectionConfig, useWalletModal } from '../../context'
import { CenteredImg } from '../../styles'

const _BUTTON = styled.button`
  ${({ theme }) => theme.flexCenter}
  height: ${({ theme }) => theme.margins['5x']};
  border: none;
  ${({ theme }) => theme.roundedBorders}

  span {
    font-size: 12px;
    font-weight: bold;
    color: white;
    cursor: pointer;
  }
`

const CONNECT_BUTTON = styled(_BUTTON)`
  padding: 0 ${({ theme }) => theme.margins['2x']};
  background-color: ${({ theme }) => theme.secondary3};
`

const CONNECTED_BUTTON = styled(_BUTTON)`
  padding: 0 ${({ theme }) => theme.margins['1.5x']} 0 ${({ theme }) => theme.margins['1x']};
  background-image: linear-gradient(to left, ${({ theme }) => theme.secondary2}, ${({ theme }) => theme.primary2});
`

const NETWORK = styled.span`
  padding: 5px 0;
  color: ${({ theme }) => theme.text1} !important;
  cursor: initial;
`

const WALLET_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['3x'])}
  margin-right: ${({ theme }) => theme.margins['2x']};
  ${({ theme }) => theme.roundedBorders}
  background-color: black;

  img {
    ${({ theme }) => theme.measurements(theme.margins['1.5x'])}
  }
`

const Overlay: FC<{ setArrowRotation: Dispatch<SetStateAction<boolean>> }> = ({ setArrowRotation }) => {
  const { endpoint, setEndpoint } = useConnectionConfig()
  const { disconnect, publicKey, wallet } = useWallet()
  const { setVisible: setWalletModalVisible } = useWalletModal()

  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey])

  return (
    <Menu>
      {base58 && (
        <MenuItem
          onClick={async () => {
            await navigator.clipboard.writeText(base58)
          }}
        >
          <span>Copy Address</span>
          <img src={`${process.env.PUBLIC_URL}/img/assets/copy_address.svg`} alt="copy_address" />
        </MenuItem>
      )}
      {wallet && (
        <MenuItem
          onClick={() => {
            setTimeout(() => setWalletModalVisible(true), 100)
          }}
        >
          <span>Change Wallet</span>
          <img src={`${process.env.PUBLIC_URL}/img/assets/wallet.svg`} alt="change_wallet" />
        </MenuItem>
      )}
      {wallet && (
        <MenuItem
          onClick={() => {
            disconnect().catch(() => {})
            setArrowRotation(false)
          }}
        >
          <span>Disconnect</span>
          <img src={`${process.env.PUBLIC_URL}/img/assets/disconnect.svg`} alt="disconnect" />
        </MenuItem>
      )}
      <MenuItem>
        <NETWORK>Network:</NETWORK>
        <Select
          bordered={false}
          dropdownStyle={{ minWidth: 'fit-content' }}
          onSelect={setEndpoint}
          showArrow={false}
          size="small"
          value={endpoint}
        >
          {ENDPOINTS.map(({ endpoint, network }) => (
            <Select.Option value={endpoint} key={endpoint}>
              {network}
            </Select.Option>
          ))}
        </Select>
      </MenuItem>
    </Menu>
  )
}

export const WalletConnectButton: FC<{
  arrowRotation: boolean
  setArrowRotation: Dispatch<SetStateAction<boolean>>
}> = ({ arrowRotation, setArrowRotation }) => {
  const { wallet, connect, connecting, connected } = useWallet()

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (!event.defaultPrevented) connect().catch(() => {})
    },
    [connect]
  )

  const content = useMemo(() => {
    if (connecting) return 'Connecting ...'
    if (connected) return `Connected with ${wallet?.name}`
    if (wallet) return `Connect with ${wallet.name}`
    return `Connect`
  }, [connecting, connected, wallet])

  return (
    <CONNECT_BUTTON>
      <span onClick={handleClick}>{content}</span>
      {!connecting && (
        <ArrowDropdown
          arrowRotation={arrowRotation}
          offset={[0, 30]}
          onVisibleChange={setArrowRotation}
          overlay={<Overlay setArrowRotation={setArrowRotation} />}
        />
      )}
    </CONNECT_BUTTON>
  )
}

const WalletModalButton: FC<{ arrowRotation: boolean; setArrowRotation: Dispatch<SetStateAction<boolean>> }> = ({
  arrowRotation,
  setArrowRotation
}) => {
  const { setVisible: setWalletModalVisible } = useWalletModal()

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (!event.defaultPrevented) setWalletModalVisible(true)
    },
    [setWalletModalVisible]
  )

  return (
    <CONNECT_BUTTON>
      <span onClick={handleClick}>Connect Wallet</span>
      <ArrowDropdown
        arrowRotation={arrowRotation}
        offset={[9, 30]}
        onVisibleChange={setArrowRotation}
        overlay={<Overlay setArrowRotation={setArrowRotation} />}
      />
    </CONNECT_BUTTON>
  )
}

export const Connect: FC = () => {
  const { publicKey, wallet } = useWallet()
  const [arrowRotation, setArrowRotation] = useState(false)

  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey])
  const content = useMemo(
    () => (!wallet || !base58 ? null : base58.substr(0, 4) + '..' + base58.substr(-4, 4)),
    [wallet, base58]
  )

  if (!wallet) {
    return <WalletModalButton arrowRotation={arrowRotation} setArrowRotation={setArrowRotation} />
  }

  if (!base58) {
    return <WalletConnectButton arrowRotation={arrowRotation} setArrowRotation={setArrowRotation} />
  }

  return (
    <CONNECTED_BUTTON>
      <WALLET_ICON>
        <img src={wallet?.icon} alt={`${wallet?.name}_icon`} />
      </WALLET_ICON>
      <span>{content}</span>
      <ArrowDropdown
        arrowRotation={arrowRotation}
        offset={[9, 30]}
        overlay={<Overlay setArrowRotation={setArrowRotation} />}
        onVisibleChange={setArrowRotation}
      />
    </CONNECTED_BUTTON>
  )
}
