import React, { BaseSyntheticEvent, FC, useEffect, useState, useMemo } from 'react'
import { Input } from 'antd'
import styled from 'styled-components'
import { Tooltip } from '../../components'
import { useDarkMode } from '../../context'
import { CenteredDiv } from '../../styles'
import { useWallet } from '@solana/wallet-adapter-react'
import { notify } from '../../utils'

import { NATIVE_MINT, getAssociatedTokenAddress, createCloseAccountInstruction } from '@solana/spl-token-v2'
import { useConnectionConfig } from '../../context'
import { wrapSolToken, signAndSendRawTransaction } from '../../web3'
import { Transaction } from '@solana/web3.js'

const BUTTON = styled.button`
  padding: ${({ theme }) => theme.margin(1.5)};
  border: none;
  ${({ theme }) => theme.roundedBorders}
  background-color: ${({ theme }) => theme.bg10};
  transition: background-color 200ms ease-in-out;

  span {
    font-size: 18px;
    font-weight: 600;
  }
`

const SETTING_BUTTON = styled(BUTTON)<{ clicked: boolean }>`
  width: 166px;
  height: 80px;
  background: inherit;
  border-bottom: 2.5px solid red;
  border-radius: 0px;
  border-color: ${({ clicked, theme }) => (clicked ? theme.secondary2 : theme.bg9)};
  color: ${({ clicked, theme }) => theme.text21};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 500px) {
    width: 83px;
    height: 45px;
    font-size: 18px;
  }
`

const SAVE_BUTTON = styled(BUTTON)`
  height: 70px;
  width: 222px;
  margin-top: 30px;
  border-radius: 10px;

  &:hover {
    background-color: #5855ff;
  }
`

const TITLE = styled.span`
  font-size: 18px;
  color: ${({ theme }) => theme.text13};
`

const BUTTON_CONTAINER = styled(CenteredDiv)`
  justify-content: center;
  margin: 0 !important;
  padding: 24px 12px;
  background-color: inherit;

  @media (max-width: 500px) {
    width: 100%;
  }
`

const INPUT_WRAPPER = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const INPUT_BALANCE = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 60%;
`

const INPUT_BALANCE_BUTTON = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 50%;

  span {
    margin-left: ${({ theme }) => theme.margin(2.5)};
    font-weight: 600;
    font-size: 15px;
    line-height: 24px;
    color: ${({ theme }) => theme.text9};
    cursor: pointer;
    background-color: ${({ theme }) => theme.bg10};
    padding: 4px ${({ theme }) => theme.margin(1.5)};
    border-radius: 1rem;
  }
`

const SETTING_INPUT = styled(Input)`
  padding: 1.5rem;
  height: 75px;
  margin: 1rem 0rem 1.5rem 0rem;
  background-color: ${({ theme }) => theme.bg10 + ' !important'};
  box-shadow: 0 0 0 0 !important;
  border-radius: 10px;
  font-size: 25px !important;
`

