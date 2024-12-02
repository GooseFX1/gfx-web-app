import { useCallback, useMemo } from 'react'
import TransactionBuilder, { TXN } from '@/web3/Builders/transaction.builder'
import { getLatestPriorityFees, getPriorityFeeFromLevel, useConnectionConfig } from '@/context'
import { BlockheightBasedTransactionConfirmationStrategy, Commitment, Connection, Transaction } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { SendTransactionOptions } from '@solana/wallet-adapter-base'
import { notifyUsingPromise, promiseBuilder, SpawnLoaderToast } from '@/utils/perpsNotifications'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { toast } from 'sonner'

type SendTxnOptions = {
  connection?: Connection
  options?: SendTransactionOptions
  confirmationWaitType?: Commitment
  successMessage?: string
  errorMessage?: string
  transactionDuration?: number
}
type useTransactionReturn = {
  createTransactionBuilder: (txn?: TXN) => TransactionBuilder
  sendTransaction: (
    txn: Transaction | TransactionBuilder,
    connectionData?: SendTxnOptions,
    notify?: (promise: Promise<unknown>) => Promise<boolean>
  ) => Promise<{ success: boolean; txSig: string }>
}
const baseSet = new Set()

function useTransaction(): useTransactionReturn {
  const { priorityFeeValue, priorityFee } = useConnectionConfig()
  const { sendTransaction: sendTransactionOriginal, wallet } = useWallet()
  const { connection: originalConnection } = useConnectionConfig()
  const { publicKey } = useWalletBalance()
  const createTransactionBuilder = useCallback(
    (txn?: TXN) => new TransactionBuilder(txn).setPriorityFee(priorityFeeValue),
    [priorityFeeValue]
  )
  const supportedTransactionTypes = useMemo(() =>
    wallet?.adapter?.supportedTransactionVersions ?? baseSet, [wallet])
  const sendTransaction =
    async (txnIn: Transaction | TransactionBuilder, connectionData?: SendTxnOptions, notify = notifyUsingPromise) => {
      console.log('STARTING SEND TXN')
      const connection = connectionData?.connection ?? originalConnection
      const options: SendTransactionOptions = {
        ...connectionData?.options,
        skipPreflight: true,
        maxRetries: connectionData?.options?.maxRetries ?? 3
      }
      const blockHash = await connection.getLatestBlockhash('confirmed')
      const result = await getLatestPriorityFees(
        (txnIn instanceof TransactionBuilder ? await txnIn
          ._getTransactionWithoutPriorityFee(publicKey, blockHash.blockhash, supportedTransactionTypes.has(0)) : txnIn)
      )
      const priorityFromLevel = getPriorityFeeFromLevel(priorityFee, result)
      console.log({ result, priorityFromLevel })
      const txn = txnIn instanceof TransactionBuilder ?
        await txnIn
          .setPriorityFee(priorityFromLevel)
          ._getTransaction(publicKey, blockHash.blockhash, supportedTransactionTypes.has(0)) :
        txnIn
      console.log('signing txn', txn)
      const id = SpawnLoaderToast({ duration: connectionData?.transactionDuration ?? 60000 })
      const txSig = await sendTransactionOriginal(txn, connection, options).catch((err) => {
        console.log('[ERROR] Transaction failed', err)
        return ''
      })
      console.log('got signature response', { txSig })
      if (!txSig) {
        toast.dismiss(id)
        return { txSig: '', success: false }
      }
      const exec = async () => {

        console.log('blockhash', blockHash)
        const blockHeightConfirmationStrategy: BlockheightBasedTransactionConfirmationStrategy = {
          signature: txSig,
          blockhash: blockHash.blockhash,
          lastValidBlockHeight: blockHash.lastValidBlockHeight
        }
        console.log('PRE RESPONSE', txSig)
        return connection
          .confirmTransaction(blockHeightConfirmationStrategy, connectionData?.confirmationWaitType ?? 'processed')
          .then((res) => {
            console.log('[INFO] Transaction Confirmation', res, res.value.err != null)
            if (res.value.err != null) {
              if ((res?.value?.err as any).InstructionError[1]?.Custom == 6005) {
                throw new Error('6005')
              }
              if ((res?.value?.err as any).InstructionError[1]?.Custom == 1) {
                throw new Error('1')
              }
              console.log('Transaction failed', res.value.err)
              throw new Error('Transaction failed')
            }
            const response = { ...res, txid: txSig }
            console.log('RESPONSE', response)
            return response
          })
          .catch((err) => {
            console.log('[ERROR] Transaction failed', err?.message)
            if (err?.message == 6005) {
              throw new Error('6005')
            }
            if (err?.message == 1) {
              throw new Error('1')
            }
            throw new Error('Transaction failed', err)
          })
      }
      const promise = promiseBuilder<Awaited<ReturnType<typeof exec>>>(exec())
      const success = await notify(promise, null,
        txSig,
        connectionData?.successMessage,
        connectionData?.errorMessage,
        connectionData?.transactionDuration,
        undefined,
        id
      )
      return { txSig, success }
    }

  return {
    createTransactionBuilder,
    sendTransaction
  }
}

export default useTransaction
