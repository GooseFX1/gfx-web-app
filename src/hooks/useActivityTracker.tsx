import { useEffect } from 'react'

export interface UseActivityTrackerProps {
  lifeTime?: number
  callback?: () => void
}
const fifteenMinutes = 1000 * 60 * 15
function useActivityTracker({ callback, lifeTime = fifteenMinutes }: UseActivityTrackerProps): void {
  useEffect(() => {
    let timer: NodeJS.Timeout | null
    const handleMouseMove = () => {
      if (timer) {
        clearTimeout(timer)
      }
      timer = setTimeout(() => {
        callback?.()
      }, lifeTime)
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])
}

export default useActivityTracker
