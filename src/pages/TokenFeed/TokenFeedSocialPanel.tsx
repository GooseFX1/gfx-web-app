import React, { useMemo } from 'react'
import TokenFeedContainer, {
  TokenFeedContainerHeader,
  TokenFeedContentContainer
} from '@/pages/TokenFeed/TokenFeedContainer'
import { cn, RadioGroup, RadioGroupItem } from 'gfx-component-lib'
import Lottie from 'lottie-react'
import { Connect } from '@/layouts'
import { useTokenFeed } from '@/context/tokenFeedContext'
import PerformanceLite from '@/animations/performance_lite.json'
import PerformanceDark from '@/animations/performance_dark.json'
import LockedDark from '@/animations/profile_locked_dark.json'
import LockedLite from '@/animations/profile_locked_lite.json'
import { useDarkMode } from '@/context'
import { useWallet } from '@solana/wallet-adapter-react'
import { H2, H3, P } from '@/components/text/TextComponents'

function TokenFeedSocialPanel() {
  const {enabledColumns} = useTokenFeed()

  const { mode } = useDarkMode()
  const { connected } = useWallet()

  const performanceAnimation = useMemo(() => {
    if (connected) {
      return mode === 'dark' ? PerformanceDark : PerformanceLite
    }
    return mode === 'dark' ? LockedDark : LockedLite
  }, [mode, connected])

  if (!enabledColumns.social) return null
  return (
    <TokenFeedContainer className={'md:mr-auto'}>
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
          <H3 className={`text-text-lightmode-tertiary dark:text-text-darkmode-tertiary`}>0.00% AVG APR</H3>
          <P className={`text-text-lightmode-tertiary dark:text-text-darkmode-tertiary font-semibold`}>
            0 Tokens
          </P>
        </div>
      </TokenFeedContainerHeader>
      <TokenFeedContentContainer className={'items-center justify-center w-full h-full'}>
        <div className={`flex flex-col items-center justify-between w-full gap-4`}>
          <Lottie
            loop={true}
            animationData={performanceAnimation} className={cn(`h-[80px]`, connected && `h-[77px]`)} />
          <div className={`flex flex-col gap-2 items-center text-center w-[300px]`}>
            <H2 >My Performance</H2>
            <P
              className={`text-b2`}
            >
              {connected
                ? `Start trading tokens to view your performance, track tokens, apr and more.`
                : `Connect your wallet to view your performance, track tokens, apr and more.`}
            </P>
          </div>
          {!connected && <Connect />}
        </div>
      </TokenFeedContentContainer>
    </TokenFeedContainer>
  )
}

export default TokenFeedSocialPanel