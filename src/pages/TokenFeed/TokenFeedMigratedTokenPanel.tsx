import React from 'react'
import TokenFeedContainer, {
  TokenFeedContainerHeaderWithTitle,
  TokenFeedTokensContainer
} from '@/pages/TokenFeed/TokenFeedContainer'
import { useTokenFeed } from '@/context/tokenFeedContext'
import { cn } from 'gfx-component-lib'
import TokenFeedSettings from '@/pages/TokenFeed/TokenFeedSettings'

function TokenFeedMigratedTokenPanel() {
  const { enabledColumns } = useTokenFeed()

  if (!enabledColumns.migrated) return null
  return (
    <TokenFeedContainer className={
      cn(
        (enabledColumns.new || enabledColumns.new) ? 'ml-auto' : 'mr-auto',
      )
    }>
      <TokenFeedContainerHeaderWithTitle title={'Migrated'} tooltip={''} settings={<TokenFeedSettings />} />
      <TokenFeedTokensContainer
        tokens={[
          {
            age: '14m',
            name: 'GooseFX',
            address: '0x1234567890abcdef1234567890abcdef12345678',
            holders: 1000,
            tickerSymbol: 'GFX',
            topHolders: '0.1%',
            migrated: true
          },
          {
            age: '14m',
            name: 'GooseFX',
            address: '0x1234567890abcdef1234567890abcdef12345678',
            holders: 1000,
            tickerSymbol: 'GFX',
            topHolders: '0.1%',
            migrated: true
          },
          {
            age: '14m',
            name: 'GooseFX',
            address: '0x1234567890abcdef1234567890abcdef12345678',
            holders: 1000,
            tickerSymbol: 'GFX',
            topHolders: '0.1%',
            migrated: true
          },
          {
            age: '14m',
            name: 'GooseFX',
            address: '0x1234567890abcdef1234567890abcdef12345678',
            holders: 1000,
            tickerSymbol: 'GFX',
            topHolders: '0.1%',
            migrated: true
          },
          {
            age: '14m',
            name: 'GooseFX',
            address: '0x1234567890abcdef1234567890abcdef12345678',
            holders: 1000,
            tickerSymbol: 'GFX',
            topHolders: '0.1%',
            migrated: true
          },
          {
            age: '14m',
            name: 'GooseFX',
            address: '0x1234567890abcdef1234567890abcdef12345678',
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

export default TokenFeedMigratedTokenPanel
