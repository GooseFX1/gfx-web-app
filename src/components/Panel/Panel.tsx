import React, { Dispatch, FC, MouseEventHandler, ReactNode, SetStateAction, useCallback } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { Header } from './Header'
import { MainButton } from '../MainButton'
import { useWalletModal } from '../../context'
import { CenteredDiv } from '../../styles'

const BODY = styled(CenteredDiv)`
  flex-direction: column;
  height: 100%;
  padding: ${({ theme }) => theme.margin(3)} 0;
  min-height: 138px;

  > div:not(:last-child) {
    margin-bottom: ${({ theme }) => theme.margin(1.5)};
  }
`

const CONNECT = styled.div`
  margin: ${({ theme }) => theme.margin(3)} 0;
`

const WRAPPER = styled.div<{ $coverVisible: boolean; $minHeight?: string }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  ${({ $minHeight }) => $minHeight && `min-height: ${$minHeight};`}
  margin-top: ${({ theme, $coverVisible }) => ($coverVisible ? theme.margin(3) : '0')};
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
  minHeight?: string
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
  minHeight,
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
        !wallet
          ? setVisible(true)
          : connect().catch((e: Error) => {
              console.log(e)
            })
      }
    },
    [connect, setVisible, wallet]
  )

  return (
    <WRAPPER $coverVisible={coverVisible} $minHeight={minHeight}>
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
        {publicKey ? (
          children
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
