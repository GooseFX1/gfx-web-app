import { AccountChangeCallback, Connection, ProgramAccountChangeCallback, PublicKey } from '@solana/web3.js'
import { HELIUS_RPC } from '../context'
import { SubType, Unsubs } from '../hooks/useSolSub'

class SolanaSub {
  subs: Map<string, Unsubs>
  connection: Connection

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(endpoint: string = HELIUS_RPC.endpoint) {
    this.subs = new Map()
    this.connection = new Connection(endpoint, 'processed')
  }

  changeConnection = (endpoint: string) => {
    if (endpoint === this.connection.rpcEndpoint) return
    this.connection = new Connection(endpoint, 'processed')
  }
  subscribeAccountChange = async (
    publicKey: PublicKey,
    subId: string,
    callback: AccountChangeCallback
  ) => {
    if (this.subs.has(subId)) {
      await this.connection.removeAccountChangeListener(this.subs.get(subId).id)
    }

    const id = await this.connection.onAccountChange(publicKey, callback, {
      commitment: 'confirmed',
      encoding: 'base64'
    })
    this.subs.set(subId, {
      subId,
      id,
      unsubType: SubType.AccountChange
    })
  }
  unsubscribeAccountChange = (subId: string) => {
    const item = this.subs.get(subId)
    if (item == undefined) return
    this.connection.removeAccountChangeListener(item.id)
    this.subs.delete(subId)
  }
  subscribeProgramAccountChange = async (
    programId: PublicKey,
    subId: string,
    callback: ProgramAccountChangeCallback
  ) => {
    if (this.subs.has(subId)) {
      await this.connection.removeProgramAccountChangeListener(this.subs.get(subId).id)
    }
    const id = await this.connection.onProgramAccountChange(programId, callback, {
      commitment: 'confirmed',
      encoding: 'base64'
    })
    this.subs.set(subId, {
      subId,
      id,
      unsubType: SubType.ProgramAccountChange
    })
  }
  unsubscribeProgramAccountChange = (id: string) => {
    const item = this.subs.get(id)
    if (item == undefined) return
    this.connection.removeProgramAccountChangeListener(item.id)
    this.subs.delete(id)
  }
  updateConnection = (connection: Connection) => {
    this.connection = connection
  }
}
class SolanaSubPool {
  pool: Map<string, SolanaSub>

  constructor() {
    this.pool = new Map()
  }

  get = (endpoint?: string): SolanaSub => {
    const e = !endpoint ? HELIUS_RPC.endpoint : endpoint
    if (this.pool.has(e)) return this.pool.get(e)
    const sub = new SolanaSub(endpoint)
    this.pool.set(endpoint, sub)
    return sub
  }
}

const SolanaSubscriberPool = new SolanaSubPool();
export {SolanaSubscriberPool}