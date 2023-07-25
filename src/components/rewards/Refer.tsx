import React, { FC, useCallback, useEffect, useState } from 'react'
import tw from 'twin.macro'
import 'styled-components/macro'
import BuddyLinkReferral from './BuddyLinkReferral'
import useBreakPoint from '../../hooks/useBreakPoint'
import useReferrals from '../../hooks/useReferrals'
import { useWallet } from '@solana/wallet-adapter-react'
import { Treasury } from '@ladderlabs/buddy-sdk'
import { useConnectionConfig } from '../../context'
import { Transaction } from '@solana/web3.js'
import { notify } from '../../utils'

const ReferAndEarn: FC = () => (
  <div css={tw`flex flex-col gap-4 font-semibold mb-[25px] h-full leading-normal`}>
    <BuddyLinkReferral />
    <p css={tw`mb-0 text-tiny min-md:text-regular text-grey-3 dark:text-grey-2 font-semibold text-justify `}>
      To generate a referral link, first connect your wallet and create a trader account at
      <a
        href={'https://app.goosefx.io/trade'}
        target={'_blank'}
        rel={'noreferrer'}
        css={[tw` underline text-blue-1 dark:text-white mx-1`]}
      >
        app.goosefx.io/trade
      </a>
      by depositing funds. Afterwards you will be able to generate a referral URL to share.
    </p>
    <div css={[tw`flex flex-col min-md:flex-row min-md:gap-1 min-md:mt-auto`]}>
      <p
        css={[
          tw`mb-0 mt-auto text-tiny min-md:text-regular text-grey-3 dark:text-grey-2 font-semibold
    min-md:text-center min-w-max `
        ]}
      >
        Still have questions?
      </p>
      <p
        css={[
          tw`mb-0 mt-auto text-tiny min-md:text-regular text-grey-3 dark:text-grey-2 font-semibold
    min-md:text-center min-w-max`
        ]}
      >
        Go to our
        <a
          css={[tw`underline text-blue-1 dark:text-white ml-1`]}
          href={'https://docs.goosefx.io/features/rewards-programs/referral-program'}
          target={'_blank'}
          rel={'noreferrer'}
        >
          Referral Program Documentation
        </a>
      </p>
    </div>
  </div>
)
export default ReferAndEarn

export const ReferRightPanel: FC = () => {
  const breakpoints = useBreakPoint()
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
        } else {
          setTreasury(null)
          setTotalEarned(0)
        }
      })
  }, [isReady])

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
    <div css={tw`flex flex-col h-full pt-3.75 pb-2.5 min-md:pb-0 min-md:pt-[26px] w-full items-center `}>
      <p css={tw`mb-0 text-lg font-semibold font-semibold leading-normal`}>
        Total Referred: {totalFriends} Friends
      </p>
      {!(breakpoints.isMobile || breakpoints.isTablet) && <ReferFriendSegment />}
      <div
        css={[
          tw`flex flex-col justify-center items-center mt-3.75 min-md:mt-[96px] gap-3.75 min-md:gap-4`,
          totalEarned <= 0.0 ? tw`min-md:opacity-60` : tw`opacity-100`
        ]}
      >
        <p css={tw`text-2xl min-md:text-4xl mb-0 font-semibold leading-10`}>{totalEarned.toFixed(2)}</p>
        <p css={tw`text-regular min-md:text-lg mb-0 font-semibold`}>
          {breakpoints.isMobile || breakpoints.isTablet ? 'Total USDC Earned' : 'USDC Total Earned'}
        </p>
      </div>
      <button
        css={[
          tw`h-10 opacity-50 w-[320px] rounded-[100px] bg-white py-3 px-8 text-black-4 font-semibold border-0
        min-md:mb-0 mt-3.75 min-md:mt-5 whitespace-nowrap overflow-hidden flex items-center justify-center
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
    <div css={tw`flex flex-col items-center justify-center w-full`}>
      <a
        href={''}
        target={'_blank'}
        rel="noreferrer"
        css={[
          tw` min-md:mb-0 text-lg underline font-semibold
          text-grey-1 dark:text-grey-2
          min-md:text-grey-5 min-md:dark:text-grey-5
          min-md:mt-0 cursor-not-allowed`,
          totalFriends > 0
            ? tw`text-white dark:text-white hover:text-white cursor-pointer min-md:opacity-100`
            : tw`min-md:opacity-60`
        ]}
      >
        {totalFriends > 0 ? 'See All Referrals' : 'No Referrals'}
      </a>
    </div>
  )
}
