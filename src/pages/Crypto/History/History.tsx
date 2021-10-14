import React, { Dispatch, FC, MouseEventHandler, SetStateAction, useCallback } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { Balances } from './Balances'
import { Header } from './Header'
import { Orders } from './Orders'
import { Trades } from './Trades'
import { MainButton } from '../../../components'
import { HistoryPanel, useTradeHistory, useWalletModal } from '../../../context'
import { CenteredDiv } from '../../../styles'

const BODY = styled(CenteredDiv)`
  flex-direction: column;
  margin: ${({ theme }) => theme.margins['3x']} -${({ theme }) => theme.margins['5x']} 0;
  padding: ${({ theme }) => theme.margins['1x']} ${({ theme }) => theme.margins['3x']};

  > div:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.margins['1.5x']};
  }
`

const CONNECT = styled.div`
  margin: ${({ theme }) => theme.margins['3x']} 0;
`

const WRAPPER = styled.div<{ chartsVisible: boolean }>`
  margin-top: ${({ theme, chartsVisible }) => (chartsVisible ? theme.margins['3x'] : '0')};
  padding: ${({ theme }) => theme.margins['2x']} ${({ theme }) => theme.margins['2x']};
  ${({ theme }) => theme.margins['1.5x']};
  border-radius: 10px;
  background-color: ${({ theme }) => theme.bg3};
  transition: margin-top ${({ theme }) => theme.mainTransitionTime} ease-in-out;
`

export const History: FC<{
  chartsVisible: boolean
  setChartsVisible: Dispatch<SetStateAction<boolean>>
}> = ({ chartsVisible, setChartsVisible }) => {
  const { panel } = useTradeHistory()
  const { connect, publicKey, wallet } = useWallet()
  const { setVisible } = useWalletModal()

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (!event.defaultPrevented) {
        !wallet ? setVisible(true) : connect().catch(() => {})
      }
    },
    [connect, setVisible, wallet]
  )

  const content = panel === HistoryPanel.Orders ? <Orders /> : panel === HistoryPanel.Trades ? <Trades /> : <Balances />

  return (
    <WRAPPER chartsVisible={chartsVisible}>
      <Header setChartsVisible={setChartsVisible} />
      <BODY>
        {publicKey ? (
          content
        ) : (
          <CONNECT>
            <MainButton height={'40px'} status="action" width={'160px'} onClick={handleClick}>
              <span>Connect Wallet</span>
            </MainButton>
          </CONNECT>
        )}
      </BODY>
    </WRAPPER>
  )
}
