import React from 'react'

import TokenFeedGridSettings from '@/pages/TokenFeed/TokenFeedGridSettings'
import TokenFeedSocialPanel from '@/pages/TokenFeed/TokenFeedSocialPanel'
import TokenFeedNewTokenPanel from '@/pages/TokenFeed/TokenFeedNewTokenPanel'
import TokenFeedMigratedTokenPanel from '@/pages/TokenFeed/TokenFeedMigratedTokenPanel'
import { H2 } from '@/components/text/TextComponents'
import { cn } from 'gfx-component-lib'

function TokenFeed() {

  return (
    <div
      className={`mt-2 flex px-7.5 w-full items-center h-full justify-center mb-[15px]
      `}
    >
      <div className={`flex flex-col w-full max-w-[1380px] gap-4`}>
        <div className={'inline-flex w-full justify-between'}>
          <H2>Trade</H2>
          <TokenFeedGridSettings />
        </div>
        <div
          className={cn(`grid items-center justify-center justify-items-center gap-4 grid-cols-1
      md:grid-cols-2 xl:grid-cols-3
       `)}
        >
          <TokenFeedSocialPanel />
          <TokenFeedNewTokenPanel />
          <TokenFeedMigratedTokenPanel />
        </div>
      </div>
    </div>
  )
}

export default TokenFeed
