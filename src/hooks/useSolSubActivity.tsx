import useSolSub, { SolsSubs, SubType } from '@/hooks/useSolSub'
import { useEffect } from 'react'
import useActivityTracker, { useActivityTrackerManual, UseActivityTrackerProps } from '@/hooks/useActivityTracker'
import { PublicKey } from '@solana/web3.js'

type UseSolSubActivityProps = SolsSubs & Omit<UseActivityTrackerProps, 'callback'>

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
    callback: () => off(id)
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
  publicKeys: { publicKey: PublicKey; callback: () => void }[]
}
function useSolSubActivityMulti({ subType, publicKeys }: UseSolSubActivityMultiProps): void {
  const { on: hookOn, off: hookOff } = useSolSub()
  useActivityTracker()
  const { startTracking, stopTracking } = useActivityTrackerManual()

  useEffect(() => {
    const ids: string[] = []
    if (publicKeys.length) {
      publicKeys.forEach(({ publicKey, callback }) => {
        const id = `${subType}-${publicKey.toBase58()}`
        ids.push(id)
        console.log('TRACKING SOL SUB', id)
        hookOn({ callback: callback, id, SubType: subType, publicKey })
      })
    }

    return () => {
      ids.forEach((id) => {
        console.log('REMOVING TRACKING SOL SUB', id)
        hookOff(id)
      })
    }
  }, [startTracking, stopTracking])
}

export { useSolSubActivityMulti }
