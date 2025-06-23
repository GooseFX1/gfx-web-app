/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Keypair,
  Commitment,
  Connection,
  Transaction,
  TransactionInstruction
} from '@solana/web3.js'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { perpsNotify, notifyUsingPromise } from '../utils/perpsNotifications'
import TransactionBuilder from '@/web3/Builders/transaction.builder'
import { awaitTransactionSignatureConfirmation } from './transactions'

export const DEFAULT_TIMEOUT = 60000

export const sendPerpsTransaction = async (
  connection: Connection,
  wallet: WalletContextState,
  instructions: TransactionInstruction[] | Transaction,
  signers: Keypair[]
): Promise<{ txid: string; slot: number }> => {
  const commitment: Commitment = 'processed'
  if (!wallet.publicKey) throw new WalletNotConnectedError()

  let transaction: Transaction
  if (instructions instanceof Transaction) {
    transaction = instructions
  } else {
    transaction = new Transaction()
    instructions.forEach((instruction) => transaction.add(instruction))
    transaction.recentBlockhash = (await connection.getLatestBlockhash(commitment)).blockhash

    transaction.setSigners(
      // fee payed by the wallet owner
      wallet.publicKey,
      ...signers.map((s) => s.publicKey)
    )

    if (signers.length > 0) {
      transaction.partialSign(...signers)
    }
  }

  const executeOperation = async (): Promise<{ txid: string; slot: number }> => {
    try {
      const signature = await wallet.wallet.adapter.sendTransaction(transaction, connection)
      console.log('signature: ', signature)
      const response = await awaitTransactionSignatureConfirmation(signature, DEFAULT_TIMEOUT, connection, 'processed')

      if (response.err !== null) {
        throw new Error(`Transaction failed: ${signature}`)
      }
      return { txid: signature, slot: response?.slot || 0 }
    } catch (err) {
      console.error('error: ', err)
      throw new Error(`Timed out awaiting confirmation on transaction: ${err.message || err}`)
    }
  }

  try {
    let txid = ''
    const promise = new Promise((resolve, reject) => {
      executeOperation()
        .then((res) => {
          txid = res.txid
          resolve(res)
        })
        .catch((err) => {
          reject(err)
        })
    })
    notifyUsingPromise(promise)
    await promise

    return { txid: txid, slot: 1 }
  } catch (e) {
    console.log('error: ', e)
    return null
  }
}

export const buildTransaction = async (
  connection: Connection,
  wallet: WalletContextState,
  instructions: TransactionInstruction[],
  signers: Keypair[]
): Promise<Transaction> => {
  if (!instructions.length) return null
  const commitment: Commitment = 'processed'
  const transaction = new Transaction().add(...instructions)
  transaction.recentBlockhash = (await connection.getLatestBlockhash(commitment)).blockhash

  transaction.setSigners(
    // fee payed by the wallet owner
    wallet.publicKey,
    ...signers.map((s) => s.publicKey)
  )

  if (signers.length > 0) {
    transaction.partialSign(...signers)
  }

  return transaction
}

export const sendPerpsTransactions = async (
  connection: Connection,
  wallet: WalletContextState,
  transactions: Transaction[]
): Promise<{ txid:string; slot: number }[]> => {
  const commitment: Commitment = 'processed',
    awaitConfirmation = true
  if (!wallet.publicKey) throw new WalletNotConnectedError()

  const executeSignOperation = async () => {
    const builtTxs = []
    for (const transaction of transactions) {
      builtTxs.push(transaction)
    }

    const signedTxs = await wallet.signAllTransactions(builtTxs)

    const sentTxs = []
    for (const transaction of signedTxs) {
      const rawTransaction = transaction.serialize()
      const options = {
        skipPreflight: true,
        commitment
      }
      sentTxs.push(connection.sendRawTransaction(rawTransaction, options))
    }

    const ixResponse = (await Promise.all(sentTxs)).map((id) => ({
      txid: id,
      slot: 0
    }))

    for (const [key, response] of ixResponse.entries()) {
      if (awaitConfirmation) {
        const confirmation = await awaitTransactionSignatureConfirmation(response.txid, DEFAULT_TIMEOUT, connection, 'processed')

        if (!confirmation) {
          console.log('in error notifier')
          throw new Error('Timed out awaiting confirmation on transaction')
        }
        ixResponse[key] = {
          ...ixResponse[key],
          slot: confirmation?.slot || 0
        }

        if (confirmation?.err) {
          console.log(`Raw transaction ${response.txid} failed with error:`, confirmation.err)
          throw new Error(`Raw transaction ${response.txid} failed`)
        }
      }
    }
    return ixResponse
  }
  try {
    let ixResponse
    const promise = new Promise((resolve, reject) => {
      executeSignOperation()
        .then((res) => {
          ixResponse = res
          resolve(res[0])
        })
        .catch((err) => {
          reject(err)
        })
    })
    notifyUsingPromise(promise)
    await promise
    return ixResponse
  } catch (e) {
    console.log('error: ', e)
    return null
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
