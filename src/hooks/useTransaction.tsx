import { useCallback } from 'react'
import TransactionBuilder, { TXN } from '@/web3/Builders/transaction.builder'
import { useConnectionConfig } from '@/context'
import {
  BlockheightBasedTransactionConfirmationStrategy,
  Commitment,
  Connection,
  Transaction
} from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { SendTransactionOptions } from '@solana/wallet-adapter-base'
import { notifyUsingPromise, promiseBuilder } from '@/utils/perpsNotifications'

type useTransactionReturn = {
  createTransactionBuilder: (txn?: TXN) => TransactionBuilder
  createTransaction: (txn?: TXN) => Transaction
  sendTransaction: (
    txn: Transaction,
    {
      connection,
      options,
      confirmationWaitType
    }?: {
      connection?: Connection
      options?: SendTransactionOptions
      confirmationWaitType?: Commitment
    }
  ) => Promise<{ success: boolean; txSig: string }>
}

function useTransaction(): useTransactionReturn {
  const { priorityFeeValue } = useConnectionConfig()
  const { sendTransaction: sendTransactionOriginal } = useWallet()
  const { connection: originalConnection } = useConnectionConfig()

  const createTransactionBuilder = useCallback(
    (txn?: TXN) => new TransactionBuilder(txn).setPriorityFee(priorityFeeValue),
    [priorityFeeValue]
  )
  const createTransaction = useCallback(
    (txn?: TXN) => new TransactionBuilder(txn).setPriorityFee(priorityFeeValue).getTransaction(),
    [priorityFeeValue]
  )
  const sendTransaction = useCallback(
    async (
      txn: Transaction,
      connectionData?: {
        connection?: Connection
        options?: SendTransactionOptions
        confirmationWaitType?: Commitment
      }
    ) => {
      const connection = connectionData?.connection ?? originalConnection
      const options = { ...connectionData?.options, skipPreflight: true }
      const txSig = await sendTransactionOriginal(txn, connection, options).catch((err) => {
        console.log('[ERROR] Transaction failed', err)
        return ''
      })
      if (!txSig) {
        return { txSig: '', success: false }
      }
      const exec = async () => {
        if (!txSig) {
          throw new Error('Transaction failed')
        }
        const blockHash = await connection.getLatestBlockhash()
        const blockHeightConfirmationStrategy: BlockheightBasedTransactionConfirmationStrategy = {
          signature: txSig,
          blockhash: blockHash.blockhash,
          lastValidBlockHeight: blockHash.lastValidBlockHeight
        }
        console.log('PRE RESPONSE', txSig)
        return connection
          .confirmTransaction(blockHeightConfirmationStrategy, connectionData?.confirmationWaitType ?? 'confirmed')
          .then((res) => {
            console.log('[INFO] Transaction Confirmation', res, res.value.err != null)
            if (res.value.err != null) {
              console.log('Transaction failed', res.value.err)
              throw new Error('Transaction failed')
            }
            const response = { ...res, txid: txSig }
            console.log('RESPONSE', response)
            return response
          })
          .catch((err) => {
            console.log('[ERROR] Transaction failed', err)
            throw new Error('Transaction failed', err)
          })
      }
      const promise = promiseBuilder<Awaited<ReturnType<typeof connection.confirmTransaction>>>(exec())
      const success = await notifyUsingPromise(promise, null, txSig)
      return { txSig, success }
    },
    [originalConnection, sendTransactionOriginal]
  )
  return {
    createTransactionBuilder,
    createTransaction,
    sendTransaction
  }
}

export default useTransaction
