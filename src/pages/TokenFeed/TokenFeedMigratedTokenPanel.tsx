import React from 'react'
import TokenFeedContainer, {
  TokenFeedContainerHeaderWithTitle,
  TokenFeedTokensContainer
} from '@/pages/TokenFeed/TokenFeedContainer'

function TokenFeedMigratedTokenPanel() {
  return (
    <TokenFeedContainer>
      <TokenFeedContainerHeaderWithTitle title={'Migrated'} tooltip={''} settings={null} />
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