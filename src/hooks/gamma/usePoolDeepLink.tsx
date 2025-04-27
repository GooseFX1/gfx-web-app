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
    if (split.length == 0) {
      setDeepLink({
        symbolA: undefined,
        symbolB: undefined
      })
      return
    }
    // not gamma path
    if (split[0].toLowerCase() != ROUTES.GAMMA.split('/')[1]) return
    const symbol = split[1]
    if (!symbol) {
      setDeepLink({
        symbolA: undefined,
        symbolB: undefined
      })
      return
    } // // no symbols
    const splitSymbols = symbol.split('-')
    if (splitSymbols.length == 0) {
      // no symbols
      setDeepLink({
        symbolA: undefined,
        symbolB: undefined
      })
      return
    }
    const symbolA = splitSymbols[0]
    const symbolB = splitSymbols[1]
    if (!symbolA || !symbolA.trim() || !symbolB || !symbolB.trim() || symbolA == symbolB) {
      setDeepLink({
        symbolA: undefined,
        symbolB: undefined
      })
      return
    }
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
