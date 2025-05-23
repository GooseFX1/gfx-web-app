import React from 'react'
import TokenFeedContainer, {
  TokenFeedContainerHeaderWithTitle,
  TokenFeedTokensContainer
} from '@/pages/TokenFeed/TokenFeedContainer'

function TokenFeed() {
  return (
    <div
      className={`mt-8 grid items-center justify-center max-w-vw px-4 auto-cols-auto gap-4
      content-center
      `}
    >
      <TokenFeedContainer>
        <TokenFeedContainerHeaderWithTitle
          title={'New Pairs'}
          tooltip={''}
          settings={null}
        />
        <TokenFeedTokensContainer
          tokens={[
            {
              age: '14m',
              name: 'GooseFX',
              address: '0x1234567890abcdef1234567890abcdef12345678',
              holders: 1000,
              tickerSymbol: 'GFX',
              topHolders: '0.1%'
            }
          ]}
        />
      </TokenFeedContainer>
      <TokenFeedContainer>
        <TokenFeedContainerHeaderWithTitle
          title={'Migrated'}
          tooltip={''}
          settings={null}
        />
        <TokenFeedTokensContainer
          tokens={[
            {
              age: '14m',
              name: 'GooseFX',
              address: '0x1234567890abcdef1234567890abcdef12345678',
              holders: 1000,
              tickerSymbol: 'GFX',
              topHolders: '0.1%'
            }
          ]}
        />
      </TokenFeedContainer>
    </div>
  )
}

export default TokenFeed
