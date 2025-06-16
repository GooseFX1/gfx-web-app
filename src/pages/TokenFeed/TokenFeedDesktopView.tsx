import React from 'react'
import { H2 } from '@/components/text/TextComponents'
import TokenFeedQuickBuy from '@/pages/TokenFeed/TokenFeedQuickBuy'
import TokenFeedGridSettings from '@/pages/TokenFeed/TokenFeedGridSettings'
import { cn } from 'gfx-component-lib'
import TokenFeedLPDrawer from '@/pages/TokenFeed/TokenFeedLPDrawer'
import TokenFeedSocialPanel from '@/pages/TokenFeed/TokenFeedSocialPanel'
import TokenFeedNewTokenPanel from '@/pages/TokenFeed/TokenFeedNewTokenPanel'
import TokenFeedMigratedTokenPanel from '@/pages/TokenFeed/TokenFeedMigratedTokenPanel'
import TokenFeedSoonTokenPanel from '@/pages/TokenFeed/TokenFeedSoonTokenPanel'

function TokenFeedDesktopView() {
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
          grid-cols-[repeat(1,_minmax(450px,_1fr))] md:grid-cols-[repeat(2,_minmax(330px,_1fr))]
           lg:grid-cols-[repeat(3,_minmax(330px,_1fr))] 
       `)}
      >
        <TokenFeedLPDrawer />
        <TokenFeedSocialPanel />
        <TokenFeedNewTokenPanel />
        <TokenFeedMigratedTokenPanel />
        <TokenFeedSoonTokenPanel />
      </div>
    </div>
  )
}

export default TokenFeedDesktopView
