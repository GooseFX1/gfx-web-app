import { useCallback, useState } from 'react'

function useBoolean(initialValue = false): [boolean, { toggle: () => void; on: () => void; off: () => void }] {
  const [val, setVal] = useState(initialValue)
  const toggle = useCallback(() => setVal((prev) => !prev), [])
  const on = useCallback(() => setVal(true), [])
  const off = useCallback(() => setVal(false), [])
  return [val, { toggle, on, off }]
}

export default useBoolean
