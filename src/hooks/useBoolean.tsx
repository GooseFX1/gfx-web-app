import { useCallback, useState } from 'react'
type useBooleanReturn = [
  boolean,
  { toggle: () => void; on: () => void; off: () => void; set: (value: boolean) => void }
]
function useBoolean(initialValue = false): useBooleanReturn {
  const [val, setVal] = useState(initialValue)
  const toggle = useCallback(() => setVal((prev) => !prev), [])
  const on = useCallback(() => setVal(true), [])
  const off = useCallback(() => setVal(false), [])
  const set = useCallback((value: boolean) => setVal(value), [])
  return [val, { toggle, on, off, set }]
}

export default useBoolean
