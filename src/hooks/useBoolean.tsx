import { useCallback, useState } from 'react'

function useBoolean(
  initialValue = false
): [boolean, { toggle: () => void; on: () => void; off: () => void; set: (value: boolean) => void }] {
  const [val, setVal] = useState(initialValue)
  const toggle = useCallback(() => setVal((prev) => !prev), [])
  const on = useCallback(() => setVal(true), [])
  const off = useCallback(() => setVal(false), [])
  const set = useCallback((value: boolean) => setVal(value), [])
  return [val, { toggle, on, off, set }]
}

export default useBoolean
