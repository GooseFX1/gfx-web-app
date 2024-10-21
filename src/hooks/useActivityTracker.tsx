import { useEffect, useRef } from 'react'
import useBoolean from '@/hooks/useBoolean'
import { INTERVALS } from '@/utils/time'

export interface UseActivityTrackerProps {
  lifeTime?: number
  callbackOff?: () => void
  callbackOn?: () => void
  callOnMount?: boolean
  callOnUnmount?: boolean
}

const fifteenMinutes = INTERVALS.MINUTE * 15

/**
 *
 * @param {Options} [props]
 */
function useActivityTracker(props?: UseActivityTrackerProps): void {
  const { lifeTime, callbackOff, callbackOn, callOnMount = true, callOnUnmount = true } = props ?? {}
  const [isOff, setIsOff] = useBoolean(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  useEffect(() => {
    const handleMouseMove = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
        if (isOff) {
          setIsOff.off()
          callbackOn?.()
        }
      }

      timerRef.current = setTimeout(() => {
        callbackOff?.()
        setIsOff.on()
      }, lifeTime || fifteenMinutes)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      if (timerRef.current && isOff) {
        clearTimeout(timerRef.current)
      }
    }
  }, [callbackOn, callbackOff, lifeTime, callOnUnmount, isOff])
  useEffect(() => {
    if (callOnMount) {
      callbackOn?.()
    }
    return () => {
      if (callOnUnmount) {
        callbackOff?.()
      }
    }
  }, [callOnMount, callOnUnmount])
}

export default useActivityTracker

interface UseActivityTrackerManualProps extends Omit<UseActivityTrackerProps, 'callbackOff'> {
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
