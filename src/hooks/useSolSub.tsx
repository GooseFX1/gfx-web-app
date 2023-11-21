import { useEffect } from 'react'
import { PublicKey } from '@solana/web3.js'
import { useConnectionConfig } from '../context'
interface PubKeyButNoRetrieval {
  publicKey: PublicKey
  pubKeyRetrieval?: never
}
interface PubKeyAndRetrieval {
  publicKey?: never
  pubKeyRetrieval: () => PublicKey | Promise<PublicKey | null> | null
}
interface BaseSub {
  callback: () => void
  SubType: SubType
}
type SolsSubs = (PubKeyButNoRetrieval | PubKeyAndRetrieval) & BaseSub
export enum SubType {
  AccountChange = 'AccountChange',
  ProgramAccountChange = 'ProgramAccountChange'
}
interface Unsubs {
  id: number
  unsubType: SubType
}
function useSolSub(subs: SolsSubs[]): void {
  const { connection } = useConnectionConfig()
  useEffect(() => {
    if (subs.length == 0) return
    const unsubIds: Unsubs[] = []
    const createSub = async () => {
      for (const sub of subs) {
        if (sub.pubKeyRetrieval != undefined && !sub.publicKey) {
          sub.publicKey = await sub.pubKeyRetrieval()
        }
        if (!sub.publicKey) continue
        unsubIds.push({
          id: connection[`on${sub.SubType}`](sub.publicKey, sub.callback),
          unsubType: sub.SubType
        })
      }
    }
    createSub()
    return () => {
      unsubIds.forEach((id) => {
        const func = `remove${id.unsubType}Listener`
        connection[func](id.id)
      })
    }
  }, [subs, connection])
}

export default useSolSub
