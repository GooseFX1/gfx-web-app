import { useWallet } from '@solana/wallet-adapter-react'
import React, { useEffect, useState } from 'react'
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

function Raffle(): JSX.Element {
  const { connected } = useWallet()
  const [myRecentWinnings, setMyRecentWinnings] = useState()
  const { isMobile, isTablet } = useBreakPoint()
  useEffect(() => {
    // make api call to get raffle info
    ;(async () => {
      const myRecentWinnings = await getMyRecentWinnings()
      setMyRecentWinnings(myRecentWinnings)
    })()
  }, [connected])

  const noPrizesSoFar = false

  return (
    <>
      <RewardsLeftLayout className={'no-scrollbar pb-0'}>
        <CombinedRewardsTopLinks>
          <TopLinks />
          <div css={[tw`flex gap-4 items-center`]}>
            {connected && <p css={[tw`hidden min-md:block`]}>Points:&nbsp;0</p>}
            <HowItWorksButton
              link={'https://docs.goosefx.io/earn/referral-program'}
              cssClasses={[(isMobile || isTablet) && tw`rounded-full w-[35px] h-[35px] text-lg font-bold`]}
            />
          </div>
        </CombinedRewardsTopLinks>

        <div css={[tw`flex flex-col max-h-[367px] min-md:max-h-[382px] w-full overflow-scroll`]}>
          {!connected && <RaffleForWalletNotConnected />}
          {noPrizesSoFar ? <NoPrizesSoFar /> : <MyRecentWinnings myRecentWinnings={myRecentWinnings} />}
        </div>
      </RewardsLeftLayout>
      <RewardsRightLayout className={`bg-gradient-to-r to-blue-gradient-1 from-primary-gradient-2 `}>
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
