import {
  ComputeBudgetProgram,
  Transaction,
  TransactionInstruction,
  TransactionInstructionCtorFields
} from '@solana/web3.js'

type TXN_IX = TransactionInstruction | TransactionInstructionCtorFields
export type TXN = Transaction | TXN_IX
const DEFAULT_PRIORITY_FEE = 50000

class TransactionBuilder {
  _transaction: Transaction = new Transaction()
  _priorityFee: number = DEFAULT_PRIORITY_FEE
  _usePriorityFee = true

  constructor(txn?: TXN | Array<TXN>) {
    if (!txn) return
    this.addTxn(txn)
  }

  private addTxn(txn: TXN | Array<TXN>): void {
    const tx: Array<TXN> = [txn].flat()
    for (const t of tx) {
      if (t instanceof Transaction) {
        this._transaction.add(...t.instructions)
      } else {
        this._transaction.add(t)
      }
    }
  }

  usePriorityFee(val: boolean): TransactionBuilder {
    this._usePriorityFee = val
    return this
  }

  add(txn?: TXN | Array<TXN>): TransactionBuilder {
    if (txn) {
      this.addTxn(txn)
    }
    return this
  }

  setPriorityFee(fee: number): TransactionBuilder {
    this._priorityFee = fee
    return this
  }

  addPriorityFee(): TransactionBuilder {
    this._transaction.instructions.unshift(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: this._priorityFee
      })
    )
    return this
  }

  getTransaction(): Transaction {
    if (this._usePriorityFee) {
      const ix = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: this._priorityFee
      })

      this._transaction.instructions.unshift(ix)
    }

    return this._transaction
  }

  clear(): TransactionBuilder {
    this._transaction = new Transaction()
    return this
  }
}

export default TransactionBuilder
