import React, { FC, MouseEventHandler, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { Bottom, Button, Synth } from './shared'
import { SynthToken } from '../SynthToken'
import { useSynths, useWalletModal } from '../../../context'
import { CenteredDiv, SpaceBetweenDiv } from '../../../styles'

enum State {
  Connect = 0,
  CanExecute = 1,
  NullAmount = 2
}

const REWARDS = styled(CenteredDiv)`
  > div {
    position: relative;
    ${({ theme }) => theme.flexColumnNoWrap}
    width: 45%;
    text-align: left;

    > div {
      height: 39px;
      margin-top: ${({ theme }) => theme.margins['1x']};
      padding: 4px 11px;
      ${({ theme }) => theme.smallBorderRadius}
      background-color: ${({ theme }) => theme.bg5};
    }

    > span {
      font-size: 12px;
      font-weight: bold;
      color: ${({ theme }) => theme.text1};
    }
  }
`

export const Claim: FC = () => {
  const { connect, publicKey, wallet } = useWallet()
  const { setVisible } = useWalletModal()
  const { claim, loading, userAccount, userPortfolio } = useSynths()

  const current = useMemo(
    () => (userAccount.claimableFee + userPortfolio.pendingFees).toFixed(2),
    [userAccount.claimableFee, userPortfolio.pendingFees]
  )

  const state = useMemo(() => {
    if (!publicKey) {
      return State.Connect
    }
    // @ts-ignore
    if (userAccount.claimableFee < 0.01) {
      return State.NullAmount
    }

    return State.CanExecute
  }, [publicKey, userAccount.claimableFee])

  const buttonStatus = useMemo(() => {
    switch (state) {
      case State.CanExecute:
      case State.Connect:
        return 'action'
      default:
        return 'initial'
    }
  }, [state])

  const content = useMemo(() => ['Connect wallet', 'Claim', 'Claim'][state], [state])

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (!event.defaultPrevented) {
        state === State.CanExecute ? claim() : !wallet ? setVisible(true) : connect().catch(() => {})
      }
    },
    [claim, connect, setVisible, state, wallet]
  )

  return (
    <>
      <REWARDS>
        {/* <div>
          <span>Historical</span>
          <SpaceBetweenDiv>
            <span>{allTime}</span>
            <Synth>
              <SynthToken size="large" synth="gUSD" />
            </Synth>
          </SpaceBetweenDiv>
        </div> */}
        <div>
          <span>Current</span>
          <SpaceBetweenDiv>
            <span>{userAccount.claimableFee < 0.1 ? 0 : current}</span>
            <Synth>
              <SynthToken size="large" synth="gUSD" />
            </Synth>
          </SpaceBetweenDiv>
        </div>
      </REWARDS>
      <Bottom>
        <span>Fees are earned by providing GOFX as collateral in a pool.</span>
        <Button height="50px" loading={loading} onClick={handleClick} status={buttonStatus} width="40%">
          <span>{content}</span>
        </Button>
      </Bottom>
    </>
  )
}
