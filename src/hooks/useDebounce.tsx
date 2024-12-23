import React, { useCallback } from 'react'

// manual debounce impl - need to convert to automatic at somepoint
function useDebounce() {
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)
  const debounce = useCallback(
    (callback: () => void | Promise<void>, delay: number) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      timeoutRef.current = setTimeout(() => {
        callback()
      }, delay)
    }, [])
  const abortDebounce = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [timeoutRef.current])
  return {
    debounce,
    abortDebounce,
    timeoutRef: timeoutRef.current
  }
}

export default useDebounce