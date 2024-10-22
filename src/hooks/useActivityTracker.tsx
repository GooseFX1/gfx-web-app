import { useEffect, useRef } from 'react'
import useBoolean from '@/hooks/useBoolean'
import { INTERVALS } from '@/utils/time'

export interface UseActivityTrackerProps {
  lifeTime?: number
  callbackOff?: () => void
  callbackOn?: () => void
}

const fifteenMinutes = INTERVALS.MINUTE * 15

/**
 * Activity Tracker Hook
 * @param {UseActivityTrackerProps} [props]
 */
function useActivityTracker(props?: UseActivityTrackerProps): void {
  const { lifeTime, callbackOff, callbackOn } = props ?? {}
  const [isOff, setIsOff] = useBoolean(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handleActivity = () => {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }

      // If the system was in "off" state, trigger callbackOn
      if (isOff) {
        setIsOff.off()
        callbackOn?.()
      }

      // Start a new timer to trigger callbackOff after inactivity
      timerRef.current = setTimeout(() => {
        callbackOff?.()
        setIsOff.on()
      }, lifeTime || fifteenMinutes)
    }

    // Attach event listeners for different types of user activity
    window.addEventListener('mousemove', handleActivity)
    window.addEventListener('keydown', handleActivity)
    window.addEventListener('scroll', handleActivity)
    window.addEventListener('click', handleActivity)

    return () => {
      // Clean up event listeners and clear the timer on unmount
      window.removeEventListener('mousemove', handleActivity)
      window.removeEventListener('keydown', handleActivity)
      window.removeEventListener('scroll', handleActivity)
      window.removeEventListener('click', handleActivity)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [callbackOn, callbackOff, lifeTime, isOff, setIsOff])
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
