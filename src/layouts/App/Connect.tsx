import React, {
  Dispatch,
  FC,
  MouseEventHandler,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
  useEffect
} from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { Menu, MenuItem } from './shared'
import { ArrowDropdown } from '../../components'
import { useWalletModal } from '../../context'
import { CenteredImg } from '../../styles'
import { Loader } from '../../components'

const WALLET_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margin(3))}
  margin-right: ${({ theme }) => theme.margin(2)};
  ${({ theme }) => theme.roundedBorders}
  background-color: black;

  img {
    ${({ theme }) => theme.measurements(theme.margin(1.5))}
  }
`
const WRAPPED_LOADER = styled.div`
  width: 40px;
  margin: 0 -12px 0 12px;
`

const WRAPPER = styled.button<{ $connected: boolean }>`
  padding: 0 ${({ theme }) => theme.margin(2)};
  ${({ theme, $connected }) => $connected && `padding-left: ${theme.margin(1.5)};`}
  ${({ theme }) => theme.flexCenter}
  height: 36px;
  border: none;
  ${({ theme }) => theme.roundedBorders}
  ${({ theme }) => theme.smallShadow}
  background-color: ${({ theme }) => theme.secondary3};
  transition: background-color ${({ theme }) => theme.mainTransitionTime} ease-in-out;
  cursor: pointer;

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
          <img src={`${window.origin}/img/assets/copy_address.svg`} alt="copy_address" />
        </MenuItem>
      )}
      {wallet && (
        <MenuItem
          onClick={() => {
            setTimeout(() => setWalletModalVisible(true), 100)
          }}
        >
          <span>Change Wallet</span>
          <img src={`${window.origin}/img/assets/wallet.svg`} alt="change_wallet" />
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
          <img src={`${window.origin}/img/assets/disconnect.svg`} alt="disconnect" />
        </MenuItem>
      )}
    </Menu>
  )
}

export const Connect: FC = () => {
  const { connect, publicKey, wallet, ready, connected } = useWallet()
  const { setVisible: setModalVisible } = useWalletModal()
  const [arrowRotation, setArrowRotation] = useState(false)
  const [visible, setVisible] = useState(false)

  const base58 = useMemo(() => publicKey?.toBase58(), [publicKey])
  const content = useMemo(() => {
    if (!wallet) {
      return 'Connect Wallet'
    } else if (!base58) {
      return (
        <WRAPPED_LOADER>
          <Loader />
        </WRAPPED_LOADER>
      )
    } else {
      return base58.substr(0, 4) + '..' + base58.substr(-4, 4)
    }
  }, [wallet, base58])

  const onSpanClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (!event.defaultPrevented && !wallet) {
        setModalVisible(true)
      }
    },
    [setModalVisible, wallet]
  )

  const onArrowDropdownClick = () => {
    setArrowRotation(!arrowRotation)
    setVisible(!visible)
  }

  // watches for a selected wallet returned from modal
  useEffect(() => {
    if (ready && !base58 && !connected) {
      connect().catch(() => {})
    }
  }, [ready])

  // watches for disconnection of wallet
  useEffect(() => {
    if (ready && !base58 && !connected) {
      // timeout used for smooth loading that matches the rate of tab slider
      setTimeout(() => connect().catch(() => {}), 400)
    }
  }, [connected])

  return (
    <WRAPPER $connected={!!base58} onClick={onSpanClick}>
      {wallet && base58 && (
        <WALLET_ICON>
          <img src={wallet.icon} alt={`${wallet.name}_icon`} />
        </WALLET_ICON>
      )}
      <span>{content}</span>
      {wallet && (
        <ArrowDropdown
          arrowRotation={arrowRotation}
          offset={[9, 30]}
          overlay={<Overlay setArrowRotation={setArrowRotation} />}
          onVisibleChange={onArrowDropdownClick}
        />
      )}
    </WRAPPER>
  )
}
