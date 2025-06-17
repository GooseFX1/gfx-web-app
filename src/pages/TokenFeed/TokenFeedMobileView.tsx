import React, { useRef } from 'react'
import TokenFeedMobileDrawer from '@/pages/TokenFeed/TokenFeedMobileDrawer'
import { RadioGroup, RadioGroupItem } from 'gfx-component-lib'
import TokenFeedSettings from '@/pages/TokenFeed/TokenFeedSettings'
import { useTokenFeed } from '@/context/tokenFeedContext'
import { H3 } from '@/components/text/TextComponents'
import TokenFeedQuickBuy from '@/pages/TokenFeed/TokenFeedQuickBuy'
import { TokenFeedTokensContainer } from '@/pages/TokenFeed/TokenFeedContainer'

function TokenFeedMobileView() {
  const { mobileSelectedColumn, updateMobileSelectedColumn, columnFilters } = useTokenFeed()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const currentFilters = columnFilters[mobileSelectedColumn]
  return (
    <div ref={containerRef} className={`flex flex-col gap-4`}>
      <div className={'inline-flex justify-between w-full gap-4'}>
        <RadioGroup value={mobileSelectedColumn} onValueChange={updateMobileSelectedColumn} className={`w-full`}>
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
      <div
        className={`inline-flex w-full justify-between gap-4 items-center pb-2 border-b-1 border-solid 
        border-border-lightmode-secondary dark:border-border-darkmode-secondary`}
      >
        <H3 className={`underline decoration-2 underline-offset-2 decoration-dashed`}>
          {mobileSelectedColumn === 'new'
            ? 'New Pairs'
            : mobileSelectedColumn === 'soon'
            ? 'Soon'
            : mobileSelectedColumn === 'migrated'
            ? 'Migrated'
            : ''}
        </H3>
        <TokenFeedQuickBuy groupClassName={`w-[240px]`}/>
      </div>
      <TokenFeedTokensContainer className={`py-0`} tokens={[
        {
          age: '14m',
          name: 'GooseFX',
          address: 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD',
          holders: 1000,
          tickerSymbol: 'GFX',
          topHolders: '0.1%',
          migrated: false
        },
        {
          age: '14m',
          name: 'GooseFX',
          address: 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD',
          holders: 1000,
          tickerSymbol: 'GFX',
          topHolders: '0.1%',
          migrated: false,
          bondingCurveProgress: 100
        },
        {
          age: '14m',
          name: 'GooseFX',
          address: 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD',
          holders: 1000,
          tickerSymbol: 'GFX',
          topHolders: '0.1%',
          migrated: false
        }
      ]} currentFilters={currentFilters} />
      <TokenFeedMobileDrawer container={containerRef.current} />
    </div>
  )
}

export default TokenFeedMobileView
