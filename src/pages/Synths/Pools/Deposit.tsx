import React, { BaseSyntheticEvent, FC, MouseEventHandler, useCallback, useMemo } from 'react'
import { Input } from 'antd'
import styled, { css } from 'styled-components'
import { useAccounts, useConnectionConfig, useDarkMode, useSynths } from '../../../context'
import { SpaceBetweenDiv } from '../../../styles'
import { ADDRESSES } from '../../../web3'
import { MainButton } from '../../../components'
import { useWallet } from '@solana/wallet-adapter-react'

enum State {
  Connect = 0,
  CanDeposit = 1,
  NullAmount = 2,
  BalanceExceeded = 3
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

const INPUT = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap}
  width: 60%;
  margin-right: ${({ theme }) => theme.margins['3x']};
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

export const Deposit: FC = () => {
  const { getUIAmount } = useAccounts()
  const { network } = useConnectionConfig()
  const { mode } = useDarkMode()
  const { publicKey } = useWallet()
  const { amount, setAmount } = useSynths()

  const userBalance = useMemo(() => getUIAmount(ADDRESSES[network].mints.GOFX.address.toString()), [getUIAmount, network])

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

    return State.CanDeposit
  }, [amount, publicKey, userBalance])

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (!event.defaultPrevented) {
        state === State.CanDeposit ? placeOrder() : !wallet ? setVisible(true) : connect().catch(() => {})
      }
    },
    [connect, placeOrder, setVisible, state, wallet]
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
        <INPUT>
          <INPUT_HEADER>
            <span>Deposit</span>
            <span onClick={() => setAmount(userBalance)}>
              Use Max
            </span>
          </INPUT_HEADER>
          <Input
            maxLength={15}
            onChange={(x: BaseSyntheticEvent) => !isNaN(x.target.value) && setAmount(x.target.value)}
            pattern="\d+(\.\d+)?"
            placeholder={'Amount to deposit'}
            // suffix={<span>{ask}</span>}
            value={amount || undefined}
          />
        </INPUT>
        <AVAILABLE>
          <span>Available GOFX</span>
          <SpaceBetweenDiv>
            <span>{userBalance}</span>
            <span>GOFX</span>
          </SpaceBetweenDiv>
        </AVAILABLE>
      </SpaceBetweenDiv>
      <MainButton height="50px" onClick={handleClick} status={buttonStatus} width="100%">
        <span>test</span>
      </MainButton>
    </>
  )
}
