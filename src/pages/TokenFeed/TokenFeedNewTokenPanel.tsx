import React from 'react'
import TokenFeedContainer, {
  TokenFeedContainerHeaderWithTitle,
  TokenFeedTokensContainer
} from '@/pages/TokenFeed/TokenFeedContainer'
import { useTokenFeed } from '@/context/tokenFeedContext'
import TokenFeedSettings from '@/pages/TokenFeed/TokenFeedSettings'
import { cn } from 'gfx-component-lib'

function TokenFeedNewTokenPanel() {
  const { enabledColumns } = useTokenFeed()
  if (!enabledColumns.new) return null
  return (
    <TokenFeedContainer className={cn(
      enabledColumns.social ? 'ml-auto' : 'mr-auto',
    )}>
      <TokenFeedContainerHeaderWithTitle title={'New Pairs'} tooltip={''} settings={<TokenFeedSettings />} />
      <TokenFeedTokensContainer
        tokens={[
          {
            age: '14m',
            name: 'GooseFX',
            address: '0x1234567890abcdef1234567890abcdef12345678',
            holders: 1000,
            tickerSymbol: 'GFX',
            topHolders: '0.1%',
            migrated: false
          },
          {
            age: '14m',
            name: 'GooseFX',
            address: '0x1234567890abcdef1234567890abcdef12345678',
            holders: 1000,
            tickerSymbol: 'GFX',
            topHolders: '0.1%',
            migrated: false
          },
          {
            age: '14m',
            name: 'GooseFX',
            address: '0x1234567890abcdef1234567890abcdef12345678',
            holders: 1000,
            tickerSymbol: 'GFX',
            topHolders: '0.1%',
            migrated: false
          }
        ]}
      />
    </TokenFeedContainer>
  )
}

export default TokenFeedNewTokenPanel