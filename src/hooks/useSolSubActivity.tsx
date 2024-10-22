import useSolSub, { SolsSubs, SubType } from '@/hooks/useSolSub'
import useActivityTracker, { UseActivityTrackerProps } from '@/hooks/useActivityTracker'
import { PublicKey } from '@solana/web3.js'
import { useCallback, useEffect } from 'react'
import useBoolean from '@/hooks/useBoolean'
import { useWallet } from '@solana/wallet-adapter-react'

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

interface UseSolSubActivityMultiProps {
  subType: SubType
  publicKeys: { publicKey: PublicKey; callback: () => void; subType?: SubType }[]
}

function useSolSubMulti({
                          subType,
                          publicKeys
                        }: UseSolSubActivityMultiProps): {
  callbackOn: () => void
  callbackOff: () => void
} {
  const { on: hookOn, off: hookOff } = useSolSub()
  const [firstMount, setFirstMount] = useBoolean(true)
  const { publicKey } = useWallet()


  const callbackOff = useCallback(() => {
    if (publicKeys.length == 0) {
      console.log('REMOVING TRACKING SOL SUB - NO PUBLIC KEYS PARSED', publicKeys)
      return
    }
    console.log('REMOVING TRACKING SOL SUB', subType, publicKeys)
    publicKeys.forEach(({ publicKey, subType: individualSubType }) => {
      if (publicKey) {
        hookOff(`${individualSubType ?? subType}-${publicKey.toBase58()}`)
      }
    })
  }, [subType, publicKeys, hookOff])
  const callbackOn = useCallback(() => {
    if (publicKeys.length == 0) {
      console.log('TRACKING SOL SUB - NO PUBLIC KEYS PARSED', publicKeys)
      return
    }
    console.log('TRACKING SOL SUB', subType, publicKeys)
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
  }, [subType, publicKeys, hookOn])
  useEffect(() => {
    // already called initial sub call
    if (!firstMount) return
    // reset due to publicKey disconnect
    if (!publicKey) {
      setFirstMount.on()
      return
    }
    callbackOn()
    setFirstMount.off()
  }, [callbackOn, publicKey])

  return {
    callbackOn,
    callbackOff
  }
}

export { useSolSubMulti }

function useSolSubActivityMulti(props: UseSolSubActivityMultiProps): void {
  const { callbackOn, callbackOff } = useSolSubMulti(props)
  useActivityTracker({
    callbackOff,
    callbackOn
  })
}

export { useSolSubActivityMulti }