import React from 'react'
import TokenFeedContainer, {
  TokenFeedContainerHeaderWithTitle,
  TokenFeedTokensContainer
} from '@/pages/TokenFeed/TokenFeedContainer'
import { Button, Icon } from 'gfx-component-lib'
import { useDarkMode } from '@/context'
import { Circle } from '@/components/common/Circle'

function TokenFeed() {
  const {mode} = useDarkMode()
  return (
    <div
      className={`mt-2 flex flex-col  gap-4 px-7.5 max-w-[1380px]
      `}
    >
      <div className={'inline-flex w-full justify-between'}>
        <h1>Trade</h1>
        <Button
         variant={'outline'}
         colorScheme={'grey'}
         className={'px-[10px] py-[5px] max-w-[35px] relative dark:border-border-white'}
        >
          <Circle
            className={`absolute top-0 -left-1 bg-background-red border-1 border-solid border-[#F7F0FD]
             dark:border-[#131313]`}
          />
          <Icon src={`/img/assets/grid_${mode}.svg`} size={'sm'}
                className={`!w-[20px] !max-w-[20px] !min-w-[20px] !h-[20px] !max-h-[20px] !min-h-[20px]`}/>
        </Button>
      </div>
      <div className={`grid items-center justify-center px-4 auto-cols-auto gap-4
       `}>
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
    </div>
  )
}

export default TokenFeed
