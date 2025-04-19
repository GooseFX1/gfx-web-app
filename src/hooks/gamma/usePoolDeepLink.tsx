import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { ROUTES } from '@/Router'

function usePoolDeepLink() {
  const [deepLink, setDeepLink] = useState<{ mintA?: string; mintB?: string }>({
    mintA: undefined,
    mintB: undefined
  })

  const { pathname } = useLocation()
  useEffect(() => {
    const split = pathname.split('/').filter((x) => x.trim() == '')
    if (split.length == 0) return // no path
    // not gamma path
    if (split[0].toLowerCase() != ROUTES.GAMMA) return
    const mints = split[1]
    if (!mints) return // no mints
    const splitMints = mints.split('-')
    if (splitMints.length == 0) return // no mints
    const mintA = splitMints[0]
    const mintB = splitMints[1]
    if (!mintA || mintA.length < 32 || mintA.length > 44) return // invalid mintA
    if (!mintB || mintB.length < 32 || mintB.length > 44) return // invalid mintB
    if (mintA == mintB) return // same mints - wot?
    setDeepLink((prev) => {
      if (prev.mintA == mintA && prev.mintB == mintB) return prev
      return {
        mintA,
        mintB
      }
    })
  }, [pathname])

  return [
    deepLink,
    {
      setDeepLink,
      clearDeepLink: () =>
        setDeepLink({
          mintA: undefined,
          mintB: undefined
        })
    }
  ]
}

export default usePoolDeepLink
