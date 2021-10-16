import React, { Dispatch, FC, MouseEventHandler, ReactNode, SetStateAction, useCallback, useState } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { Collateral } from './Collateral'
import { Tokens } from './Tokens'
import { MainButton, PanelHeader } from '../../../components'
import { useWalletModal } from '../../../context'
import { CenteredDiv } from '../../../styles'

const BODY = styled(CenteredDiv)`
  flex-direction: column;
  margin: ${({ theme }) => theme.margins['3x']} -${({ theme }) => theme.margins['5x']} 0;
  padding: ${({ theme }) => theme.margins['1x']} ${({ theme }) => theme.margins['3x']}
    ${({ theme }) => theme.margins['4x']};

  > div:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.margins['1.5x']};
  }
`

const CONNECT = styled.div`
  margin: ${({ theme }) => theme.margins['3x']} 0;
`

const WRAPPER = styled.div<{ $poolsVisible: boolean }>`
  margin-top: ${({ theme, $poolsVisible }) => ($poolsVisible ? theme.margins['3x'] : '0')};
  ${({ theme }) => theme.largeBorderRadius}
  ${({ theme }) => theme.largeShadow}
  background-color: ${({ theme }) => theme.bg3};
  transition: margin-top ${({ theme }) => theme.mainTransitionTime} ease-in-out;
`

export const Positions: FC<{
  poolsVisible: boolean
  setPoolsVisible: Dispatch<SetStateAction<boolean>>
}> = ({ poolsVisible, setPoolsVisible }) => {
  const { connect, publicKey, wallet } = useWallet()
  const { setVisible } = useWalletModal()
  const [panel, setPanel] = useState<'gTokens' | 'Collateral'>('gTokens')

  const panels = [
    { component: <Tokens />, display: 'gTokens' },
    { component: <Collateral />, display: 'Collateral' }
  ] as { component: ReactNode; display: string }[]

  const fields = {
    gTokens: ['Market', 'Current Price', 'Average Price', 'Amount', 'Profit/Loss', 'Debt'],
    Collateral: []
  }

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (!event.defaultPrevented) {
        !wallet ? setVisible(true) : connect().catch(() => {})
      }
    },
    [connect, setVisible, wallet]
  )

  return (
    <WRAPPER $poolsVisible={poolsVisible}>
      <PanelHeader
        activePanel={panel}
        centerLabels
        expand={() => setPoolsVisible((prevState) => !prevState)}
        fields={fields}
        justify="space-evenly"
        panels={[panels[0].display, panels[1].display]}
        setPanel={setPanel}
        underlinePositions={['103px', '375px']}
        underlineWidths={['70px', '78px']}
      />
      <BODY>
        {publicKey ? (
          panels.find(({ display }) => display === panel)!.component
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
