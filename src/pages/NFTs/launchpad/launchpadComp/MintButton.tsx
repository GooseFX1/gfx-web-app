import React, { FC, useEffect, useState, useMemo, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { IProjectParams } from '../../../../types/nft_launchpad'
import { fetchSelectedNFTLPData } from '../../../../api/NFTLaunchpad'
import { useNFTLPSelected } from '../../../../context/nft_launchpad'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import styled from 'styled-components'
import { useConnectionConfig } from '../../../../context'
import * as anchor from '@project-serum/anchor'
import {
  awaitTransactionSignatureConfirmation,
  createAccountsForMint,
  getCandyMachineState,
  getCollectionPDA,
  mintOneToken,
  SetupState,
  CandyMachineAccount,
  CANDY_MACHINE_PROGRAM
} from '../candyMachine/candyMachine'
import { getAtaForMint, toDate, AlertState } from '../candyMachine/utils'
import { Transaction, Commitment, PublicKey } from '@solana/web3.js'
import { GatewayProvider, GatewayStatus, useGateway } from '@civic/solana-gateway-react'
import { sendTransaction } from '../candyMachine/connection'
import {
  findGatewayToken,
  getGatewayTokenAddressForOwnerAndGatekeeperNetwork,
  onGatewayTokenChange,
  removeAccountChangeListener
} from '@identity.com/solana-gateway-ts'
import { MintButtonFunc } from './MintButtonFunc'

const MINT_BUTTON_BAR = styled.div`
  margin-top: -100px;
  height: 70px;
  z-index: 99;
  position: absolute;
  border-radius: 0 0 25px 25px;
  width: 44%;
  backdrop-filter: blur(23.9091px);
  background: radial-gradient(
    81.62% 135.01% at 15.32% 21.04%,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(141, 141, 141, 0.05) 68.23%,
    rgba(255, 255, 255, 0.05) 77.08%,
    rgba(255, 255, 255, 0.0315) 100%
  );
`
const MINT_BTN = styled.div<{ active: boolean }>`
  background: linear-gradient(96.79deg, #f7931a 4.25%, #ac1cc7 97.61%);
  border-radius: 47px;
  width: 260px;
  height: 50px;
  margin: auto;
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
  justify-content: center;
  cursor: ${({ active }) => (!active ? 'not-allowed' : 'pointer')};
`

export const MintButton: FC = () => {
  const params = useParams<IProjectParams>()
  const wallet = useWallet()
  const { connection } = useConnectionConfig()
  const { selectedProject, candyMachineState, candyMachine, cndyValues } = useNFTLPSelected()
  const [mintButtonActive, setMintButtonActive] = useState(false)
  const [isUserMinting, setIsUserMinting] = useState(false)
  const [alertState, setAlertState] = useState<AlertState>({
    open: false,
    message: '',
    severity: undefined
  })

  const [isActive, setIsActive] = useState(false)
  const [endDate, setEndDate] = useState<Date>()
  const [itemsRemaining, setItemsRemaining] = useState<number>()
  const [isWhitelistUser, setIsWhitelistUser] = useState(false)
  const [isPresale, setIsPresale] = useState(false)
  const [isValidBalance, setIsValidBalance] = useState(false)
  const [discountPrice, setDiscountPrice] = useState<anchor.BN>()
  const [needTxnSplit, setNeedTxnSplit] = useState(true)
  const [setupTxn, setSetupTxn] = useState<SetupState>()

  const anchorWallet = useMemo(() => {
    if (!wallet || !wallet.publicKey || !wallet.signAllTransactions || !wallet.signTransaction) {
      return
    }

    return {
      publicKey: wallet.publicKey,
      signAllTransactions: wallet.signAllTransactions,
      signTransaction: wallet.signTransaction
    } as anchor.Wallet
  }, [wallet])

  const onMint = async (beforeTransactions: Transaction[] = [], afterTransactions: Transaction[] = []) => {
    try {
      setIsUserMinting(true)
      document.getElementById('#identity')?.click()
      if (wallet.connected && candyMachine?.program && wallet.publicKey) {
        let setupMint: SetupState | undefined
        if (needTxnSplit && setupTxn === undefined) {
          setAlertState({
            open: true,
            message: 'Please sign account setup transaction',
            severity: 'info'
          })
          setupMint = await createAccountsForMint(candyMachine, wallet.publicKey)
          console.log('setup mint is: ', setupMint)
          let status: any = { err: false }
          if (setupMint.transaction) {
            status = await awaitTransactionSignatureConfirmation(setupMint.transaction, 60000, connection, true)
          }
          console.log('status is: ', status)
          if (status && !status.err) {
            setSetupTxn(setupMint)
            setAlertState({
              open: true,
              message: 'Setup transaction succeeded! Please sign minting transaction',
              severity: 'info'
            })
          } else {
            setAlertState({
              open: true,
              message: 'Mint failed! Please try again!',
              severity: 'error'
            })
            setIsUserMinting(false)
            return
          }
        } else {
          setAlertState({
            open: true,
            message: 'Please sign minting transaction',
            severity: 'info'
          })
        }

        let mintResult = await mintOneToken(
          candyMachine,
          wallet.publicKey,
          beforeTransactions,
          afterTransactions,
          setupMint ?? setupTxn
        )
        console.log('mint result is ', mintResult)
        let status: any = { err: true }
        let metadataStatus = null
        if (mintResult) {
          status = await awaitTransactionSignatureConfirmation(mintResult.mintTxId, 60000, connection, true)

          metadataStatus = await candyMachine.program.provider.connection.getAccountInfo(
            mintResult.metadataKey,
            'processed'
          )
          console.log('Metadata status: ', !!metadataStatus)
        }

        if (status && !status.err && metadataStatus) {
          // manual update since the refresh might not detect
          // the change immediately
          let remaining = itemsRemaining! - 1
          setItemsRemaining(remaining)
          setIsActive((candyMachine.state.isActive = remaining > 0))
          candyMachine.state.isSoldOut = remaining === 0
          setSetupTxn(undefined)
          setAlertState({
            open: true,
            message: 'Congratulations! Mint succeeded!',
            severity: 'success',
            hideDuration: 7000
          })
        } else if (status && !status.err) {
          setAlertState({
            open: true,
            message:
              'Mint likely failed! Anti-bot SOL 0.01 fee potentially charged! Check the explorer to confirm the mint failed and if so, make sure you are eligible to mint before trying again.',
            severity: 'error',
            hideDuration: 8000
          })
        } else {
          setAlertState({
            open: true,
            message: 'Mint failed! Please try again!',
            severity: 'error'
          })
        }
      }
    } catch (error: any) {
      let message = error.msg || 'Minting failed! Please try again!'
      if (!error.msg) {
        if (!error.message) {
          message = 'Transaction timeout! Please try again.'
        } else if (error.message.indexOf('0x137')) {
          console.log(error)
          message = `SOLD OUT!`
        } else if (error.message.indexOf('0x135')) {
          message = `Insufficient funds to mint. Please fund your wallet.`
        }
      } else {
        if (error.code === 311) {
          console.log(error)
          message = `SOLD OUT!`
          window.location.reload()
        } else if (error.code === 312) {
          message = `Minting period hasn't started yet.`
        }
      }

      setAlertState({
        open: true,
        message,
        severity: 'error'
      })
      // updates the candy machine state to reflect the latest
      // information on chain
    } finally {
      setIsUserMinting(false)
    }
  }

  const toggleMintButton = () => {
    let active = !isActive || isPresale

    if (active) {
      if (candyMachine!.state.isWhitelistOnly && !isWhitelistUser) {
        active = false
      }
      if (endDate && Date.now() >= endDate.getTime()) {
        active = false
      }
    }

    if (
      isPresale &&
      candyMachine!.state.goLiveDate &&
      candyMachine!.state.goLiveDate.toNumber() <= new Date().getTime() / 1000
    ) {
      setIsPresale((candyMachine!.state.isPresale = false))
    }

    setIsActive((candyMachine!.state.isActive = active))
  }

  //

  useEffect(() => {
    if (wallet.connected) {
      console.log('wallet connected')
    }
  }, [wallet.connected, wallet.publicKey])

  return (
    <MINT_BUTTON_BAR>
      {/*<GatewayProvider
        wallet={{
          publicKey: wallet.publicKey || new PublicKey(CANDY_MACHINE_PROGRAM),
          //@ts-ignore
          signTransaction: wallet.signTransaction
        }}
        gatekeeperNetwork={candyMachine?.state?.gatekeeper?.gatekeeperNetwork}
        clusterUrl={'https://api.devnet.solana.com'}
        handleTransaction={async (transaction: Transaction) => {
          setIsUserMinting(true)
          const userMustSign = transaction.signatures.find((sig) => sig.publicKey.equals(wallet.publicKey!))
          if (userMustSign) {
            setAlertState({
              open: true,
              message: 'Please sign one-time Civic Pass issuance',
              severity: 'info'
            })
            try {
              transaction = await wallet.signTransaction!(transaction)
            } catch (e) {
              setAlertState({
                open: true,
                message: 'User cancelled signing',
                severity: 'error'
              })
              // setTimeout(() => window.location.reload(), 2000);
              setIsUserMinting(false)
              throw e
            }
          } else {
            setAlertState({
              open: true,
              message: 'Refreshing Civic Pass',
              severity: 'info'
            })
          }
          try {
            await sendTransaction(connection, wallet, transaction, [], true, 'confirmed')
            setAlertState({
              open: true,
              message: 'Please sign minting',
              severity: 'info'
            })
          } catch (e) {
            setAlertState({
              open: true,
              message: 'Solana dropped the transaction, please try again',
              severity: 'warning'
            })
            console.error(e)
            // setTimeout(() => window.location.reload(), 2000);
            setIsUserMinting(false)
            throw e
          }
          //await onMint()
        }}
        broadcastTransaction={false}
        options={{ autoShowModal: false }}
      >*/}
      {/*<MintButtonFunc
          onMint={() => onMint()}
          candyMachine={candyMachine}
          isMinting={isUserMinting}
          setIsMinting={setIsUserMinting}
          isActive={true}
        ></MintButtonFunc>*/}
      <MINT_BTN
        active={true}
        //  active={isActive || (isPresale && isWhitelistUser && isValidBalance)}
        onClick={() => onMint()}
      >
        Mint
      </MINT_BTN>
      {/*</GatewayProvider>*/}
    </MINT_BUTTON_BAR>
  )
}
