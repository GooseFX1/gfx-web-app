import { useEffect, useRef } from 'react'
import useBoolean from '@/hooks/useBoolean'

export interface UseActivityTrackerProps {
  lifeTime?: number
  callback?: () => void
}
const fifteenMinutes = 1000 * 60 * 15

/**
 *
 * @param {Options} [props]
 */
function useActivityTracker(props?: UseActivityTrackerProps): void {
  const { lifeTime, callback } = props ?? {}
  useEffect(() => {
    let timer: NodeJS.Timeout | null
    const handleMouseMove = () => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        callback?.()
      }, lifeTime ?? fifteenMinutes)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
}

export default useActivityTracker
interface UseActivityTrackerManualProps extends Omit<UseActivityTrackerProps, 'callback'> {
  lifeTime?: number
  callback?: () => void
  startingValue?: boolean
}
interface UseActivityTrackerManualReturn {
  active: boolean
  startTracking: (callback: () => void) => void
  resetActivity: () => void
  stopTracking: () => void
}

/**
 *
 * @param {Options} [props]
 * */
export function useActivityTrackerManual(props?: UseActivityTrackerManualProps): UseActivityTrackerManualReturn {
  const { lifeTime, startingValue } = props ?? { lifeTime: fifteenMinutes, startingValue: true }
  const [active, setActive] = useBoolean(startingValue)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const callbackRef = useRef<() => void>(() => () => {
    //VOID
    // }
  })
  useEffect(() => {
    const handleMouseMove = () => {
      if (!active) {
        setActive.on()
      }
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
  const startTracking = (callback: () => void) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    callbackRef.current = callback
    timerRef.current = setTimeout(() => {
      setActive.off()
      callback()
    }, lifeTime)
  }
  const resetActivity = () => {
    setActive.on()
    startTracking(callbackRef.current)
  }
  const stopTracking = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
  }
  return {
    active,
    startTracking,
    resetActivity,
    stopTracking
  }
}
