import { useCallback, useMemo } from 'react'
import TransactionBuilder, { TXN } from '@/web3/Builders/transaction.builder'
import { useConnectionConfig } from '@/context'
import { BlockheightBasedTransactionConfirmationStrategy, Commitment, Connection, Transaction } from '@solana/web3.js'
import { useWallet } from '@solana/wallet-adapter-react'
import { SendTransactionOptions } from '@solana/wallet-adapter-base'
import { notifyUsingPromise, promiseBuilder } from '@/utils/perpsNotifications'
import { useWalletBalance } from '@/context/walletBalanceContext'

type SendTxnOptions = {
  connection?: Connection
  options?: SendTransactionOptions
  confirmationWaitType?: Commitment
}
type useTransactionReturn = {
  createTransactionBuilder: (txn?: TXN) => TransactionBuilder
  sendTransaction: (
    txn: Transaction | TransactionBuilder,
    connectionData?: SendTxnOptions
  ) => Promise<{ success: boolean; txSig: string }>
}
const baseSet = new Set()

function useTransaction(): useTransactionReturn {
  const { priorityFeeValue } = useConnectionConfig()
  const { sendTransaction: sendTransactionOriginal, wallet } = useWallet()
  const { connection: originalConnection } = useConnectionConfig()
  const { connectedWalletPublicKey } = useWalletBalance()
  const createTransactionBuilder = useCallback(
    (txn?: TXN) => new TransactionBuilder(txn).setPriorityFee(priorityFeeValue),
    [priorityFeeValue]
  )
  const supportedTransactionTypes = useMemo(() =>
    wallet?.adapter?.supportedTransactionVersions ?? baseSet, [wallet])
  const sendTransaction = useCallback(
    async (txnIn: Transaction | TransactionBuilder, connectionData?: SendTxnOptions) => {

      const connection = connectionData?.connection ?? originalConnection
      const options = { ...connectionData?.options, skipPreflight: true }
      let blockHash = await connection.getLatestBlockhash()

      const txn = txnIn instanceof TransactionBuilder ?
        txnIn._getTransaction(connectedWalletPublicKey, blockHash.blockhash, supportedTransactionTypes.has(0)) : txnIn
      console.log('signing txn', txn)
      const txSig = await sendTransactionOriginal(txn, connection, options).catch((err) => {
        console.log('[ERROR] Transaction failed', err)
        return ''
      })
      console.log('got signature response', txSig)
      if (!txSig) {
        return { txSig: '', success: false }
      }
      const exec = async () => {
        blockHash = await connection.getLatestBlockhash()
        console.log('blockhash', blockHash)
        const blockHeightConfirmationStrategy: BlockheightBasedTransactionConfirmationStrategy = {
          signature: txSig,
          blockhash: blockHash.blockhash,
          lastValidBlockHeight: blockHash.lastValidBlockHeight
        }
        console.log('PRE RESPONSE', txSig)
        return connection
          .confirmTransaction(blockHeightConfirmationStrategy, connectionData?.confirmationWaitType ?? 'finalized')
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
      const promise = promiseBuilder<Awaited<ReturnType<typeof exec>>>(exec())
      const success = await notifyUsingPromise(promise, null, txSig)
      return { txSig, success }
    },
    [originalConnection, sendTransactionOriginal, supportedTransactionTypes]
  )
  return {
    createTransactionBuilder,
    sendTransaction
  }
}

export default useTransaction
