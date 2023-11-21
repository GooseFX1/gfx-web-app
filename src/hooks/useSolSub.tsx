import { Connection, PublicKey } from '@solana/web3.js'
import { useCallback, useRef } from 'react'

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
  id: string
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

function useSolSub(connection: Connection): {
  on: (sub: SolsSubs) => Promise<void>
  off: () => Promise<void>
} {
  const subs = useRef<Map<string, Unsubs>>(new Map())
  const on = useCallback(
    async (sub: SolsSubs) => {
      console.log('ON SUB', sub)
      if (subs.current.has(sub.id)) {
        await connection[`remove${sub.SubType}Listener`](subs.current.get(sub.id).id)
      }
      const pubkey = sub.publicKey || (await sub?.pubKeyRetrieval?.())
      if (!pubkey) {
        return
      }
      let id: number | undefined
      switch (sub.SubType) {
        case SubType.AccountChange:
          id = await connection.onAccountChange(pubkey, sub.callback)
          break
        case SubType.ProgramAccountChange:
          id = await connection.onProgramAccountChange(pubkey, sub.callback)
          break
        default:
          console.warn('unkown option passed for sub')
          break
      }
      if (id == undefined) return

      subs.current.set(sub.id, {
        id,
        unsubType: sub.SubType
      })
    },
    [connection]
  )
  const off = useCallback(async () => {
    console.log('OFF SUBS', subs.current)
    if (subs.current.size === 0) return
    subs.current.forEach(async (sub) => {
      switch (sub.unsubType) {
        case SubType.AccountChange:
          await connection.removeAccountChangeListener(sub.id)
          break
        case SubType.ProgramAccountChange:
          await connection.removeProgramAccountChangeListener(sub.id)
          break
        default:
          console.warn('unkown option passed for unsub')
          break
      }
    })
    return
  }, [])

  return {
    on,
    off
  }
}

export default useSolSub
