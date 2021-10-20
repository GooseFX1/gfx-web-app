import React, { BaseSyntheticEvent, FC, MouseEventHandler, useCallback, useMemo } from 'react'
import { Input } from 'antd'
import styled, { css } from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { Available, Button, InputHeader, InputWrapper } from './shared'
import { SynthSelector } from './SynthSelector'
import { useAccounts, useConnectionConfig, useDarkMode, usePrices, useSynths, useWalletModal } from '../../../context'
import { SpaceBetweenDiv } from '../../../styles'
import { capitalizeFirstLetter } from '../../../utils'
import { ADDRESSES } from '../../../web3'

enum State {
  Connect = 0,
  CanExecute = 1,
  NullAmount = 2,
  AvailableAmountExceeded = 3
}

const SELECTOR = styled.div`
  position: absolute;
  bottom: 7px;
  right: 10px;
`

export const MintBurn: FC<{ action: 'burn' | 'mint' }> = ({ action }) => {
  const { getUIAmount } = useAccounts()
  const { network } = useConnectionConfig()
  const { mode } = useDarkMode()
  const { prices } = usePrices()
  const { amount, burn, loading, mint, setAmount, synth, userAccount } = useSynths()
  const { connect, publicKey, wallet } = useWallet()
  const { setVisible } = useWalletModal()

  const cRatioExceeded = useMemo(() => false, [])
  const userBalance = useMemo(() => {
    if (action === 'burn') {
      return getUIAmount(ADDRESSES[network].mints[synth].address.toString())
    } else {
      const cValue = (userAccount.cAmount * prices.GOFX?.current || 0) * 0.5
      return Math.max((cValue - userAccount.shares) / prices[synth].current, 0)
    }
  }, [action, getUIAmount, network, prices, synth, userAccount.cAmount, userAccount.shares])

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
      display: flex;
      height: 39px;
      border: none;
      border-radius: 8px;
      padding-right: 120px;
      background-color: ${mode === 'dark' ? '#4a4949' : '#bdbdbd'};
      text-align: left;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
          <SELECTOR>
            <SynthSelector />
          </SELECTOR>
        </InputWrapper>
        <Available>
          <span>Available</span>
          <SpaceBetweenDiv>
            <span>{userBalance}</span>
            <span>{synth}</span>
          </SpaceBetweenDiv>
        </Available>
      </SpaceBetweenDiv>
      <Button height="50px" loading={loading} onClick={handleClick} status={buttonStatus} width="40%">
        <span>{content}</span>
      </Button>
    </>
  )
}
