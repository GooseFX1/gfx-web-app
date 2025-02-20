import { useMemo } from 'react'

function useMemoizedArrayReturn<T extends any[]>(...props: T): T {
  return useMemo(() => [...props] as T,[props])
}

export default useMemoizedArrayReturn