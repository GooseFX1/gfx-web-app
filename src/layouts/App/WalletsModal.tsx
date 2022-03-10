import React, { FC, useCallback, useState } from 'react'
import { logEvent } from 'firebase/analytics'
import analytics from '../../analytics'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletName } from '@solana/wallet-adapter-wallets'
import { TermsOfService } from './TermsOfService'
import { Modal } from '../../components'
import { LITEPAPER_ADDRESS } from '../../constants'
import { useWalletModal } from '../../context'
import { CenteredDiv, CenteredImg, SpaceBetweenDiv } from '../../styles'

const BODY = styled(CenteredDiv)`
  flex-direction: column;
`

const DISCLAIMER = styled.span`
  margin-top: ${({ theme }) => theme.margin(2)};
  padding: ${({ theme }) => theme.margin(1)};
  border: solid 1px ${({ theme }) => theme.grey2};
  ${({ theme }) => theme.smallBorderRadius}
  font-size: 8px;
  text-align: left;
  color: ${({ theme }) => theme.text1};

  a,
  span {
    color: ${({ theme }) => theme.text3};
    cursor: pointer;
  }
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
  const [termsOfServiceVisible, setTermsOfServiceVisible] = useState(false)

  const handleCancel = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!event.defaultPrevented) setVisible(false)
    },
    [setVisible]
  )

  const handleTOS = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!event.defaultPrevented) setTermsOfServiceVisible(true)
    },
    [setTermsOfServiceVisible]
  )

  const handleWalletClick = useCallback(
    (event: React.MouseEvent<HTMLElement>, walletName: WalletName) => {
      // analytics logger
      logEvent(analytics, 'wallet-selection', {
        walletName: walletName
      })
      select(walletName)
      handleCancel(event)
    },
    [select, handleCancel]
  )

  return (
    <Modal setVisible={setVisible} title="Connect to a wallet" visible={visible}>
      <BODY>
        <DISCLAIMER>
          <TermsOfService setVisible={setTermsOfServiceVisible} visible={termsOfServiceVisible} />
          By connecting a wallet, you agree to GooseFX,&nbsp;<span onClick={handleTOS}>Terms of Service</span>
          &nbsp;and acknowledge that you have read and you understand the&nbsp;
          <a href={`${LITEPAPER_ADDRESS}/#disclaimer`} target="_blank" rel="noopener noreferrer">
            GooseFX protocol disclaimer
          </a>
          .
        </DISCLAIMER>
        {wallets.map((wallet, index) => (
          <WALLET key={index} onClick={(event) => handleWalletClick(event, wallet.name)}>
            <NAME>{wallet.name}</NAME>
            <ICON>
              <img src={wallet.icon} alt="icon" />
            </ICON>
          </WALLET>
        ))}
      </BODY>
    </Modal>
  )
}
