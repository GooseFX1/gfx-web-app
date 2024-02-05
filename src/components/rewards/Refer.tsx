import React, { FC, useCallback, useEffect, useState } from 'react'
import tw from 'twin.macro'
import 'styled-components/macro'
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

const Refer: FC = () => (
  <>
    <RewardsLeftLayout>
      <CombinedRewardsTopLinks>
        <TopLinks />
        <HowItWorksButton link={'https://docs.goosefx.io/earn/referral-program'} />
      </CombinedRewardsTopLinks>
      <ReferAndEarn />
    </RewardsLeftLayout>
    <RewardsRightLayout cssStyles={[tw`bg-gradient-to-br to-secondary-gradient-3 from-secondary-gradient-1 `]}>
      <ReferRightPanel />
    </RewardsRightLayout>
  </>
)

export default Refer
export const ReferAndEarn: FC = () => {
  const { mode } = useDarkMode()
  return (
    <div css={[tw`flex flex-col gap-4 font-semibold h-full leading-normal max-w-[580px]`]}>
      <div css={[tw`flex items-center gap-5`]}>
        <img src={`/img/assets/referral_${mode}.svg`} css={[tw`w-[89px] h-[97px] hidden min-md:block`]} />
        <h2 css={[tw`dark:text-white text-black-4`]}>Refer friends and earn 20% of their taker fees!</h2>
      </div>
      <BuddyLinkReferral />
      <h4
        css={[
          tw`mb-0 text-grey-3 dark:text-grey-2 text-justify text-h5 min-md:text-h4
        font-display min-md:font-sans
      `
        ]}
      >
        To generate a referral link, first connect your wallet and create a trader account at
        <a
          href={'https://app.goosefx.io/trade'}
          target={'_blank'}
          rel={'noreferrer'}
          css={[tw`font-semibold underline text-blue-1 dark:text-white mx-1`]}
        >
          app.goosefx.io/trade
        </a>
        by depositing funds. Afterwards you will be able to generate a referral URL to share.
      </h4>
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
              <a css={[tw`mx-1 underline`]} href={'https://docs.goosefx.io/'} target={'_blank'} rel={'noreferrer'}>
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
    <div css={[tw`flex flex-col h-full w-full items-center gap-2.5 min-md:gap-3.75 `]}>
      <div css={[tw`flex flex-col gap-2.5 min-md:gap-0`]}>
        <h2 css={[tw`mb-0 min-md:text-h2 text-h3 font-semibold font-semibold leading-normal`]}>
          Total Referred: {totalFriends} Friends
        </h2>
        <ReferFriendSegment />
      </div>
      <div
        css={[
          tw`flex flex-col justify-center items-center min-md:mt-[84px] gap-1 min-md:gap-4`,
          totalEarned <= 0.0 ? tw`min-md:opacity-60` : tw`opacity-100`
        ]}
      >
        <p css={[tw`text-[45px] min-md:text-4xl mb-0 font-semibold leading-10 font-sans`]}>
          {totalEarned.toFixed(2)}
        </p>
        <p css={[tw`text-regular min-md: text-lg mb-0 font-semibold`]}>Past USDC Earnings</p>
      </div>
      <button
        css={[
          tw`h-10 opacity-50 w-[320px] rounded-[100px] bg-white py-3 px-8 text-black-4 font-semibold border-0
        min-md:mb-0  whitespace-nowrap overflow-hidden flex items-center justify-center
        text-regular leading-normal font-semibold min-md:text-average
        `,
          totalEarned > 0.0 ? tw`opacity-100` : tw``
        ]}
        onClick={handleClaim}
        disabled={totalEarned <= 0.0}
      >
        {totalEarned > 0.0 ? `Claim  ${totalEarned.toFixed(2)} USDC` : 'No USDC Claimable'}
      </button>
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
    <div css={[tw`flex flex-col items-center justify-center w-full`]}>
      <a
        href={''}
        target={'_blank'}
        rel="noreferrer"
        css={[
          tw` min-md:mb-0 text-regular min-md:text-average underline font-semibold text-white
          min-md:mt-0 cursor-not-allowed`,
          totalFriends > 0
            ? tw`text-white dark:text-white hover:text-white cursor-pointer opacity-100`
            : tw`opacity-50`
        ]}
      >
        {totalFriends > 0 ? 'See All Referrals' : 'No Referrals'}
      </a>
    </div>
  )
}
