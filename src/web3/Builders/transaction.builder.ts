import {
  ComputeBudgetProgram,
  Transaction,
  TransactionInstruction,
  TransactionInstructionCtorFields
} from '@solana/web3.js'

type TXN_IX = TransactionInstruction | TransactionInstructionCtorFields
type TXN = Transaction | TXN_IX
const DEFAULT_PRIORITY_FEE = 50000

class TransactionBuilder {
  _transaction: Transaction = new Transaction()
  _priorityFee: number = DEFAULT_PRIORITY_FEE

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

  add(txn: TXN | Array<TXN>): TransactionBuilder {
    this.addTxn(txn)
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
    const ix = ComputeBudgetProgram.setComputeUnitPrice({
      microLamports: this._priorityFee
    })

    this._transaction.instructions.unshift(ix)

    return this._transaction
  }

  clear(): TransactionBuilder {
    this._transaction = new Transaction()
    return this
  }
}

export default TransactionBuilder
