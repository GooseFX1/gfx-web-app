/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Keypair,
  Commitment,
  Connection,
  RpcResponseAndContext,
  SignatureStatus,
  SimulatedTransactionResponse,
  Transaction,
  TransactionInstruction,
  TransactionSignature
} from '@solana/web3.js'
import { WalletNotConnectedError } from '@solana/wallet-adapter-base'
import { WalletContextState } from '@solana/wallet-adapter-react'
import { perpsNotify } from '../utils/perpsNotifications'
import { confirmTransaction } from './index'

interface BlockhashAndFeeCalculator {
  blockhash: string
  lastValidBlockHeight: number
}

export const DEFAULT_TIMEOUT = 60000

export const getErrorForTransaction = async (connection: Connection, txid: string): Promise<string[]> => {
  // wait for all confirmation before geting transaction
  await connection.confirmTransaction(txid, 'max')

  const tx = await connection.getParsedConfirmedTransaction(txid)

  const errors: string[] = []
  if (tx?.meta && tx.meta.logMessages) {
    tx.meta.logMessages.forEach((log) => {
      const regex = /Error: (.*)/gm
      let m
      while ((m = regex.exec(log)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++
        }

        if (m.length > 1) {
          errors.push(m[1])
        }
      }
    })
  }

  return errors
}

export const sendTransaction = async (
  connection: Connection,
  wallet: WalletContextState,
  instructions: TransactionInstruction[] | Transaction,
  signers: Keypair[],
  awaitConfirmation = true,
  commitment: Commitment = 'singleGossip',
  includesFeePayer = false,
  block?: BlockhashAndFeeCalculator
): Promise<{ txid: string; slot: number }> => {
  if (!wallet.publicKey) throw new WalletNotConnectedError()

  let transaction: Transaction
  if (instructions instanceof Transaction) {
    transaction = instructions
  } else {
    transaction = new Transaction()
    instructions.forEach((instruction) => transaction.add(instruction))
    transaction.recentBlockhash = (block || (await connection.getLatestBlockhash(commitment))).blockhash

    if (includesFeePayer) {
      transaction.setSigners(...signers.map((s) => s.publicKey))
    } else {
      transaction.setSigners(
        // fee payed by the wallet owner
        wallet.publicKey,
        ...signers.map((s) => s.publicKey)
      )
    }

    if (signers.length > 0) {
      transaction.partialSign(...signers)
    }
    if (!includesFeePayer) {
      transaction = await wallet.signTransaction(transaction)
    }
  }

  const rawTransaction = transaction.serialize()
  const options = {
    skipPreflight: true,
    commitment
  }

  const txid = await connection.sendRawTransaction(rawTransaction, options)
  let slot = 0

  if (awaitConfirmation) {
    const confirmation = await awaitTransactionSignatureConfirmation(txid, DEFAULT_TIMEOUT, connection, commitment)

    if (!confirmation) throw new Error('Timed out awaiting confirmation on transaction')
    slot = confirmation?.slot || 0

    if (confirmation?.err) {
      const errors = await getErrorForTransaction(connection, txid)

      console.log(errors)
      throw new Error(`Raw transaction ${txid} failed`)
    }
  }

  return { txid, slot }
}

