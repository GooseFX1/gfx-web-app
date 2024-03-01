import useSolSub, { SolsSubs } from '@/hooks/useSolSub'
import { useEffect } from 'react'
import useActivityTracker, { UseActivityTrackerProps } from '@/hooks/useActivityTracker'

type UseSolSubActivityProps = SolsSubs & Omit<UseActivityTrackerProps, 'callback'>
function useSolSubActivity({ callback, id, SubType, publicKey, lifeTime }: UseSolSubActivityProps): void {
  const { on, off } = useSolSub()
  useActivityTracker({
    lifeTime,
    callback: () => off(id)
  })
  useEffect(() => {
    if (!publicKey || !callback) {
      return
    }
    console.log('TRACKING SOL SUB', id)
    on({ callback, id, SubType, publicKey })
    return () => {
      console.log('REMOVING TRACKING SOL SUB', id)
      off(id)
    }
  }, [callback, id, SubType, publicKey, on, off])
}

export default useSolSubActivity
