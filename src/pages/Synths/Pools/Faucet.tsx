import React, { FC, MouseEventHandler, useCallback, useMemo } from 'react'
import styled from 'styled-components'
import { useWallet } from '@solana/wallet-adapter-react'
import { Bottom, Button, Synth } from './shared'
import { SynthToken } from '../SynthToken'
import { useAccounts, useConnectionConfig, useSynths, useWalletModal } from '../../../context'
import { CenteredDiv, SpaceBetweenDiv } from '../../../styles'
import {
  ADDRESSES,
  createAssociatedTokenAccountIx,
  findAssociatedTokenAddress,
  signAndSendRawTransaction
} from '../../../web3'
import { notify } from '../../../utils'
import { PublicKey, Transaction } from '@solana/web3.js'
import { Token, TOKEN_PROGRAM_ID } from '@solana/spl-token'

enum State {
  Connect = 0,
  CanExecute = 1,
  NullAmount = 2
}

const BOTTOM = styled(Bottom)`
  a > span {
    color: white;
    text-decoration: underline;

    &:hover {
      color: ${({ theme }) => theme.text3};
    }
  }
`

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

export const Faucet: FC = () => {
  const { fetchAccounts, getUIAmount } = useAccounts()
  const { connection, network } = useConnectionConfig()
  const { setVisible } = useWalletModal()
  const { loading } = useSynths()
  const wallet = useWallet()

  const current = useMemo(() => getUIAmount(ADDRESSES[network].mints.GOFX.address.toString()), [getUIAmount, network])

  const state = useMemo(() => {
    if (!wallet.publicKey) {
      return State.Connect
    }
    // @ts-ignore
    if (current) {
      return State.NullAmount
    }

    return State.CanExecute
  }, [current, wallet.publicKey])

  const buttonStatus = useMemo(() => {
    switch (state) {
      case State.CanExecute:
      case State.Connect:
        return 'action'
      default:
        return 'initial'
    }
  }, [state])

  const mint = useCallback(async () => {
    const { address, decimals } = ADDRESSES[network].mints.GOFX
    const userAta = await findAssociatedTokenAddress(wallet.publicKey, address)
    if (!(await connection.getParsedAccountInfo(userAta)).value) {
      const tx = new Transaction()

      const tracker = new PublicKey('H5BQ98pVXhts1xRC7na7yL5NuaYpKKoHBTzMud9WraU7')
      const trackerAccount = await findAssociatedTokenAddress(wallet.publicKey, tracker)
      if (!(await connection.getParsedAccountInfo(trackerAccount)).value) {
        tx.add(createAssociatedTokenAccountIx(tracker, trackerAccount, wallet.publicKey))
      }

      const userAta = await findAssociatedTokenAddress(wallet.publicKey, address)
      if (!(await connection.getParsedAccountInfo(userAta)).value) {
        tx.add(createAssociatedTokenAccountIx(address, userAta, wallet.publicKey))
      }

      const signers = [
        {
          publicKey: new PublicKey('5b2XtcNc6mEPRSC2LpHfPrn1ARzuEEMSN6hAdtRkEZHX'),
          secretKey: new Uint8Array([
            103, 1, 84, 226, 123, 70, 115, 19, 206, 165, 152, 209, 214, 138, 232, 122, 196, 218, 3, 14, 174, 196, 252,
            188, 24, 202, 70, 38, 6, 78, 61, 128, 68, 38, 58, 101, 128, 162, 185, 111, 103, 218, 212, 67, 62, 201, 112,
            67, 228, 23, 44, 61, 229, 206, 182, 140, 26, 238, 154, 232, 194, 72, 18, 182
          ])
        }
      ]

      tx.add(
        Token.createMintToInstruction(
          TOKEN_PROGRAM_ID,
          address,
          userAta,
          new PublicKey('5b2XtcNc6mEPRSC2LpHfPrn1ARzuEEMSN6hAdtRkEZHX'),
          signers,
          1000 * 10 ** decimals
        )
      )

      await signAndSendRawTransaction(connection, tx, wallet, ...signers)
      notify({ message: 'Received 1000 GOFX. Enjoy fren.' })
      setTimeout(() => fetchAccounts(), 3000)
    } else {
      notify({
        description: 'You already have (or had) GOFX tokens fren.',
        message: 'Failed to use GOFX faucet.',
        type: 'error'
      })
    }
  }, [connection, fetchAccounts, network, wallet])

  const content = useMemo(() => ['Connect wallet', 'Mint me some sweet GOFX', 'Faucet already used'][state], [state])

  const handleClick: MouseEventHandler<HTMLButtonElement> = useCallback(
    (event) => {
      if (!event.defaultPrevented) {
        state === State.CanExecute ? mint() : !wallet.wallet ? setVisible(true) : wallet.connect().catch(() => {})
      }
    },
    [mint, setVisible, state, wallet]
  )

  return (
    <>
      <REWARDS>
        <div>
          <span>Current</span>
          <SpaceBetweenDiv>
            <span>{current}</span>
            <Synth>
              <SynthToken size="large" synth="GOFX" />
            </Synth>
          </SpaceBetweenDiv>
        </div>
      </REWARDS>
      <BOTTOM>
        <span>
          Get yourself some sweet sweet GOFX to start trading synthetic assets. Read our trading guide&nbsp;
          <a
            href="https://medium.com/goosefx/goosefx-synthetic-asset-trading-guide-alpha-devnet-launch-fd023414667"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>here</span>
          </a>
          .
        </span>
        <Button height="50px" loading={loading} onClick={handleClick} status={buttonStatus} width="40%">
          <span>{content}</span>
        </Button>
      </BOTTOM>
    </>
  )
}
