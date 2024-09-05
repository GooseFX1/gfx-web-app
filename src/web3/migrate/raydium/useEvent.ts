import { useCallback, useRef } from 'react'
import { useLayoutEffect, useEffect } from 'react'

/**@see https://github.com/facebook/react/issues/14099 */
export function useEvent<T>(handler: T): T {
  const handlerRef = useRef<T>(handler)

  useIsomorphicLayoutEffect(() => {
    handlerRef.current = handler
  })

  // @ts-expect-error force
  return useCallback((...args) => {
    const fn = handlerRef.current
    // @ts-expect-error force
    return fn?.(...args)
  }, [])
}

export const isClient = () => typeof window !== 'undefined'

export const useIsomorphicLayoutEffect = isClient() ? useLayoutEffect : useEffect

export const MILLISECONDS_IN_MINUTE = 60 * 1000;