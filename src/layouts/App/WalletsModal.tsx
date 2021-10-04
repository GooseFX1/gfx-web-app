import React, { FC, useCallback } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { WalletName } from '@solana/wallet-adapter-wallets'
import { Modal } from '../../components'
import { LITEPAPER_ADDRESS } from '../../constants'
import { useWalletModal } from '../../context'
import { CenteredDiv, CenteredImg, SpaceBetweenDiv } from '../../styles'

const BODY = styled(CenteredDiv)`
  flex-direction: column;
`

const DISCLAIMER = styled.span`
  margin-top: ${({ theme }) => theme.margins['2x']};
  padding: ${({ theme }) => theme.margins['1x']};
  border: solid 1px ${({ theme }) => theme.grey2};
  ${({ theme }) => theme.smallBorderRadius}
  font-size: 8px;
  text-align: left;
  color: ${({ theme }) => theme.text1};

  a {
    color: ${({ theme }) => theme.text3};
  }
`

const ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements(theme.margins['4x'])}
  ${({ theme }) => theme.roundedBorders}
  background-color: black;

  img {
    ${({ theme }) => theme.measurements(theme.margins['2x'])}
  }
`

const NAME = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.text1};
`

const WALLET = styled(SpaceBetweenDiv)`
  width: 100%;
  margin-top: ${({ theme }) => theme.margins['2x']};
  padding: ${({ theme }) => theme.margins['1x']};
  padding-left: ${({ theme }) => theme.margins['2x']};
  border-radius: ${({ theme }) => theme.margins['3x']};
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

  const handleCancel = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!event.defaultPrevented) setVisible(false)
    },
    [setVisible]
  )

  const handleWalletClick = useCallback(
    (event: React.MouseEvent<HTMLElement>, walletName: WalletName) => {
      select(walletName)
      handleCancel(event)
    },
    [select, handleCancel]
  )

  return (
    <Modal setVisible={setVisible} title="Connect to a wallet" visible={visible}>
      <BODY>
        <DISCLAIMER>
          By connecting a wallet, you agree to GooseFX, <a>Terms of Service</a> and acknowledge that you have read and
          you understand the&nbsp;
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
