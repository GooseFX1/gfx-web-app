import React, { FC, MouseEventHandler, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { SynthToken } from './SynthToken'
import { MainButton } from '../../../components'
import { useSynths, useWalletModal } from '../../../context'
import { SpaceBetweenDiv } from '../../../styles'

enum State {
  Connect = 0,
  CanExecute = 1,
  NullAmount = 2
}

const BUTTON = styled(MainButton)`
  margin-left: auto;
`

const REWARDS = styled(SpaceBetweenDiv)`
  margin-bottom: ${({ theme }) => theme.margins['5x']};

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

const SYNTH = styled.div`
  position: absolute;
  bottom: 7px;
  right: 10px;
`

export const Claim: FC = () => {
  const { connect, publicKey, wallet } = useWallet()
  const { setVisible } = useWalletModal()
  const { claim } = useSynths()

  const allTime = useMemo(() => 12390, [])
  const current = useMemo(() => 120, [])

  const state = useMemo(() => {
    if (!publicKey) {
      return State.Connect
    }
    // @ts-ignore
    if (!current) {
      return State.NullAmount
    }

    return State.CanExecute
  }, [current, publicKey])

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
        <div>
          <span>Historical</span>
          <SpaceBetweenDiv>
            <span>{allTime}</span>
            <SYNTH>
              <SynthToken synth="gUSD" />
            </SYNTH>
          </SpaceBetweenDiv>
        </div>
        <div>
          <span>Current</span>
          <SpaceBetweenDiv>
            <span>{current}</span>
            <SYNTH>
              <SynthToken synth="gUSD" />
            </SYNTH>
          </SpaceBetweenDiv>
        </div>
      </REWARDS>
      <BUTTON height="50px" onClick={handleClick} status={buttonStatus} width="40%">
        <span>{content}</span>
      </BUTTON>
    </>
  )
}
