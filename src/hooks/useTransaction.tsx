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
    }: {
      connection?: Connection
      options?: SendTransactionOptions
      confirmationWaitType?: Commitment
    }
  ) => Promise<string>
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
      {
        connection,
        options,
        confirmationWaitType
      }: {
        connection?: Connection
        options?: SendTransactionOptions
        confirmationWaitType?: Commitment
      }
    ) => {
      const txSig = await sendTransactionOriginal(txn, connection ?? originalConnection, options).catch((err) => {
        console.log('[ERROR] Transaction failed', err)
        return ''
      })

      if (!txSig) return
      const blockHash = await connection.getLatestBlockhash()
      const blockHeightConfirmationStrategy: BlockheightBasedTransactionConfirmationStrategy = {
        signature: txSig,
        blockhash: blockHash.blockhash,
        lastValidBlockHeight: blockHash.lastValidBlockHeight
      }
      const promise = promiseBuilder<Awaited<ReturnType<typeof connection.confirmTransaction>>>(
        connection
          .confirmTransaction(blockHeightConfirmationStrategy, confirmationWaitType ?? 'confirmed')
          .then((res) => {
            console.log('[INFO] Transaction Confirmation', res, res.value.err != null)
            if (res.value.err != null) {
              console.log('Transaction failed', res.value.err)
              throw new Error('Transaction failed')
            }
            return res
          })
          .catch((err) => {
            console.log('[ERROR] Transaction failed', err)
            throw new Error('Transaction failed', err)
          })
      )
      await notifyUsingPromise(promise)
      console.log('txSig', txSig)
      return txSig
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
