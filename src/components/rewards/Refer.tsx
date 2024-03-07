import React, { FC, useCallback, useEffect, useState } from 'react'
import BuddyLinkReferral from './BuddyLinkReferral'
import useReferrals from '../../hooks/useReferrals'
import { useWallet } from '@solana/wallet-adapter-react'
import { Treasury } from '@ladderlabs/buddy-sdk'
import { useConnectionConfig, useDarkMode } from '../../context'
import { Transaction } from '@solana/web3.js'
import { notify } from '../../utils'
import RewardsRightLayout from './layout/RewardsRightLayout'
import RewardsLeftLayout from './layout/RewardsLeftLayout'
import CombinedRewardsTopLinks from './v2/CombinedRewardsTopLinks'
import HowItWorksButton from './v2/HowItWorksButton'
import TopLinks from './v2/TopLinks'
import { Button, cn, Icon } from 'gfx-component-lib'
import { useTraderConfig } from '@/context/trader_risk_group'

const Refer: FC = () => (
  <>
    <RewardsLeftLayout>
      <CombinedRewardsTopLinks>
        <TopLinks />
        <HowItWorksButton link={'https://docs.goosefx.io/earn/referral-program'} />
      </CombinedRewardsTopLinks>
      <ReferAndEarn />
    </RewardsLeftLayout>
    <RewardsRightLayout className={`bg-gradient-to-br to-secondary-gradient-3 from-secondary-gradient-1`}>
      <ReferRightPanel />
    </RewardsRightLayout>
  </>
)

export default Refer
export const ReferAndEarn: FC = () => {
  const { mode } = useDarkMode()
  const { connected } = useWallet()
  const { traderInfo } = useTraderConfig()
  return (
    <div className={`flex flex-col font-semibold h-full leading-normal max-w-[580px] `}>
      <div className={`flex items-center min-md:gap-5`}>
        <img src={`/img/assets/referral_${mode}.svg`} className={`w-[64px] h-[69px] hidden min-md:block`} />
        <h3 className={`dark:text-white text-black-4 min-md:text-h2`}>
          Refer friends and earn 20% of their taker fees!
        </h3>
      </div>
      <div className={'flex flex-col mt-2 min-md:mt-7.5 gap-3.75'}>
        <BuddyLinkReferral />
        <div>
          <p
            className={`mb-0 text-grey-3 dark:text-grey-2 
        font-display min-md:font-sans text-b2
      `}
          >
            In order to generate you referral link, first go to
          </p>
          <a
            href={'https://app.goosefx.io/trade'}
            target={'_blank'}
            rel={'noreferrer'}
            className={`font-semibold underline text-blue-1 dark:text-white mx-1`}
          >
            app.goosefx.io/trade
          </a>
          <p
            className={`mb-0 text-grey-3 dark:text-grey-2 text-h4
        font-display min-md:font-sans  text-b2
      `}
          >
            and complete the next steps:
          </p>
          <div className={`flex flex-col gap-1.5 mt-1.5`}>
            <div className={cn('flex flex-row text-b2 gap-2', connected ? 'text-text-green' : 'text-text-red')}>
              <Icon size={'sm'} src={connected ? '/img/assets/check-green.svg' : '/img/assets/tooltip-red.svg'} />
              1. Connect your wallet
            </div>
            <div className={cn('flex flex-row text-b2 gap-2', connected ? 'text-text-green' : 'text-text-red')}>
              <Icon
                size={'sm'}
                src={
                  traderInfo.traderRiskGroup != null
                    ? '/img/assets/check-green.svg'
                    : '/img/assets/tooltip-red.svg'
                }
              />
              2. Deposit funds to create a trader account
            </div>
          </div>
        </div>
        <p
          className={`mb-0 text-grey-3 dark:text-grey-2 text-h4
        font-display min-md:font-sans  text-b2
      `}
        >
          Afterwards you will be able to generate your referral link to start sharing!
        </p>
      </div>
    </div>
  )
}

