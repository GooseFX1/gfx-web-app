import React from 'react'

import useBreakPoint from '@/hooks/useBreakPoint'
import TokenFeedDesktopView from '@/pages/TokenFeed/TokenFeedDesktopView'
import TokenFeedMobileView from '@/pages/TokenFeed/TokenFeedMobileView'

function TokenFeed() {
  const { isMobile } = useBreakPoint()

  return (
    <div className={`flex flex-col flex‐1 overflow‐auto px-3 md:px-7.5 w-full`}>
      {isMobile ? (
        <TokenFeedMobileView/>
      ) : (
        <TokenFeedDesktopView/>
      )}
    </div>
  )
}

export default TokenFeed
