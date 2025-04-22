import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
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
  const [deepLink, setDeepLink] = useState<{ symbolA?: string; symbolB?: string }>({
    symbolA: undefined,
    symbolB: undefined
  })

  const { pathname } = useLocation()
  useEffect(() => {
    const split = pathname.split('/').filter((x) => x.trim() != '')
    if (split.length == 0) return // no path
    // not gamma path
    if (split[0].toLowerCase() != ROUTES.GAMMA.split('/')[1]) return
    const symbol = split[1]
    if (!symbol) return // no mints
    const splitSymbols = symbol.split('-')
    if (splitSymbols.length == 0) return // no mints
    const symbolA = splitSymbols[0]
    const symbolB = splitSymbols[1]
    if (!symbolA || !symbolA.trim()) return // invalid symbolA
    if (!symbolB || !symbolB.trim()) return // invalid symbolB
    if (symbolA == symbolB) return // same symbols - wot?
    setDeepLink((prev) => {
      if (prev.symbolA == symbolA && prev.symbolB == symbolB) return prev
      return {
        symbolA: symbolA,
        symbolB: symbolB
      }
    })
  }, [pathname])

  return [
    deepLink,
    {
      setDeepLink,
      clearDeepLink: () =>
        setDeepLink({
          symbolA: undefined,
          symbolB: undefined
        })
    }
  ]
}

export default usePoolDeepLink
