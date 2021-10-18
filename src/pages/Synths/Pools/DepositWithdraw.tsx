import React, { BaseSyntheticEvent, FC, MouseEventHandler, useCallback, useMemo } from 'react'
import { Input } from 'antd'
import { css } from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { Available, Button, InputHeader, InputWrapper, Synth } from './shared'
import { SynthToken } from '../SynthToken'
import { useAccounts, useConnectionConfig, useDarkMode, useSynths, useWalletModal } from '../../../context'
import { SpaceBetweenDiv } from '../../../styles'
import { capitalizeFirstLetter } from '../../../utils'
import { ADDRESSES } from '../../../web3'

enum State {
  Connect = 0,
  CanExecute = 1,
  NullAmount = 2,
  BalanceExceeded = 3
}

export const DepositWithdraw: FC<{ action: 'deposit' | 'withdraw' }> = ({ action }) => {
  const { getUIAmount } = useAccounts()
  const { network } = useConnectionConfig()
  const { mode } = useDarkMode()
  const { amount, deposit, loading, setAmount, userAccount, withdraw } = useSynths()
  const { connect, publicKey, wallet } = useWallet()
  const { setVisible } = useWalletModal()

  const userBalance = useMemo(
    () =>
      action === 'deposit' ? getUIAmount(ADDRESSES[network].mints.GOFX.address.toString()) : userAccount.collateral,
    [action, getUIAmount, network, userAccount.collateral]
  )

  const state = useMemo(() => {
    if (!publicKey) {
      return State.Connect
    }
    // @ts-ignore
    if (!amount || amount === '0') {
      return State.NullAmount
    }

    if (amount > userBalance) {
      return State.BalanceExceeded
    }

    return State.CanExecute
  }, [amount, publicKey, userBalance])

  const buttonStatus = useMemo(() => {
    switch (state) {
      case State.CanExecute:
      case State.Connect:
        return 'action'
      case State.BalanceExceeded:
        return 'not-allowed'
      default:
        return 'initial'
    }
  }, [state])

  const canExecuteText = useMemo(() => capitalizeFirstLetter(action), [action])
  const content = useMemo(
    () => ['Connect wallet', canExecuteText, canExecuteText, 'Balance exceeded'][state],
    [canExecuteText, state]
  )

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (!event.defaultPrevented) {
        const f = action === 'deposit' ? deposit : withdraw
        state === State.CanExecute ? f() : !wallet ? setVisible(true) : connect().catch(() => {})
      }
    },
    [action, connect, deposit, setVisible, state, wallet, withdraw]
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
      <SpaceBetweenDiv>
        <style>{localCSS}</style>
        <InputWrapper>
          <InputHeader>
            <span>{capitalizeFirstLetter(action)}</span>
            <span onClick={() => setAmount(userBalance)}>Use Max</span>
          </InputHeader>
          <Input
            maxLength={15}
            onChange={(x: BaseSyntheticEvent) => !isNaN(x.target.value) && setAmount(x.target.value)}
            pattern="\d+(\.\d+)?"
            placeholder={`Amount to ${action}`}
            value={amount || undefined}
          />
          <Synth>
            <SynthToken size="large" synth="GOFX" />
          </Synth>
        </InputWrapper>
        <Available>
          <span>Available GOFX</span>
          <SpaceBetweenDiv>
            <span>{userBalance}</span>
            <span>GOFX</span>
          </SpaceBetweenDiv>
        </Available>
      </SpaceBetweenDiv>
      <Button height="50px" loading={loading} onClick={handleClick} status={buttonStatus} width="40%">
        <span>{content}</span>
      </Button>
    </>
  )
}
