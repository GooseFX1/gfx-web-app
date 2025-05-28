import React from 'react'
import TokenFeedContainer, {
  TokenFeedContainerHeader,
  TokenFeedContainerHeaderWithTitle,
  TokenFeedContentContainer,
  TokenFeedTokensContainer
} from '@/pages/TokenFeed/TokenFeedContainer'
import { Button, Icon, RadioGroup, RadioGroupItem } from 'gfx-component-lib'
import { useDarkMode } from '@/context'
import { Circle } from '@/components/common/Circle'
import { useWallet } from '@solana/wallet-adapter-react'
import { Connect } from '@/layouts'

function TokenFeed() {
  const { mode } = useDarkMode()
  const { connected } = useWallet()
  return (
    <div
      className={`mt-2 flex flex-col  gap-4 px-7.5  w-full items-center h-full
      `}
    >
      <div className={'inline-flex w-full justify-between'}>
        <h1 className={`text-text-lightmode-primary dark:text-text-darkmode-primary`}>Trade</h1>
        <Button
          variant={'outline'}
          colorScheme={'grey'}
          className={'px-[10px] py-[5px] max-w-[35px] relative dark:border-border-white ml-auto'}
        >
          <Circle
            className={`absolute top-0 -left-1 bg-background-red border-1 border-solid border-[#F7F0FD]
             dark:border-[#131313]`}
          />
          <Icon
            src={`/img/assets/grid_${mode}.svg`}
            size={'sm'}
            className={`!w-[20px] !max-w-[20px] !min-w-[20px] !h-[20px] !max-h-[20px] !min-h-[20px]`}
          />
        </Button>
      </div>
      <div
        className={`grid items-center justify-center gap-4 grid-cols-[repeat(1,_minmax(450px,_1fr))] 
      md:grid-cols-[repeat(2,_minmax(450px,_1fr))] xl:grid-cols-[repeat(3,_minmax(450px,_1fr))] 
      max-w-[1380px]
       `}
      >
        <TokenFeedContainer className={`hidden md:flex`}>
          <TokenFeedContainerHeader>
            <RadioGroup defaultValue={'social'} className={'flex-shrink gap-1.25 w-max'}>
              <RadioGroupItem value={'social'} variant={'primary'} size={'md'}>
                Social Feed
              </RadioGroupItem>
              <RadioGroupItem
                value={'myperf'}
                variant={'primary'}
                size={'md'}
                className={'flex flex-row gap-1 items-center justify-center'}
              >
                My Performance
              </RadioGroupItem>
            </RadioGroup>
            <div className={`inline-flex items-center justify-between w-full`}>
              <h3 className={`text-text-lightmode-tertiary dark:text-text-darkmode-tertiary`}>0.00% AVG APR</h3>
              <p className={`text-text-lightmode-tertiary dark:text-text-darkmode-tertiary font-semibold`}>
                0 Tokens
              </p>
            </div>
          </TokenFeedContainerHeader>
          <TokenFeedContentContainer className={'items-center justify-center w-full h-full'}>
            <div className={`flex flex-col items-center justify-between w-full gap-4`}>
              <img
                src={`/img/assets/performance_${mode}${connected ? '_connected' : ''}.svg`}
                className={'w-[80px]'}
              />
              <div className={`flex flex-col gap-2 items-center text-center w-[300px]`}>
                <h2 className={`text-text-lightmode-primary dark:text-text-darkmode-primary`}>My Performance</h2>
                <p
                  className={`font-semibold text-b2 text-text-lightmode-secondary dark:text-text-darkmode-secondary`}
                >
                  {connected
                    ? `Start trading tokens to view your performance, track tokens, apr and more.`
                    : `Connect your wallet to view your performance, track tokens, apr and more.`}
                </p>
              </div>
              {!connected && <Connect />}
            </div>
          </TokenFeedContentContainer>
        </TokenFeedContainer>
        <TokenFeedContainer>
          <TokenFeedContainerHeaderWithTitle title={'New Pairs'} tooltip={''} settings={null} />
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
      </div>
    </div>
  )
}

export default TokenFeed
