import { ReactNode, useCallback, useMemo } from 'react'
import TransactionBuilder, { TXN } from '@/web3/Builders/transaction.builder'
import {
  getPriorityFeeEstimate,
  getPriorityFeeFromLevel,
  PriorityFeeEstimateResponse,
  useConnectionConfig
} from '@/context'
import {
  BlockheightBasedTransactionConfirmationStrategy,
  Commitment,
  Connection,
  Transaction
} from '@solana/web3.js'
import { useWallet } from '@/hooks/useWallet'
import { SendTransactionOptions } from '@solana/wallet-adapter-base'
import { notifyUsingPromise, promiseBuilder, SpawnLoaderToast } from '@/utils/perpsNotifications'
import { toast, ToastT } from 'sonner'

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
    notify?: (
      promise: Promise<unknown>,
      onDismiss?: (toast: ToastT) => void,
      tentativeTxId?: string,
      successMessage?: ReactNode,
      errorMessage?: ReactNode,
      transactionLoadingDuration?: number,
      transactionDuration?: number,
      id?: string | number | undefined
    ) => Promise<boolean>,
    isCreatePoolInx?: boolean,
    skipComputeUnitsLimit?: boolean
  ) => Promise<{ success: boolean; txSig: string }>
  sendBatchTransaction: (
    txnIns: (Transaction | TransactionBuilder)[],
    connectionData?: SendTxnOptions,
    notify?: (promise: Promise<unknown>) => Promise<boolean>,
    isCreatePoolInx?: boolean,
    skipComputeUnitsLimit?: boolean
  ) => Promise<{ success: boolean; txSig: string }>
}

function useTransaction(): useTransactionReturn {
  const { priorityFeeValue, priorityFee } = useConnectionConfig()
  const { publicKey, walletProvider } = useWallet()
  const { connection: originalConnection } = useConnectionConfig()
  const createTransactionBuilder = useCallback(
    (txn?: TXN) => new TransactionBuilder(txn).setPriorityFee(priorityFeeValue),
    [priorityFeeValue]
  )
  const supportedTransactionTypes = useMemo(() => new Set([0]), [])
  const sendTransaction = async (
    txnIn: Transaction | TransactionBuilder,
    connectionData?: SendTxnOptions,
    notify = notifyUsingPromise,
    isCreatePoolInx?: boolean,
    skipComputeUnitsLimit = false
  ) => {
    console.log('STARTING SEND TXN')
    const connection = connectionData?.connection ?? originalConnection
    const options: SendTransactionOptions = {
      ...connectionData?.options,
      skipPreflight: true,
      maxRetries: connectionData?.options?.maxRetries ?? 3
    }
    const blockHash = await connection.getLatestBlockhash('confirmed')
    let txn =
      txnIn instanceof TransactionBuilder
        ? await txnIn
            .setPriorityFee(priorityFeeValue)
            ._getTransaction(
              publicKey,
              blockHash.blockhash,
              supportedTransactionTypes.has(0),
              isCreatePoolInx,
              skipComputeUnitsLimit
            )
        : txnIn
    txn.recentBlockhash = blockHash.blockhash
    txn.feePayer = publicKey

    const priorityFeeEstimate: PriorityFeeEstimateResponse = await getPriorityFeeEstimate(connection, txn)
    const priorityFromLevel = getPriorityFeeFromLevel(priorityFee, priorityFeeEstimate)
    console.log({ priorityFeeEstimate, priorityFromLevel })
    txn =
      txnIn instanceof TransactionBuilder
        ? await txnIn
            .setPriorityFee(priorityFromLevel)
            ._getTransaction(
              publicKey,
              blockHash.blockhash,
              supportedTransactionTypes.has(0),
              isCreatePoolInx,
              skipComputeUnitsLimit
            )
        : txnIn
    txn.recentBlockhash = blockHash.blockhash
    txn.feePayer = publicKey
    console.log('signing txn', txn)
    const id = SpawnLoaderToast({ duration: connectionData?.transactionDuration ?? 60000 })

    const txSig = await walletProvider.sendTransaction(txn, connection, options).catch((err) => {
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
    const success = await notify(
      promise,
      null,
      txSig,
      connectionData?.successMessage,
      connectionData?.errorMessage,
      connectionData?.transactionDuration,
      undefined,
      id
    )
    return { txSig, success }
  }

  const sendBatchTransaction = async (
    txnIns: (Transaction | TransactionBuilder)[],
    connectionData?: SendTxnOptions,
    notify = notifyUsingPromise,
    isCreatePoolInx?: boolean,
    skipComputeUnitsLimit = true
  ) => {
    console.log('STARTING SEND TXN')
    const connection = connectionData?.connection ?? originalConnection
    const blockHash = await connection.getLatestBlockhash('confirmed')
    const txnForFee =
      txnIns[0] instanceof TransactionBuilder
        ? await txnIns[0]
            .setPriorityFee(priorityFeeValue)
            ._getTransaction(
              publicKey,
              blockHash.blockhash,
              supportedTransactionTypes.has(0),
              isCreatePoolInx,
              skipComputeUnitsLimit
            )
        : txnIns[0]

    txnForFee.recentBlockhash = blockHash.blockhash
    txnForFee.feePayer = publicKey

    const priorityFeeEstimate: PriorityFeeEstimateResponse = await getPriorityFeeEstimate(connection, txnForFee)
    const priorityFromLevel = getPriorityFeeFromLevel(priorityFee, priorityFeeEstimate)
    console.log({ priorityFeeEstimate, priorityFromLevel })
    console.log('signing txn', txnIns)
    const id = SpawnLoaderToast({ duration: connectionData?.transactionDuration ?? 60000 })

    const txns = await Promise.all(
      txnIns.map(async (txnIn) =>
        txnIn instanceof TransactionBuilder
          ? await txnIn
              .setPriorityFee(priorityFromLevel)
              ._getTransaction(
                publicKey,
                blockHash.blockhash,
                supportedTransactionTypes.has(0),
                isCreatePoolInx,
                skipComputeUnitsLimit
              )
          : txnIn
      )
    )

    const signedTransactions = await walletProvider.signAllTransactions(txns)

    console.log('user has signed ' + signedTransactions.length + ' transactions')

    const promises = []

    for (const ta of signedTransactions) {
      const promise = async () => {
        const txid = await connection.sendRawTransaction(ta.serialize(), {
          skipPreflight: false
        })
        console.log(txid)
        return txid
      }

      promises.push(promise())
    }

    const results = await Promise.all(promises)

    console.log('results', JSON.stringify(results, null, 2))

    const txSig = results[0]

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
    const success = await notify(
      promise,
      null,
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
    sendTransaction,
    sendBatchTransaction
  }
}

export default useTransaction
