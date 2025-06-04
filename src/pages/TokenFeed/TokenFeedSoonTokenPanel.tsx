import React from 'react'
import TokenFeedContainer, {
  TokenFeedContainerHeaderWithTitle,
  TokenFeedTokensContainer
} from '@/pages/TokenFeed/TokenFeedContainer'
import { useTokenFeed } from '@/context/tokenFeedContext'
import { cn } from 'gfx-component-lib'
import TokenFeedSettings from '@/pages/TokenFeed/TokenFeedSettings'

function TokenFeedSoonTokenPanel() {
  const { enabledColumns } = useTokenFeed()

  if (!enabledColumns.soon) return null
  return (
    <TokenFeedContainer className={cn(
      (enabledColumns.social || enabledColumns.new || enabledColumns.migrated) ? 'ml-auto' : 'mr-auto'
    )}>
      <TokenFeedContainerHeaderWithTitle title={'Soon'} tooltip={''} settings={<TokenFeedSettings />} />
      <TokenFeedTokensContainer
        tokens={[
          {
            age: '14m',
            name: 'GooseFX',
            address: 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD',
            holders: 1000,
            tickerSymbol: 'GFX',
            topHolders: '0.1%',
            migrated: true
          },
          {
            age: '14m',
            name: 'GooseFX',
            address: 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD',
            holders: 1000,
            tickerSymbol: 'GFX',
            topHolders: '0.1%',
            migrated: true
          },
          {
            age: '14m',
            name: 'GooseFX',
            address: 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD',
            holders: 1000,
            tickerSymbol: 'GFX',
            topHolders: '0.1%',
            migrated: true
          },
          {
            age: '14m',
            name: 'GooseFX',
            address: 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD',
            holders: 1000,
            tickerSymbol: 'GFX',
            topHolders: '0.1%',
            migrated: true
          },
          {
            age: '14m',
            name: 'GooseFX',
            address: 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD',
            holders: 1000,
            tickerSymbol: 'GFX',
            topHolders: '0.1%',
            migrated: true
          },
          {
            age: '14m',
            name: 'GooseFX',
            address: 'GFX1ZjR2P15tmrSwow6FjyDYcEkoFb4p4gJCpLBjaxHD',
            holders: 1000,
            tickerSymbol: 'GFX',
            topHolders: '0.1%',
            migrated: true
          }
        ]}
      />
    </TokenFeedContainer>
  )
}

export default TokenFeedSoonTokenPanel
