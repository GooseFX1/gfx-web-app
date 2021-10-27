import React, { Dispatch, FC, MouseEventHandler, SetStateAction, useCallback, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { Menu, MenuItem } from './shared'
import { ArrowDropdown } from '../../components'
import { useWalletModal } from '../../context'
import { CenteredImg } from '../../styles'

const WALLET_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['3x'])}
  margin-right: ${({ theme }) => theme.margins['2x']};
  ${({ theme }) => theme.roundedBorders}
  background-color: black;

  img {
    ${({ theme }) => theme.measurements(theme.margins['1.5x'])}
  }
`

const WRAPPER = styled.button<{ $connected: boolean }>`
  padding: 0 ${({ theme }) => theme.margins['2x']};
  ${({ theme, $connected }) => $connected && `padding-left: ${theme.margins['1.5x']};`}
  ${({ theme }) => theme.flexCenter}
  height: ${({ theme }) => theme.margins['5x']};
  border: none;
  ${({ theme }) => theme.roundedBorders}
  background-color: ${({ theme }) => theme.secondary3};
  transition: background-color ${({ theme }) => theme.mainTransitionTime} ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.secondary2};
  }

  ${({ theme, $connected }) =>
    $connected &&
    `
    background-image: linear-gradient(to left, ${theme.secondary2}, ${theme.primary2});

    > span {
      cursor: initial !important;
    }
  `}

  span {
    font-size: 12px;
    font-weight: bold;
    color: white;
    cursor: pointer;
  }
`

const Overlay: FC<{ setArrowRotation: Dispatch<SetStateAction<boolean>> }> = ({ setArrowRotation }) => {
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
            disconnect().then()
            setArrowRotation(false)
          }}
        >
          <span>Disconnect</span>
          <img src={`${process.env.PUBLIC_URL}/img/assets/disconnect.svg`} alt="disconnect" />
        </MenuItem>
      )}
    </Menu>
  )
}

export const Connect: FC = () => {
  const { connect, publicKey, wallet } = useWallet()
  const { setVisible: setModalVisible } = useWalletModal()
  const [arrowRotation, setArrowRotation] = useState(false)
  const [visible, setVisible] = useState(false)

  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey])
  const content = useMemo(() => {
    if (!wallet) {
      return 'Connect Wallet'
    } else if (!base58) {
      return `Connect with ${wallet.name}`
    } else {
      return base58.substr(0, 4) + '..' + base58.substr(-4, 4)
    }
  }, [wallet, base58])

  const onSpanClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      !event.defaultPrevented && !wallet ? setModalVisible(true) : connect().catch(() => {})
    },
    [connect, setModalVisible, wallet]
  )

  const onArrowDropdownClick = () => {
    setArrowRotation(!arrowRotation)
    setVisible(!visible)
  }

  return (
    <WRAPPER $connected={!!base58}>
      {wallet && base58 && (
        <WALLET_ICON>
          <img src={wallet.icon} alt={`${wallet.name}_icon`} />
        </WALLET_ICON>
      )}
      <span onClick={onSpanClick}>{content}</span>
      {wallet && (
        <ArrowDropdown
          arrowRotation={arrowRotation}
          offset={[9, 30]}
          overlay={<Overlay setArrowRotation={setArrowRotation} />}
        />
      )}
    </WRAPPER>
  )
}
