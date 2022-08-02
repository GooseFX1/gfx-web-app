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
import { WalletName } from '@solana/wallet-adapter-base'
import { truncateAddress } from '../../utils'
import tw from 'twin.macro'

const WALLET_ICON = styled(CenteredImg)`
  ${tw`bg-black h-6 w-6 mr-4 rounded-circle`}

  img {
    ${tw`h-3 w-3`}
  }
`
const WRAPPED_LOADER = styled.div`
  ${tw`w-10 relative my-0 mr-[-12px] ml-3`}

  div {
    ${tw`top-[-26px]`}
  }
`

const WRAPPER = styled.button<{ $connected: boolean }>`
  ${tw`py-0 px-4 flex items-center justify-center border-none border-0 h-9 rounded-circle cursor-pointer`}
  ${({ theme, $connected }) => $connected && `padding-left: ${theme.margin(1.5)};`}
  ${({ theme }) => theme.smallShadow}
  background-color: ${({ theme }) => theme.secondary3};
  transition: background-color ${({ theme }) => theme.mainTransitionTime} ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.secondary2};
  }

  ${({ theme, $connected }) =>
    $connected &&
    `
    background-image: linear-gradient(to left, ${theme.primary3}, ${theme.secondary6});

    > span {
      cursor: initial !important;
    }
  `}

  span {
    ${tw`text-xs font-bold text-white`}
    line-height: normal;
  }
`
const SVGModeAdjust = styled.img`
  filter: ${({ theme }) => theme.filterWhiteIcon};
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
          <SVGModeAdjust src={`${window.origin}/img/assets/copy_address.svg`} alt="copy_address" />
        </MenuItem>
      )}
      {wallet && (
        <MenuItem
          onClick={() => {
            setTimeout(() => setWalletModalVisible(true), 100)
          }}
        >
          <span>Change Wallet</span>
          <SVGModeAdjust src={`${window.origin}/img/assets/wallet.svg`} alt="change_wallet" />
        </MenuItem>
      )}
      {wallet && (
        <MenuItem
          onClick={() => {
            disconnect().then()
            localStorage.removeItem('connectedWallet')
            setArrowRotation(false)
          }}
        >
          <span>Disconnect</span>
          <SVGModeAdjust src={`${window.origin}/img/assets/disconnect.svg`} alt="disconnect" />
        </MenuItem>
      )}
    </Menu>
  )
}

export const Connect: FC = () => {
  const { connect, select, wallet, publicKey, connected } = useWallet()
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
      return truncateAddress(base58)
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
    if (!base58 && !connected) {
      connect().catch(() => {})
    }
  }, [base58, connected])

  useEffect(() => {
    const walletName = localStorage.getItem('connectedWallet')
    if (!base58 && !connected && walletName) {
      switch (walletName) {
        case 'Phantom': {
          select('Phantom' as WalletName<string>)
          break
        }
        case 'Solflare': {
          select('Solflare' as WalletName<string>)
          break
        }
        // case 'Ledger': {
        //   select('Ledger' as WalletName<string>)
        //   break
        // }
        case 'MathWallet': {
          select('MathWallet' as WalletName<string>)
          break
        }
        case 'Slope': {
          select('Slope' as WalletName<string>)
          break
        }
        case 'Solang': {
          select('Solang' as WalletName<string>)
          break
        }
        case 'Torus': {
          select('Torus' as WalletName<string>)
          break
        }
        case 'Sollet': {
          select('Sollet' as WalletName<string>)
          break
        }
        case 'Glow': {
          select('Glow' as WalletName<string>)
          break
        }
      }
    }
  }, [])

  // watches for disconnection of wallet
  useEffect(() => {
    if (connected) {
      localStorage.setItem('connectedWallet', wallet.adapter.name)
    }
    if (!base58 && !connected) {
      // timeout used for smooth loading that matches the rate of tab slider
      setTimeout(() => connect().catch(() => {}), 400)
    }
  }, [base58, connected])

  return (
    <WRAPPER $connected={!!base58} onClick={onSpanClick}>
      {wallet && base58 && (
        <WALLET_ICON>
          <img src={wallet.adapter.icon} alt={`${wallet.adapter.name}_icon`} />
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
