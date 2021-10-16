import React, { BaseSyntheticEvent, FC, MouseEventHandler, useCallback, useMemo } from 'react'
import { Input } from 'antd'
import styled, { css } from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { SynthSelector } from './SynthSelector'
import { MainButton } from '../../../components'
import { useAccounts, useConnectionConfig, useDarkMode, useSynths, useWalletModal } from '../../../context'
import { SpaceBetweenDiv } from '../../../styles'
import { capitalizeFirstLetter } from '../../../utils'
import { ADDRESSES } from '../../../web3'

enum State {
  Connect = 0,
  CanExecute = 1,
  NullAmount = 2,
  AvailableAmountExceeded = 3
}

const AVAILABLE = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  width: 40%;
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
`

const BUTTON = styled(MainButton)`
  margin-left: auto;
`

const SELECTOR = styled.div`
  position: absolute;
  bottom: 7px;
  right: 10px;
`

const INPUT = styled.div`
  position: relative;
  ${({ theme }) => theme.flexColumnNoWrap}
  width: 60%;
  margin-right: ${({ theme }) => theme.margins['3x']};
`

const INPUTS = styled(SpaceBetweenDiv)`
  margin-bottom: ${({ theme }) => theme.margins['5x']};
`

const INPUT_HEADER = styled(SpaceBetweenDiv)`
  margin-bottom: ${({ theme }) => theme.margins['1x']};

  span {
    font-size: 12px;
    font-weight: bold;
    color: ${({ theme }) => theme.text1};
  }

  > span:last-child {
    color: ${({ theme }) => theme.text1h};

    &:hover {
      color: ${({ theme }) => theme.text1};
      cursor: pointer;
    }
  }
`

export const MintBurn: FC<{ action: 'burn' | 'mint' }> = ({ action }) => {
  const { getUIAmount } = useAccounts()
  const { network } = useConnectionConfig()
  const { mode } = useDarkMode()
  const { connect, publicKey, wallet } = useWallet()
  const { setVisible } = useWalletModal()
  const { amount, burn, mint, setAmount, synth, userAccount } = useSynths()

  const cRatioExceeded = useMemo(() => false, [])
  const userBalance = useMemo(
    () => getUIAmount(ADDRESSES[network].mints[synth].address.toString()),
    [getUIAmount, network, synth]
  )

  const state = useMemo(() => {
    if (!publicKey) {
      return State.Connect
    }
    // @ts-ignore
    if (!amount || amount === '0') {
      return State.NullAmount
    }

    if ((action === 'burn' && amount > userBalance) || (action === 'mint' && cRatioExceeded)) {
      return State.AvailableAmountExceeded
    }

    return State.CanExecute
  }, [action, amount, cRatioExceeded, publicKey, userBalance])

  const buttonStatus = useMemo(() => {
    switch (state) {
      case State.CanExecute:
      case State.Connect:
        return 'action'
      case State.AvailableAmountExceeded:
        return 'not-allowed'
      default:
        return 'initial'
    }
  }, [state])

  const canExecuteText = useMemo(() => capitalizeFirstLetter(action), [action])
  const content = useMemo(
    () => ['Connect wallet', canExecuteText, canExecuteText, 'Available amount exceeded'][state],
    [canExecuteText, state]
  )

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (!event.defaultPrevented) {
        const f = action === 'burn' ? burn : mint
        state === State.CanExecute ? f() : !wallet ? setVisible(true) : connect().catch(() => {})
      }
    },
    [action, burn, connect, mint, setVisible, state, wallet]
  )

  const localCSS = css`
    .ant-input {
      height: 39px;
      border: none;
      border-radius: 8px;
      background-color: ${mode === 'dark' ? '#4a4949' : '#bdbdbd'};
      text-align: left;
    }
  `

  return (
    <>
      <INPUTS>
        <style>{localCSS}</style>
        <INPUT>
          <INPUT_HEADER>
            <span>{capitalizeFirstLetter(action)}</span>
            <span onClick={() => setAmount(userBalance)}>Use Max</span>
          </INPUT_HEADER>
          <Input
            maxLength={15}
            onChange={(x: BaseSyntheticEvent) => !isNaN(x.target.value) && setAmount(x.target.value)}
            pattern="\d+(\.\d+)?"
            placeholder={`Amount to ${action}`}
            value={amount || undefined}
          />
          <SELECTOR>
            <SynthSelector />
          </SELECTOR>
        </INPUT>
        <AVAILABLE>
          <span>Available GOFX</span>
          <SpaceBetweenDiv>
            <span>{userAccount.collateral}</span>
            <span>GOFX</span>
          </SpaceBetweenDiv>
        </AVAILABLE>
      </INPUTS>
      <BUTTON height="50px" onClick={handleClick} status={buttonStatus} width="40%">
        <span>{content}</span>
      </BUTTON>
    </>
  )
}
