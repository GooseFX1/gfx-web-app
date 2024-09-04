import { useState, useEffect, useCallback } from 'react'

interface IUseBreakPoint {
  isMobile: boolean
  isTablet: boolean
  isLaptop: boolean
  isDesktop: boolean
}

const MOBILE_BREAKPOINT = 500
const TABLET_BREAKPOINT = 768
const DESKTOP_BREAKPOINT = 1200

function useBreakPoint(): IUseBreakPoint {
  const [breakpoints, setBreakpoints] = useState(() => ({
    isMobile: window.innerWidth <= MOBILE_BREAKPOINT,
    isTablet: window.innerWidth >= TABLET_BREAKPOINT && window.innerWidth < DESKTOP_BREAKPOINT,
    isLaptop: window.innerWidth >= DESKTOP_BREAKPOINT,
    isDesktop: window.innerWidth >= DESKTOP_BREAKPOINT
  }))

  const handleResize = useCallback(() => {
    setBreakpoints({
      isMobile: window.innerWidth <= MOBILE_BREAKPOINT,
      isTablet: window.innerWidth >= TABLET_BREAKPOINT && window.innerWidth < DESKTOP_BREAKPOINT,
      isLaptop: window.innerWidth >= DESKTOP_BREAKPOINT,
      isDesktop: window.innerWidth >= DESKTOP_BREAKPOINT
    })
  }, [])

  useEffect(() => {
    handleResize() // initial set
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return breakpoints
}

export default useBreakPoint
