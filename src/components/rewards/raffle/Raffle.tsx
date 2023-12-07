import { useWallet } from '@solana/wallet-adapter-react'
import React, { useEffect, useMemo, useState } from 'react'
import 'styled-components/macro'
import { getMyRecentWinnings } from '../../../api/rewards'
import RaffleForWalletNotConnected from './RaffleForWalletConnected'
import NoPrizesSoFar from './RaffleNoPrizesSoFar'
import MyRecentWinnings from './RaffleRecentWinnings'
import TopLinks from '../v2/TopLinks'
import HowItWorksButton from '../v2/HowItWorksButton'
import CombinedRewardsTopLinks from '../v2/CombinedRewardsTopLinks'
import RewardsLeftLayout from '../layout/RewardsLeftLayout'
import RewardsRightLayout from '../layout/RewardsRightLayout'
import RaffleRightPanel from './RightSidePanel/RaffleRightSidePanel'
import tw from 'twin.macro'
import useBreakPoint from '../../../hooks/useBreakPoint'
// import styled from 'styled-components'
// import tw from "twin.macro";
//
// const Wrapper = styled.div`
//   .hideScrollbar {
//     scrollbar-width: none;
//     -ms-overflow-style: none;
//
//     ::-webkit-scrollbar {
//       display: none;
//     }
//   }
// `

function Raffle(): JSX.Element {
  const { wallet } = useWallet()
  const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
  const [myRecentWinnings, setMyRecentWinnings] = useState()
  const { isMobile, isTablet } = useBreakPoint()
  useEffect(() => {
    // make api call to get raffle info
    ;(async () => {
      const myRecentWinnings = await getMyRecentWinnings()
      setMyRecentWinnings(myRecentWinnings)
    })()
  }, [publicKey])

  const noPrizesSoFar = false

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

        {!publicKey && <RaffleForWalletNotConnected />}
        {noPrizesSoFar ? <NoPrizesSoFar /> : <MyRecentWinnings myRecentWinnings={myRecentWinnings} />}
      </RewardsLeftLayout>
      <RewardsRightLayout cssStyles={[tw`bg-gradient-to-r to-blue-gradient-1 from-primary-gradient-2 `]}>
        <RaffleRightPanel />
      </RewardsRightLayout>
    </>
  )
}

// const Raffle1 = (): ReactElement => {
//   const {wallet} = useWallet()
//   const publicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])
//   const [myRecentWinnings, setMyRecentWinnings] = useState()
//
//   useEffect(() => {
//     // make api call to get raffle info
//     ;(async () => {
//       const myRecentWinnings = await getMyRecentWinnings()
//       setMyRecentWinnings(myRecentWinnings)
//     })()
//   }, [publicKey])
//
//   const noPrizesSoFar = false
//   if (!publicKey) return <RaffleForWalletNotConnected/>
//
//   return (
//     <>
//       <TopLinks/>
//       <Wrapper tw="w-full h-full">
//         {noPrizesSoFar ? <NoPrizesSoFar/> : <MyRecentWinnings myRecentWinnings={myRecentWinnings}/>}
//       </Wrapper>
//     </>
//   )
// }

export default Raffle
