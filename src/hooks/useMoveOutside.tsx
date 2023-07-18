import { MutableRefObject, useCallback, useEffect } from 'react'

function useMoveOutside(ref: MutableRefObject<any>, callback: () => any): void {
  const handleMove = useCallback(
    (e: MouseEvent) => {
      if (ref.current) {
        if (!ref.current.contains(e.target as HTMLElement)) {
          callback()
        }
      }
    },
    [ref, callback]
  )
  useEffect(() => {
    window.addEventListener('mousemove', handleMove)
    return () => {
      window.removeEventListener('mousemove', handleMove)
    }
  }, [handleMove])
}

export default useMoveOutside
