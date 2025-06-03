import { useLocation } from 'react-router-dom'
import { useEffect, useState, useCallback, useMemo } from 'react'
import { ROUTES } from '@/Router'

type DeepLink = {
  symbolA?: string
  symbolB?: string
}
type DeepLinkActions = {
  setDeepLink: (deepLink: DeepLink) => void
  clearDeepLink: () => void
}

function usePoolDeepLink(): [DeepLink, DeepLinkActions] {
  const [deepLink, setDeepLink] = useState<DeepLink>({ symbolA: undefined, symbolB: undefined })
  const { pathname } = useLocation()

  useEffect(() => {
    const split = pathname.split('/').filter(Boolean)
    if (!split.length || !ROUTES.GAMMA.includes(split[0])) {
      setDeepLink((prev) =>
        prev.symbolA === undefined && prev.symbolB === undefined ? prev : { symbolA: undefined, symbolB: undefined }
      )
      return
    }

    const symbol = split.find((x) => x.includes('-'))
    if (!symbol) {
      setDeepLink((prev) =>
        prev.symbolA === undefined && prev.symbolB === undefined ? prev : { symbolA: undefined, symbolB: undefined }
      )
      return
    }

    const [symbolA, symbolB] = symbol.split('-')
    if (!symbolA || !symbolB || symbolA.trim() === '' || symbolB.trim() === '' || symbolA === symbolB) {
      setDeepLink((prev) =>
        prev.symbolA === undefined && prev.symbolB === undefined ? prev : { symbolA: undefined, symbolB: undefined }
      )
      return
    }

    setDeepLink((prev) =>
      prev.symbolA === symbolA && prev.symbolB === symbolB ? prev : { symbolA, symbolB }
    )
  }, [pathname])

  const memoizedSetDeepLink = useCallback((dl: DeepLink) => setDeepLink(dl), [])
  const memoizedClearDeepLink = useCallback(
    () => setDeepLink({ symbolA: undefined, symbolB: undefined }),
    []
  )

  const actions = useMemo(
    () => ({
      setDeepLink: memoizedSetDeepLink,
      clearDeepLink: memoizedClearDeepLink
    }),
    [memoizedSetDeepLink, memoizedClearDeepLink]
  )

  return [deepLink, actions]
}

export default usePoolDeepLink
