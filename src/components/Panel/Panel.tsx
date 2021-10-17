import React, { Dispatch, FC, MouseEventHandler, ReactNode, SetStateAction, useCallback } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { Header } from './Header'
import { MainButton } from '../MainButton'
import { useWalletModal } from '../../context'
import { CenteredDiv } from '../../styles'

const BODY = styled(CenteredDiv)`
  flex-direction: column;
  padding: ${({ theme }) => theme.margins['3x']} 0;

  > div:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.margins['1.5x']};
  }
`

const CONNECT = styled.div`
  margin: ${({ theme }) => theme.margins['3x']} 0;
`

const WRAPPER = styled.div<{ $coverVisible: boolean }>`
  margin-top: ${({ theme, $coverVisible }) => ($coverVisible ? theme.margins['3x'] : '0')};
  ${({ theme }) => theme.largeBorderRadius}
  ${({ theme }) => theme.largeShadow}
  background-color: ${({ theme }) => theme.bg3};
  transition: margin-top ${({ theme }) => theme.mainTransitionTime} ease-in-out;
`

export const Panel: FC<{
  activePanel: any
  centerLabels?: boolean
  coverVisible: boolean
  children: ReactNode
  expand: Dispatch<SetStateAction<boolean>>
  fields: { [x: string]: string[] }
  justify: string
  panels: any[]
  setPanel: Dispatch<SetStateAction<any>>
  underlinePositions: string[]
  underlineWidths: string[]
}> = ({
  activePanel,
  centerLabels = false,
  children,
  coverVisible,
  expand,
  fields,
  justify,
  panels,
  setPanel,
  underlinePositions,
  underlineWidths
}) => {
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

  return (
    <WRAPPER $coverVisible={coverVisible}>
      <Header
        activePanel={activePanel}
        centerLabels={centerLabels}
        expand={expand}
        fields={fields}
        justify={justify}
        panels={panels}
        setPanel={setPanel}
        underlinePositions={underlinePositions}
        underlineWidths={underlineWidths}
      />
      <BODY>
        {publicKey ? children : (
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