export const sendPerpsTransaction = async (
  connection: Connection,
  wallet: WalletContextState,
  instructions: TransactionInstruction[] | Transaction,
  signers: Keypair[],
  messages?: {
    startMessage?: {
      header: string
      description: string
    }
    endMessage?: {
      header: string
      description: string
    }
    progressMessage?: {
      header: string
      description: string
    }
    errorMessage?: {
      header: string
      description: string
    }
  }
): Promise<{ txid: string; slot: number }> => {
  const commitment: Commitment = 'processed',
    includesFeePayer = false
  if (!wallet.publicKey) throw new WalletNotConnectedError()

  let transaction: Transaction
  const key = Math.floor(Math.random() * 100).toString()

  if (messages && messages.startMessage) {
    perpsNotify({
      message: messages.startMessage.header,
      description: messages.startMessage.description,
      action: 'open',
      key,
      styles: {}
    })
  }
  if (instructions instanceof Transaction) {
    transaction = instructions
  } else {
    transaction = new Transaction()
    instructions.forEach((instruction) => transaction.add(instruction))
    transaction.recentBlockhash = (await connection.getLatestBlockhash(commitment)).blockhash

    if (includesFeePayer) {
      transaction.setSigners(...signers.map((s) => s.publicKey))
    } else {
      transaction.setSigners(
        // fee payed by the wallet owner
        wallet.publicKey,
        ...signers.map((s) => s.publicKey)
      )
    }

    if (signers.length > 0) {
      transaction.partialSign(...signers)
    }
    //if (!includesFeePayer) {
    //  transaction = await wallet.signTransaction(transaction)
    //}
  }

  const signature = await wallet.wallet.adapter.sendTransaction(transaction, connection)
  console.log('singature: ', signature)
  if (messages && messages.progressMessage) {
    perpsNotify({
      message: messages.progressMessage.header,
      description: messages.progressMessage.description,
      action: 'open',
      key,
      styles: {}
    })
  }
  const response = await confirmTransaction(connection, signature, 'processed')
  const slot = 0
  if (response.value.err !== null) {
    perpsNotify({
      message: messages.errorMessage.header,
      description: messages.errorMessage.description,
      action: 'close',
      key,
      styles: {}
    })
    throw new Error('Timed out awaiting confirmation on transaction')
  }

  if (messages && messages.endMessage) {
    perpsNotify({
      message: messages.endMessage.header,
      description: messages.endMessage.description,
      action: 'close',
      key,
      styles: {}
    })
  }
  return { txid: signature, slot }
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
  transactions: Transaction[],
  messages?: {
    startMessage?: {
      header: string
      description: string
    }
    endMessage?: {
      header: string
      description: string
    }
    progressMessage?: {
      header: string
      description: string
    }
    errorMessage?: {
      header: string
      description: string
    }
  }
): Promise<{ txid: string; slot: number }[]> => {
  const commitment: Commitment = 'processed',
    awaitConfirmation = true
  if (!wallet.publicKey) throw new WalletNotConnectedError()

  const key = Math.floor(Math.random() * 100).toString()

  if (messages && messages.startMessage) {
    perpsNotify({
      message: messages.startMessage.header,
      description: messages.startMessage.description,
      action: 'open',
      key,
      styles: {}
    })
  }

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
      if (messages && messages.progressMessage) {
        perpsNotify({
          message: messages.progressMessage.header,
          description: messages.progressMessage.description,
          action: 'open',
          key,
          styles: {}
        })
      }
      const confirmation = await confirmTransaction(connection, response.txid, 'processed')

      if (!confirmation) {
        console.log('in error notifier')
        perpsNotify({
          message: messages.errorMessage.header,
          description: messages.errorMessage.description,
          action: 'close',
          key,
          styles: {}
        })
        throw new Error('Timed out awaiting confirmation on transaction')
      }
      ixResponse[key] = {
        ...ixResponse[key],
        slot: confirmation?.slot || 0
      }

      if (confirmation?.err) {
        const errors = await getErrorForTransaction(connection, response.txid)

        console.log(errors)
        if (messages && messages.errorMessage) {
          perpsNotify({
            message: messages.errorMessage.header,
            description: messages.errorMessage.description,
            action: 'close',
            key,
            styles: {}
          })
        }
        throw new Error(`Raw transaction ${response.txid} failed`)
      }
    }
  }

  if (messages && messages.endMessage) {
    perpsNotify({
      message: messages.endMessage.header,
      description: messages.endMessage.description,
      action: 'close',
      key,
      styles: {}
    })
  }

  return ixResponse
}

async function simulateTransaction(
  connection: Connection,
  transaction: Transaction,
  commitment: Commitment
): Promise<RpcResponseAndContext<SimulatedTransactionResponse>> {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  transaction.recentBlockhash = await connection._recentBlockhash(
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    connection._disableBlockhashCaching
  )

  const signData = transaction.serializeMessage()
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const wireTransaction = transaction._serialize(signData)
  const encodedTransaction = wireTransaction.toString('base64')
  const config: any = { encoding: 'base64', commitment }
  const args = [encodedTransaction, config]

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const res = await connection._rpcRequest('simulateTransaction', args)
  if (res.error) {
    throw new Error('failed to simulate transaction: ' + res.error.message)
  }
  return res.result
}

async function awaitTransactionSignatureConfirmation(
  txid: TransactionSignature,
  timeout: number,
  connection: Connection,
  commitment: Commitment = 'recent',
  queryStatus = false,
  errorMessage?: {
    header: string
    description: string
    key: any
  }
): Promise<SignatureStatus | null | void> {
  let done = false
  let status: SignatureStatus | null | void = {
    slot: 0,
    confirmations: 0,
    err: null
  }

  //eslint-disable-next-line
  let subId = 0
  status = await new Promise((resolve, reject) => {
    setTimeout(() => {
      if (done) {
        return
      }
      done = true
      console.log('Rejecting for timeout...')
      reject({ timeout: true })
    }, timeout)
    try {
      //eslint-disable-next-line
      subId = connection.onSignature(
        txid,
        (result, context) => {
          done = true
          status = {
            err: result.err,
            slot: context.slot,
            confirmations: 0
          }
          if (result.err) {
            console.log('Rejected via websocket', result.err)
            perpsNotify({
              message: errorMessage.header,
              description: errorMessage.description,
              action: 'close',
              key: errorMessage.key,
              styles: {}
            })
            reject(status)
          } else {
            console.log('Resolved via websocket', result)
            resolve(status)
          }
        },
        commitment
      )
    } catch (e) {
      done = true
      console.error('WS error in setup', txid, e)
    }

    //since await is only in while function, we pu in an executable function
    ;(async () => {
      while (!done && queryStatus) {
        // eslint-disable-next-line no-loop-func
        ;(async () => {
          try {
            const signatureStatuses = await connection.getSignatureStatuses([txid])
            status = signatureStatuses && signatureStatuses.value[0]
            if (!done) {
              if (!status) {
                console.log('REST null result for', txid, status)
              } else if (status.err) {
                console.log('REST error for', txid, status)
                done = true
                reject(status.err)
              } else if (!status.confirmations) {
                console.log('REST no confirmations for', txid, status)
              } else {
                console.log('REST confirmation for', txid, status)
                done = true
                resolve(status)
              }
            }
          } catch (e) {
            if (!done) {
              console.log('REST connection error: txid', txid, e)
            }
          }
        })()
        await sleep(2000)
      }
    })()
  })

  done = true
  console.log('Returning status', status)
  return status
}
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
