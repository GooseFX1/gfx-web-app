import { PublicKey } from '@solana/web3.js'
import { useCallback, useEffect } from 'react'
import SolanaSubscriber from '../utils/connectionSub'
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
  id: string
}

type SolsSubs = (PubKeyButNoRetrieval | PubKeyAndRetrieval) & BaseSub

export enum SubType {
  AccountChange = 'AccountChange',
  ProgramAccountChange = 'ProgramAccountChange'
}

export interface Unsubs {
  subId: string
  id: number
  unsubType: SubType
}

function useSolSub(): {
  on: (sub: SolsSubs) => Promise<void>
  off: (id: string | string[]) => Promise<void>
} {
  const { endpoint } = useConnectionConfig()
  useEffect(() => SolanaSubscriber.changeConnection(endpoint), [endpoint])
  const on = useCallback(async (sub: SolsSubs) => {
    console.log('ON SUB', sub)

    const pubkey = sub.publicKey || (await sub?.pubKeyRetrieval?.())
    if (!pubkey) {
      console.log('CANCELLING SUB FOR: ', sub.id, ' NO PUBKEY')
      return
    }
    switch (sub.SubType) {
      case SubType.AccountChange:
        await SolanaSubscriber.subscribeAccountChange(pubkey, sub.id, sub.callback)
        break
      case SubType.ProgramAccountChange:
        await SolanaSubscriber.subscribeAccountChange(pubkey, sub.id, sub.callback)
        break
      default:
        console.warn('unkown option passed for sub')
        break
    }
  }, [])
  const removeListener = useCallback(async (unsub: Unsubs) => {
    switch (unsub.unsubType) {
      case SubType.AccountChange:
        SolanaSubscriber.unsubscribeAccountChange(unsub.subId)
        break
      case SubType.ProgramAccountChange:
        SolanaSubscriber.unsubscribeProgramAccountChange(unsub.subId)
        break
      default:
        console.warn('unkown option passed for unsub')
        break
    }
  }, [])
  const off = useCallback(
    async (id: string | string[]) => {
      console.log('OFF SUBS', SolanaSubscriber.subs, { id })
      if (SolanaSubscriber.subs.size === 0) return
      if (Array.isArray(id)) {
        id.forEach((i) => {
          if (SolanaSubscriber.subs.has(i)) {
            removeListener(SolanaSubscriber.subs.get(i))
          }
        })
        return
      }
      if (id && SolanaSubscriber.subs.has(id)) {
        await removeListener(SolanaSubscriber.subs.get(id))
        return
      }
    },
    [removeListener]
  )

  return {
    on,
    off
  }
}

export default useSolSub
