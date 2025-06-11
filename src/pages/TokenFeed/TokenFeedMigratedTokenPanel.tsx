import React from 'react'
import TokenFeedContainer, {
  TokenFeedContainerHeaderWithTitle,
  TokenFeedTokensContainer
} from '@/pages/TokenFeed/TokenFeedContainer'
import { useTokenFeed } from '@/context/tokenFeedContext'
import { cn } from 'gfx-component-lib'
import TokenFeedSettings from '@/pages/TokenFeed/TokenFeedSettings'

function TokenFeedMigratedTokenPanel() {
  const { enabledColumns, columnFilters } = useTokenFeed()

  if (!enabledColumns.migrated) return null
  const currentFilters = columnFilters.migrated
  return (
    <TokenFeedContainer className={cn(enabledColumns.new || enabledColumns.new ? 'ml-auto' : 'mr-auto')}>
      <TokenFeedContainerHeaderWithTitle
        title={'Migrated'}
        tooltip={''}
        settings={<TokenFeedSettings column={'migrated'} />}
      />
      <TokenFeedTokensContainer
        currentFilters={currentFilters}
        tokens={[
          {
            age: '14m',
            name: 'GooseFX',
            address: 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD',
            holders: 1000,
            tickerSymbol: 'GFX',
            topHolders: '0.1%',
            migrated: true,
            bondingCurveProgress: 100
          },
          {
            age: '14m',
            name: 'GooseFX',
            address: 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD',
            holders: 1000,
            tickerSymbol: 'GFX',
            topHolders: '0.1%',
            migrated: true,
            bondingCurveProgress: 100
          },
          {
            age: '14m',
            name: 'GooseFX',
            address: 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD',
            holders: 1000,
            tickerSymbol: 'GFX',
            topHolders: '0.1%',
            migrated: true,
            bondingCurveProgress: 100
          },
          {
            age: '14m',
            name: 'GooseFX',
            address: 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD',
            holders: 1000,
            tickerSymbol: 'GFX',
            topHolders: '0.1%',
            migrated: true,
            bondingCurveProgress: 100
          },
          {
            age: '14m',
            name: 'GooseFX',
            address: 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD',
            holders: 1000,
            tickerSymbol: 'GFX',
            topHolders: '0.1%',
            migrated: true,
            bondingCurveProgress: 100
          },
          {
            age: '14m',
            name: 'GooseFX',
            address: 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD',
            holders: 1000,
            tickerSymbol: 'GFX',
            topHolders: '0.1%',
            migrated: true,
            bondingCurveProgress: 100
          }
        ]}
      />
    </TokenFeedContainer>
  )
}

export default TokenFeedMigratedTokenPanel
