import { sleep, getUnixTs } from '../utils/misc'
import {
  Blockhash,
  Commitment,
  Connection,
  FeeCalculator,
  Keypair,
  RpcResponseAndContext,
  SignatureStatus,
  SimulatedTransactionResponse,
  Transaction,
  TransactionInstruction,
  TransactionSignature
} from '@solana/web3.js'

import { WalletAdapter, WalletNotConnectedError } from '@solana/wallet-adapter-base'

interface BlockhashAndFeeCalculator {
  blockhash: Blockhash
  feeCalculator: FeeCalculator
}

export const DEFAULT_TIMEOUT = 15000

export const envFor = (connection: Connection): string => {
  const endpoint = (connection as any)._rpcEndpoint
  const regex = /https:\/\/api.([^.]*).solana.com/
  const match = endpoint.match(regex)
  if (match[1]) {
    return match[1]
  }
  return 'mainnet-beta'
}

export const explorerLinkFor = (txid: TransactionSignature, connection: Connection): string => {
  return `https://solscan.io/tx/${txid}?cluster=${envFor(connection)}`
}

export const sendTransactionWithRetry = async (
  connection: Connection,
  wallet: WalletAdapter | any,
  instructions: TransactionInstruction[],
  signers: Keypair[],
  commitment: Commitment = 'singleGossip',
  includesFeePayer: boolean = false,
  block?: BlockhashAndFeeCalculator,
  beforeSend?: () => void
) => {
  if (!wallet.publicKey) throw new WalletNotConnectedError()

  let transaction = new Transaction()
  instructions.forEach((instruction) => transaction.add(instruction))
  transaction.recentBlockhash = (block || (await connection.getRecentBlockhash(commitment))).blockhash

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

  if (beforeSend) {
    beforeSend()
  }

  const { txid, slot } = await sendSignedTransaction({
    connection,
    signedTransaction: transaction
  })

  return { txid, slot }
}

export const sendTransactionWithRetryWithKeypair = async (
  connection: Connection,
  wallet: Keypair,
  instructions: TransactionInstruction[],
  signers: Keypair[],
  commitment: Commitment = 'singleGossip',
  includesFeePayer: boolean = false,
  block?: BlockhashAndFeeCalculator,
  beforeSend?: () => void
) => {
  const transaction = new Transaction()
  instructions.forEach((instruction) => transaction.add(instruction))
  transaction.recentBlockhash = (block || (await connection.getRecentBlockhash(commitment))).blockhash

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
    transaction.sign(...[wallet, ...signers])
  } else {
    transaction.sign(wallet)
  }

  if (beforeSend) {
    beforeSend()
  }

  const { txid, slot } = await sendSignedTransaction({
    connection,
    signedTransaction: transaction
  })

  return { txid, slot }
}

export async function sendSignedTransaction({
  connection,
  signedTransaction,
  timeout = DEFAULT_TIMEOUT
}: {
  signedTransaction: Transaction
  connection: Connection
  sendingMessage?: string
  sentMessage?: string
  successMessage?: string
  timeout?: number
}): Promise<{ txid: string; slot: number }> {
  const rawTransaction = signedTransaction.serialize()
  const startTime = getUnixTs()
  let slot = 0
  const txid: TransactionSignature = await connection.sendRawTransaction(rawTransaction, {
    skipPreflight: true
  })

  console.log('Started awaiting confirmation for', txid)

  let done = false
  ;(async () => {
    while (!done && getUnixTs() - startTime < timeout) {
      connection.sendRawTransaction(rawTransaction, {
        skipPreflight: true
      })
      await sleep(500)
    }
  })()
  try {
    const confirmation = await awaitTransactionSignatureConfirmation(txid, timeout, connection, 'confirmed', true)

    if (!confirmation) throw new Error('Timed out awaiting confirmation on transaction')

    if (confirmation.err) {
      console.error(confirmation.err)
      throw new Error('Transaction failed: Custom instruction error')
    }

    slot = confirmation?.slot || 0
  } catch (err) {
    console.error('Timeout Error caught', err)
    if (err.timeout) {
      throw new Error('Timed out awaiting confirmation on transaction')
    }
    let simulateResult: SimulatedTransactionResponse | null = null
    try {
      simulateResult = (await simulateTransaction(connection, signedTransaction, 'single')).value
    } catch (e) {
      console.error('Simulate Transaction error', e)
    }
    if (simulateResult && simulateResult.err) {
      if (simulateResult.logs) {
        for (let i = simulateResult.logs.length - 1; i >= 0; --i) {
          const line = simulateResult.logs[i]
          if (line.startsWith('Program log: ')) {
            throw new Error('Transaction failed: ' + line.slice('Program log: '.length))
          }
        }
      }
      throw new Error(JSON.stringify(simulateResult.err))
    }
    // throw new Error('Transaction failed');
  } finally {
    done = true
  }

  console.log('Latency (ms)', txid, getUnixTs() - startTime)
  return { txid, slot }
}

async function simulateTransaction(
  connection: Connection,
  transaction: Transaction,
  commitment: Commitment
): Promise<RpcResponseAndContext<SimulatedTransactionResponse>> {
  // @ts-ignore
  transaction.recentBlockhash = await connection._recentBlockhash(
    // @ts-ignore
    connection._disableBlockhashCaching
  )

  const signData = transaction.serializeMessage()
  // @ts-ignore
  const wireTransaction = transaction._serialize(signData)
  const encodedTransaction = wireTransaction.toString('base64')
  const config: any = { encoding: 'base64', commitment }
  const args = [encodedTransaction, config]

  // @ts-ignore
  const res = await connection._rpcRequest('simulateTransaction', args)
  if (res.error) {
    throw new Error('failed to simulate transaction: ' + res.error.message)
  }
  return res.result
}

export async function awaitTransactionSignatureConfirmation(
  txid: TransactionSignature,
  timeout: number,
  connection: Connection,
  commitment: Commitment = 'recent',
  queryStatus = false
): Promise<SignatureStatus | null | void> {
  let done = false
  let status: SignatureStatus | null | void = {
    slot: 0,
    confirmations: 0,
    err: null
  }
  let subId = 0
  // eslint-disable-next-line no-async-promise-executor
  status = await new Promise(async (resolve, reject) => {
    setTimeout(() => {
      if (done) {
        return
      }
      done = true
      console.log('Rejecting for timeout...')
      reject({ timeout: true })
    }, timeout)
    try {
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
    while (!done && queryStatus) {
      // eslint-disable-next-line no-loop-func
      ;(async () => {
        try {
          const signatureStatuses = await connection.getSignatureStatuses([txid])
          status = signatureStatuses && signatureStatuses.value[0]
          console.log(explorerLinkFor(txid, connection))
          if (!done) {
            if (!status) {
              console.log('REST null result for', txid, status)
            } else if (status.err) {
              console.error('REST error for', txid, status)
              done = true
              reject(status.err)
            } else if (!status.confirmations) {
              console.error('REST no confirmations for', txid, status)
            } else {
              console.log('REST confirmation for', txid, status)
              done = true
              resolve(status)
            }
          }
        } catch (e) {
          if (!done) {
            console.error('REST connection error: txid', txid, e)
          }
        }
      })()
      await sleep(2000)
    }
  })

  //@ts-ignore
  if (connection._signatureSubscriptions[subId]) connection.removeSignatureListener(subId)
  done = true
  console.log('Returning status', status)
  return status
}
