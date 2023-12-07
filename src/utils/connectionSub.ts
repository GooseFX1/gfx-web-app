import { Connection, PublicKey } from '@solana/web3.js'
import { APP_RPC } from '../context'
import { SubType, Unsubs } from '../hooks/useSolSub'

class SolanaSub {
  subs: Map<string, Unsubs>
  connection: Connection
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {
    this.subs = new Map()
    this.connection = new Connection(APP_RPC.endpoint, 'processed')
  }
  changeConnection = (endpoint: string) => {
    if (endpoint === this.connection.rpcEndpoint) return
    this.connection = new Connection(endpoint, 'processed')
  }
  subscribeAccountChange = async (publicKey: PublicKey, subId: string, callback: () => void) => {
    if (this.subs.has(subId)) {
      await this.connection.removeAccountChangeListener(this.subs.get(subId).id)
    }
    const id = await this.connection.onAccountChange(publicKey, callback, 'processed')
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
  subscribeProgramAccountChange = async (programId: PublicKey, subId: string, callback: () => void) => {
    if (this.subs.has(subId)) {
      await this.connection.removeProgramAccountChangeListener(this.subs.get(subId).id)
    }
    const id = await this.connection.onProgramAccountChange(programId, callback, 'processed')
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
}

const SolanaSubscriber = new SolanaSub()

export default SolanaSubscriber
