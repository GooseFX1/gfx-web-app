import { useRef } from 'react'

function useFirstRender() {
  const firstRender = useRef(true)
  const v = firstRender.current;
  if (firstRender.current) {
    firstRender.current = false
  }
  return v;
}

export default useFirstRender