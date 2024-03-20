import useSolSub, { SolsSubs, SubType } from '@/hooks/useSolSub'
import useActivityTracker, { UseActivityTrackerProps } from '@/hooks/useActivityTracker'
import { PublicKey } from '@solana/web3.js'
import { useEffect } from 'react'

type UseSolSubActivityProps = SolsSubs & Omit<UseActivityTrackerProps, 'callbackOff'>

/**
 * This hook is used to automatically control the subscription to a solana account and automates the removal
 * @param callback
 * @param id
 * @param SubType
 * @param publicKey
 * @param lifeTime
 */
function useSolSubActivity({ callback, id, SubType, publicKey, lifeTime }: UseSolSubActivityProps): void {
  const { on, off } = useSolSub()
  useActivityTracker({
    lifeTime,
    callbackOff: () => off(id),
    callbackOn: () => on({ callback, id, SubType, publicKey })
  })
  useEffect(() => {
    if (publicKey && callback) {
      console.log('TRACKING SOL SUB', id)
      on({ callback, id, SubType, publicKey })
    }

    return () => {
      console.log('REMOVING TRACKING SOL SUB', id)
      off(id)
    }
  }, [callback, id, SubType, publicKey, on, off])
}

export default useSolSubActivity

/**
 * This hook is used to sub to multiple solana accounts and automates the removal

 */
interface UseSolSubActivityMultiProps {
  subType: SubType
  publicKeys: { publicKey: PublicKey; callback: () => void; subType?: SubType }[]
}
function useSolSubActivityMulti({ subType, publicKeys }: UseSolSubActivityMultiProps): void {
  const { on: hookOn, off: hookOff } = useSolSub()
  useActivityTracker({
    callbackOff: () => {
      publicKeys.forEach(({ publicKey, subType: individualSubType }) => {
        if (publicKey) {
          hookOff(`${individualSubType ?? subType}-${publicKey.toBase58()}`)
        }
      })
    },
    callbackOn: () => {
      publicKeys.forEach(({ publicKey, callback, subType: individualSubType }) => {
        if (publicKey) {
          hookOn({
            callback,
            id: `${individualSubType ?? subType}-${publicKey.toBase58()}`,
            SubType: individualSubType ?? subType,
            publicKey
          })
        }
      })
    }
  })

  useEffect(() => {
    const ids: string[] = []
    publicKeys.forEach(({ publicKey, callback }) => {
      if (publicKey) {
        const id = `${subType}-${publicKey.toBase58()}`
        ids.push(id)
        console.log('TRACKING SOL SUB', id)
        hookOn({ callback: callback, id, SubType: subType, publicKey })
      }
    })

    return () => {
      ids.forEach((id) => {
        console.log('REMOVING TRACKING SOL SUB', id)
        hookOff(id)
      })
    }
  }, [subType, publicKeys])
}

export { useSolSubActivityMulti }
