import { Ref, useEffect, useRef } from 'react'
type Handler = any
function useClickOutside(handler: Handler): Ref<any> {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (open && ref.current && !ref.current.contains(event.target)) {
        handler()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    //document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      // document.removeEventListener('touchstart', handleClickOutside);
    }
  }, [handler])

  return ref
}

export default useClickOutside
