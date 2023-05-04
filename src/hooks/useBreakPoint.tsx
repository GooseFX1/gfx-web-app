import { useState, useEffect, useCallback } from 'react'
interface IUseBreakPoint {
  isMobile: boolean
  isTablet: boolean
  isDesktop: boolean
  isLaptop: boolean
}
const MOBILE_BREAKPOINT = 500
const TABLET_BREAKPOINT = 1024
const DESKTOP_BREAKPOINT = 1200
function useBreakPoint(): IUseBreakPoint {
  const [breakpoints, setBreakpoints] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    isLaptop: false
  })
  const handleResize = useCallback(() => {
    setBreakpoints({
      isMobile: window.innerWidth < MOBILE_BREAKPOINT,
      isTablet: window.innerWidth >= MOBILE_BREAKPOINT && window.innerWidth < TABLET_BREAKPOINT,
      isLaptop: window.innerWidth >= TABLET_BREAKPOINT && window.innerWidth < DESKTOP_BREAKPOINT,
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