export const Wrap: FC<{ setVisible?: (x: boolean) => void }> = ({ setVisible }) => {
  const { mode } = useDarkMode()
  const [wrap, setWrap] = useState(true)
  const [balanceWSOL, setBalanceWSOL] = useState(0)
  const [balance, setBalance] = useState(0)
  //const { getUIAmountString } = useAccounts()
  const { connection, network } = useConnectionConfig()
  const wallet = useWallet()
  const [toggle, setToggle] = useState(false)
  const [value, setValue] = useState(balance / 2)

  useEffect(() => {
    async function getWSOLBalance() {
      try {
        const wsol = await getAssociatedTokenAddress(NATIVE_MINT, wallet.publicKey)
        const wsolbal = await connection.getTokenAccountBalance(wsol)
        setBalanceWSOL(parseFloat(wsolbal.value.uiAmountString.slice(0, 8)))
      } catch (e) {
        console.log(e)
      }
    }

    async function getNSOLBalance() {
      try {
        const solbal = await connection.getBalance(wallet.publicKey)
        const val = parseFloat((solbal / 10 ** 9 + '').slice(0, 8))
        setBalance(val)
        if (wrap) setValue(val / 2)
      } catch (e) {
        console.log(e)
      }
    }

    getWSOLBalance()
    getNSOLBalance()
  }, [connection, wallet.publicKey, toggle])

  const wrapper = async () => {
    notify({ message: `Trying to wrap native Solana Token` })
    try {
      const txn = await wrapSolToken(wallet, connection, Math.floor(value * 10 ** 9))
      const finalResult = await signAndSendRawTransaction(connection, txn, wallet)

      const result = finalResult ? await connection.confirmTransaction(finalResult) : null

      if (!result.value.err) {
        notify({
          type: 'success',
          message: 'Solana Wrap successful!',
          description: `You wrapped ${value} native SOL`,
          icon: 'success',
          txid: finalResult,
          network: network
        })
        setToggle(!toggle)
      } else {
        notify({ type: 'error', message: 'Sol Wrap failed', icon: 'error' }, null)
      }
    } catch (e) {
      notify({ type: 'error', message: 'Sol Wrap failed', icon: 'error' }, e)
    }
  }

  const unwrapper = async () => {
    notify({ message: `Trying to unwrap wrapped Solana Token` })
    try {
      const txn = new Transaction()
      const associatedTokenAccount = await getAssociatedTokenAddress(NATIVE_MINT, wallet.publicKey)
      if (associatedTokenAccount) {
        const tr = createCloseAccountInstruction(associatedTokenAccount, wallet.publicKey, wallet.publicKey)
        txn.add(tr)

        const finalResult = await signAndSendRawTransaction(connection, txn, wallet)

        const result = finalResult ? await connection.confirmTransaction(finalResult) : null

        if (!result.value.err) {
          notify({
            type: 'success',
            message: 'Solana Unwrap successful!',
            description: `You unwrapped ${balanceWSOL} wrapped SOL`,
            icon: 'success',
            txid: finalResult,
            network: network
          })
          setToggle(!toggle)
        } else {
          notify({ type: 'error', message: 'Sol Wrap failed', icon: 'error' }, null)
        }
      }
    } catch (e) {
      notify({ type: 'error', message: 'Sol Wrap failed', icon: 'error' }, e)
    }
  }

  const toggleWrap = async () => {
    if (wrap) {
      await wrapper()
    } else {
      await unwrapper()
    }
  }

  const BODY = styled(CenteredDiv)`
    flex-direction: column;
    flex: 1;
    width: 100%;
    height: 100%;
    overflow: hidden;
    font-family: Montserrat;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
    margin-top: ${({ theme }) => theme.margin(4)};
    padding-bottom: ${({ theme }) => theme.margin(2.5)};

    > div {
      display: flex;
      align-items: center;
      width: 100%;

      &:nth-child(2) {
        margin: ${({ theme }) => theme.margin(3)} 0;
      }
    }

    .ant-input {
      font-size: 25px;
    }

    .ant-input-affix-wrapper {
      position: relative;
      display: flex;
      flex: 5;
      align-items: center;
      border: 0px solid black !important;
      background-color: ${mode === 'dark' ? '#474747' : '#808080'};
      box-shadow: 0 4px 15px 2px rgb(0, 0, 0, ${mode === 'dark' ? '0.25' : '0.1'});
    }

    .modal-close-icon > img {
      height: 24px;
      width: 24px;
    }
  `

  return (
    <BODY>
      <div>
        <TITLE>Wrap / Unwrap SOL</TITLE>
        <Tooltip notInherit={true}>You can now manually wrap SOL and unwrap wSOL here.</Tooltip>
      </div>
      <BUTTON_CONTAINER>
        <SETTING_BUTTON
          clicked={wrap}
          onClick={() => {
            setWrap(true)
          }}
        >
          <span>SOL</span>
          <span>{balance} SOL</span>
        </SETTING_BUTTON>
        <SETTING_BUTTON
          clicked={!wrap}
          onClick={() => {
            setWrap(false)
          }}
        >
          <span>WSOL</span>
          <span>{balanceWSOL} sol</span>
        </SETTING_BUTTON>
      </BUTTON_CONTAINER>
      {wrap && (
        <>
          <INPUT_WRAPPER>
            <TITLE>You wrap</TITLE>
            <INPUT_BALANCE>
              <div>Balance {wrap ? balance : balanceWSOL} SOL</div>
              <INPUT_BALANCE_BUTTON>
                <span onClick={() => setValue(balance / 2)}>Half</span>
                <span onClick={() => setValue(balance)}>Max</span>
              </INPUT_BALANCE_BUTTON>
            </INPUT_BALANCE>
          </INPUT_WRAPPER>
          <div>
            {/* <style>{locCSS}</style> */}
            <SETTING_INPUT
              maxLength={6}
              onChange={(x: BaseSyntheticEvent) =>
                !isNaN(x.target.value) && setValue(x.target.value >= 25 ? 25 : x.target.value)
              }
              pattern="\d+(\.\d+)?"
              placeholder={value.toString()}
              suffix={<span>SOL</span>}
              value={value}
            />
          </div>
        </>
      )}

      <SAVE_BUTTON onClick={() => toggleWrap()}>
        {wrap ? <span>Wrap SOL</span> : <span> Unwrap wSOL to SOL </span>}
      </SAVE_BUTTON>
    </BODY>
  )
}
