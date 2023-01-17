import React, { FC, useCallback, useState, useEffect } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletName, WalletReadyState } from '@solana/wallet-adapter-base'
import { TermsOfService } from './TermsOfService'
import { USER_CONFIG_CACHE } from '../types/app_params'
import { Modal } from '../components'
// import { LITEPAPER_ADDRESS } from '../constants'
import { useWalletModal } from '../context'
import { CenteredImg, SpaceBetweenDiv } from '../styles'

const BODY = styled.div`
  max-height: 64vh;
  padding: 0 8px 16px 12px;
  overflow-y: scroll;
  margin-top: 16px;
  ${({ theme }) => theme.customScrollBar('4px')}
`

const ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margin(4))}
  ${({ theme }) => theme.roundedBorders}
  background-color: black;

  img {
    ${({ theme }) => theme.measurements(theme.margin(2))}
  }
`

const NAME = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.text1};
`

const WALLET = styled(SpaceBetweenDiv)`
  width: 100%;
  margin-top: ${({ theme }) => theme.margin(2)};
  padding: ${({ theme }) => theme.margin(1)};
  padding-left: ${({ theme }) => theme.margin(2)};
  border-radius: ${({ theme }) => theme.margin(3)};
  background-color: ${({ theme }) => theme.walletModalWallet};
  ${({ theme }) => theme.smallShadow}
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.secondary2};

    span {
      color: white;
    }
  }
`

export const WalletsModal: FC = () => {
  const { wallets, select } = useWallet()
  const { setVisible, visible } = useWalletModal()
  const [termsOfServiceVisible, setTermsOfServiceVisible] = useState<boolean>(false)
  const existingUserCache: USER_CONFIG_CACHE = JSON.parse(window.localStorage.getItem('gfx-user-cache'))

  useEffect(() => {
    if (visible && !termsOfServiceVisible && !existingUserCache.hasSignedTC) {
      setVisible(false)
      setTermsOfServiceVisible(true)
    }
  }, [visible])

  const handleCancel = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!event.defaultPrevented) setVisible(false)
    },
    [setVisible]
  )

  const handleWalletClick = useCallback(
    (event: React.MouseEvent<HTMLElement>, walletName: WalletName<string>) => {
      select(walletName)
      handleCancel(event)
    },
    [select, handleCancel]
  )

  return !existingUserCache.hasSignedTC && termsOfServiceVisible ? (
    <TermsOfService setVisible={setTermsOfServiceVisible} visible={termsOfServiceVisible} />
  ) : (
    <Modal setVisible={setVisible} title="Connect to a wallet" visible={visible}>
      <BODY>
        {wallets
          .filter(({ readyState }) => readyState !== WalletReadyState.Unsupported)
          .map((wallet, index) => (
            <WALLET key={index} onClick={(event) => handleWalletClick(event, wallet.adapter.name)}>
              <NAME>{wallet.adapter.name}</NAME>
              <ICON>
                <img src={wallet.adapter.icon} alt="icon" />
              </ICON>
            </WALLET>
          ))}
      </BODY>
    </Modal>
  )
}