export const ReferRightPanel: FC = () => {
  const [totalFriends, setTotalFriends] = useState(0)
  const { claim, getTreasury, isReady, getReferred } = useReferrals()
  const { sendTransaction } = useWallet()
  const [treasury, setTreasury] = useState<Treasury | null>(null)
  const [totalEarned, setTotalEarned] = useState(0.0)
  const { connection } = useConnectionConfig()

  const handleClaim = useCallback(async () => {
    if (treasury && isReady && totalEarned) {
      try {
        const transaction = new Transaction()
        transaction.add(...(await claim()))

        await sendTransaction(transaction, connection)
        setTreasury(await treasury.refresh())
        notify({
          description: 'Congratulations!',
          message: `You, successfully claim your reward, amount ${totalEarned} USDC. Here’s to many more victories on
          your journey with us!`,
          type: 'success',
          icon: '/img/assets/notify-success.svg'
        })
      } catch (e) {
        //TODO: handle error state
        notify({
          description: "We didn't catch that!",
          message: (
            <div>
              Please bear with us and try again, or if the error continues
              <a
                className={`mx-1 underline`}
                href={'https://docs.goosefx.io/'}
                target={'_blank'}
                rel={'noreferrer'}
              >
                go to docs
              </a>
            </div>
          ),
          icon: '/img/assets/notify-fail.svg'
        })
      }

      // TODO: handle ui success state
    }
  }, [treasury, isReady, totalEarned, connection])

  useEffect(() => {
    const USDC_DECIMALS = 6 //TODO: change once we allow more spl rewards
    if (isReady)
      getTreasury().then(async (newTreasury) => {
        if (newTreasury) {
          setTreasury(newTreasury)
          setTotalEarned((await newTreasury.getClaimableBalance()) / Math.pow(10, USDC_DECIMALS))
          const referredMembers = await getReferred() // Use this list to show members
          setTotalFriends(referredMembers.length)
        } else {
          setTreasury(null)
          setTotalEarned(0)
          setTotalFriends(0)
        }
      })
  }, [isReady])

  return (
    <div className={`flex flex-col h-full w-full items-center gap-2.5 min-md:gap-3.75 `}>
      <div className={`flex flex-col gap-2.5 min-md:gap-0`}>
        <h2 className={`mb-0 min-md:text-h2 text-h3 font-semibold leading-normal`}>
          Total Referred: {totalFriends} Friends
        </h2>
        <ReferFriendSegment />
      </div>

      <div
        className={cn(
          `flex flex-col justify-center h-[99px] min-md:h-[130px] min-md:gap-1 items-center min-md:justify-end`,
          totalEarned <= 0.0 ? `opacity-60` : `opacity-100`
        )}
      >
        <p className={`text-[45px] min-md:text-[60px] mb-0 font-semibold leading-10 font-sans`}>
          {totalEarned.toFixed(2)}
        </p>
        <p className={`text-regular min-md: text-lg font-semibold `}>Total USDC Earned</p>
      </div>
      <Button
        variant={'outline'}
        className={'w-full max-w-[300px]'}
        onClick={handleClaim}
        disabled={totalEarned <= 0.0}
      >
        {totalEarned > 0.0 ? `Claim  ${totalEarned.toFixed(2)} USDC` : 'No USDC Claimable'}
      </Button>
    </div>
  )
}
export const ReferFriendSegment = (): JSX.Element => {
  const [totalFriends, setTotalFriends] = useState(0)
  const { getTreasury, isReady, getReferred } = useReferrals()

  useEffect(() => {
    if (isReady)
      getTreasury().then(async (newTreasury) => {
        if (newTreasury) {
          const referredMembers = await getReferred() // Use this list to show members
          setTotalFriends(referredMembers.length)
        } else {
          setTotalFriends(0)
        }
      })
  }, [isReady])

  return (
    <div className={`flex flex-col items-center justify-center w-full`}>
      <a
        href={''}
        target={'_blank'}
        rel="noreferrer"
        className={cn(
          ` min-md:mb-0 text-b2 underline font-semibold text-white
          min-md:mt-0 cursor-not-allowed`,
          totalFriends > 0
            ? `text-white dark:text-white hover:text-white cursor-pointer opacity-100`
            : `opacity-50`
        )}
      >
        {totalFriends > 0 ? 'See All Referrals' : 'No Referrals'}
      </a>
    </div>
  )
}
