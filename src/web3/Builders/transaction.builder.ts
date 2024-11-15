import {
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  Transaction,
  TransactionInstruction,
  TransactionInstructionCtorFields,
  TransactionMessage,
  VersionedTransaction
} from '@solana/web3.js'

type TXN_IX = TransactionInstruction | TransactionInstructionCtorFields
export type TXN = Transaction | TXN_IX
export type TXN_IN = TXN | Array<TXN>
const DEFAULT_PRIORITY_FEE = 50000

class TransactionBuilder {
  _instructions: TransactionInstruction[] = []
  _priorityFee: number = DEFAULT_PRIORITY_FEE
  _usePriorityFee = true

  constructor(txn?: TXN | Array<TXN>) {
    if (!txn) return
    this.addTxn(txn)
  }

  private addTxn(txn:TXN_IN): void {
    const tx: Array<TXN> = [txn].flat()
    for (const t of tx) {
      if (t instanceof Transaction) {
        this._instructions.push(...t.instructions)
      } else if(t instanceof TransactionInstruction) {
        this._instructions.push(t)
      }
    }
  }

  usePriorityFee(val: boolean): TransactionBuilder {
    this._usePriorityFee = val
    return this
  }

  add(txn?: TXN_IN|TransactionBuilder): TransactionBuilder {
    if (txn) {
      if (txn instanceof TransactionBuilder) {
        this._instructions.push(...txn._instructions)
      }else{
        this.addTxn(txn)
      }
    }
    return this
  }

  setPriorityFee(fee: number): TransactionBuilder {
    this._priorityFee = fee
    return this
  }

  addPriorityFee(): TransactionBuilder {
    this._instructions.unshift(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: this._priorityFee
      })
    )
    return this
  }
  /** @deprecated Internal use in useTransaction hook - compile */
  async _getTransaction(
    walletPublicKey:PublicKey,
    recentBlockhash:string,
    useVersionedTransaction: boolean,
    connection: Connection
  ): Promise<VersionedTransaction|Transaction> {
    if (this._usePriorityFee) {
      const ix = ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: this._priorityFee
      })

      this._instructions.unshift(ix)
      let computeUnits = 1.4e6
      const message = new TransactionMessage({
        instructions: [ComputeBudgetProgram.setComputeUnitLimit({units:computeUnits}),...this._instructions],
        payerKey:walletPublicKey,
        recentBlockhash: recentBlockhash
      }).compileToV0Message()

      const simTx = new VersionedTransaction(message);
      const simRes = await connection.simulateTransaction(simTx, {
        sigVerify: false
      });
      computeUnits = simRes.value.unitsConsumed
      console.log('Assuming comsumption of', computeUnits, 'compute units')
      this._instructions.unshift(ComputeBudgetProgram.setComputeUnitLimit({units: computeUnits}))
    }

    if (useVersionedTransaction){
      const message = new TransactionMessage({
        instructions: this._instructions,
        payerKey:walletPublicKey,
        recentBlockhash: recentBlockhash
      }).compileToV0Message()

      return new VersionedTransaction(message);
    }
      return new Transaction().add(...this._instructions);
  }

  clear(): TransactionBuilder {
    this._instructions = []
    return this
  }
}

export default TransactionBuilder
