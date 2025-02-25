import { useEffect, useState } from 'react'
import useDebounce from '@/hooks/useDebounce'

type UseDebounceInputProps<T> = {
  value: T,
  onChange: (value: T) => void,
  delay?: number
}
type UseDebounceInputReturn<T> = [
  T,
  (value: T) => void
]
function useDebounceInput<T>({
  value,
  onChange,
  delay = 333
                          }: UseDebounceInputProps<T>): UseDebounceInputReturn<T> {
  const [_value, _setValue] = useState<T>(value)
  const {debounce, abortDebounce} = useDebounce()
  useEffect(() => {
    abortDebounce();
    debounce(()=>onChange(_value),delay)
  }, [_value,delay])

  return [
    _value,
    _setValue
  ]
}

export default useDebounceInput