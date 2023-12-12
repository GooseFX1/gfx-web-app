/* eslint-disable @typescript-eslint/no-unused-vars */
import { useWallet } from '@solana/wallet-adapter-react'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import 'styled-components/macro'
import { getUserRafflePrizes } from '../../../api/rewards'
import RaffleForWalletNotConnected from './RaffleForWalletConnected'
import NoPrizesSoFar from './RaffleNoPrizesSoFar'
import MyRecentPrizes from './RaffleRecentWinnings'
import TopLinks from '../v2/TopLinks'
import HowItWorksButton from '../v2/HowItWorksButton'
import CombinedRewardsTopLinks from '../v2/CombinedRewardsTopLinks'
import RewardsLeftLayout from '../layout/RewardsLeftLayout'
import RewardsRightLayout from '../layout/RewardsRightLayout'
import RaffleRightPanel from './RightSidePanel/RaffleRightSidePanel'
import tw from 'twin.macro'
import useBreakPoint from '../../../hooks/useBreakPoint'
import { useRaffleContext } from '../../../context/raffle_context'

function Raffle(): JSX.Element {
  const { wallet } = useWallet()
  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const { isMobile, isTablet } = useBreakPoint()
  const { userRecentPrizes } = useRaffleContext()
  const noPrizesSoFar = useMemo(() => userRecentPrizes?.length === 0, [publicKey, userRecentPrizes])

  return (
    <>
      <RewardsLeftLayout className={'no-scrollbar '}>
        <CombinedRewardsTopLinks>
          <TopLinks />
          <div css={[tw`flex gap-4 items-center`]}>
            <p css={[tw`hidden min-md:block`]}>Points:&nbsp;0</p>
            <HowItWorksButton
              link={'linkToWinDocs'}
              cssClasses={[(isMobile || isTablet) && tw`rounded-full w-[35px] h-[35px] text-lg font-bold`]}
            >
              {isMobile || isTablet ? '?' : 'How it works'}
            </HowItWorksButton>
          </div>
        </CombinedRewardsTopLinks>

        {!publicKey ? (
          <RaffleForWalletNotConnected />
        ) : noPrizesSoFar ? (
          <NoPrizesSoFar />
        ) : (
          <MyRecentPrizes myRecentPrizes={userRecentPrizes} />
        )}
      </RewardsLeftLayout>
      <RewardsRightLayout cssStyles={[tw`bg-gradient-to-r to-blue-gradient-1 from-primary-gradient-2 `]}>
        <RaffleRightPanel />
      </RewardsRightLayout>
    </>
  )
}

export default Raffle
