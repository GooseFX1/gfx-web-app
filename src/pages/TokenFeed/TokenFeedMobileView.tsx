import React, { useRef } from 'react'
import TokenFeedMobileDrawer from '@/pages/TokenFeed/TokenFeedMobileDrawer'
import { RadioGroup, RadioGroupItem } from 'gfx-component-lib'
import TokenFeedSettings from '@/pages/TokenFeed/TokenFeedSettings'
import { useTokenFeed } from '@/context/tokenFeedContext'

function TokenFeedMobileView() {
  const {mobileSelectedColumn, updateMobileSelectedColumn} = useTokenFeed()
  const containerRef = useRef<HTMLDivElement | null>(null)
  return (
    <div ref={containerRef}>
      <div className={'inline-flex justify-between w-full gap-4'}>
        <RadioGroup value={mobileSelectedColumn} onValueChange={updateMobileSelectedColumn}
        className={`w-full`}>
          <RadioGroupItem value={'new'} variant={'primary'} size={'xl'}>
            New Pairs
          </RadioGroupItem>
          <RadioGroupItem value={'soon'} variant={'primary'} size={'xl'}>
            Soon
          </RadioGroupItem>
          <RadioGroupItem value={'migrated'} variant={'primary'} size={'xl'}>
            Migrated
          </RadioGroupItem>
        </RadioGroup>
        <TokenFeedSettings column={mobileSelectedColumn} />
      </div>
      <TokenFeedMobileDrawer container={containerRef.current}/>
    </div>
  )
}

export default TokenFeedMobileView
