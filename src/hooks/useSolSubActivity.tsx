import useSolSub, { SolsSubs, SubType } from '@/hooks/useSolSub'
import useActivityTracker, { UseActivityTrackerProps } from '@/hooks/useActivityTracker'
import { PublicKey } from '@solana/web3.js'
import { useEffect } from 'react'
import useBoolean from '@/hooks/useBoolean'

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
  callOnReactivation?: boolean
}

function useSolSubActivityMulti({
                                  subType,
                                  publicKeys,
                                  callOnReactivation = false
                                }: UseSolSubActivityMultiProps): void {
  const { on: hookOn, off: hookOff } = useSolSub()
  const [firstMount, setFirstMount] = useBoolean(true)
  useActivityTracker({
    callbackOff: () => {
      console.log('REMOVING TRACKING SOL SUB', subType, publicKeys)
      publicKeys.forEach(({ publicKey, subType: individualSubType }) => {
        if (publicKey) {
          hookOff(`${individualSubType ?? subType}-${publicKey.toBase58()}`)
        }
      })
    },
    callbackOn: () => {
      console.log('TRACKING SOL SUB', subType, publicKeys)
      publicKeys.forEach(({ publicKey, callback, subType: individualSubType }) => {
        if (publicKey) {
          if (callOnReactivation && !firstMount) {
            callback()
          }
          hookOn({
            callback,
            id: `${individualSubType ?? subType}-${publicKey.toBase58()}`,
            SubType: individualSubType ?? subType,
            publicKey
          })
        }
      })
      if (firstMount) {
        setFirstMount.off()
      }
    }
  })
}

export { useSolSubActivityMulti }
