import React, { useMemo } from 'react'
import { H2 } from '@/components/text/TextComponents'
import TokenFeedQuickBuy from '@/pages/TokenFeed/TokenFeedQuickBuy'
import TokenFeedGridSettings from '@/pages/TokenFeed/TokenFeedGridSettings'
import { cn } from 'gfx-component-lib'
import TokenFeedSocialPanel from '@/pages/TokenFeed/TokenFeedSocialPanel'
import TokenFeedNewTokenPanel from '@/pages/TokenFeed/TokenFeedNewTokenPanel'
import TokenFeedMigratedTokenPanel from '@/pages/TokenFeed/TokenFeedMigratedTokenPanel'
import TokenFeedSoonTokenPanel from '@/pages/TokenFeed/TokenFeedSoonTokenPanel'
import { useTokenFeed } from '@/context/tokenFeedContext'
import useBreakPoint from '@/hooks/useBreakPoint'

function TokenFeedDesktopView() {
  const { totalColumnsEnabled } = useTokenFeed()
  const { isMobile, isTablet } = useBreakPoint()
  const gridTemplateColumns = useMemo(()=>{
    if (isMobile){
      return `repeat(1, minmax(450px, 1fr))`
    } else if (isTablet){
      return `repeat(2, minmax(330px, 1fr))`
    } else {
      return `repeat(${totalColumnsEnabled}, minmax(330px, 1fr))`
    }
  },[totalColumnsEnabled, isMobile, isTablet])
  return (
    <div className={`flex flex-col w-full max-w-[1380px] gap-4 mx-auto`}>
      <div className={'inline-flex w-full justify-between'}>
        <H2>Trade</H2>
        <div className={'inline-flex gap-4'}>
          <TokenFeedQuickBuy />
          <TokenFeedGridSettings />
        </div>
      </div>
      <div
        className={cn(`grid items-center justify-center justify-items-center gap-4 content-between
       `)}
        style={{
          gridTemplateColumns: gridTemplateColumns
        }}
      >
        <TokenFeedSocialPanel />
        <TokenFeedNewTokenPanel />
        <TokenFeedMigratedTokenPanel />
        <TokenFeedSoonTokenPanel />
      </div>
    </div>
  )
}

export default TokenFeedDesktopView
