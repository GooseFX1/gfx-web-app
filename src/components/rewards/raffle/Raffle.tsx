import { useWallet } from '@/hooks/useWallet'
import React, { useEffect, useState } from 'react'
import 'styled-components/macro'
import { getMyRecentWinnings } from '../../../api/rewards'
import TopLinks from '../v2/TopLinks'
import HowItWorksButton from '../v2/HowItWorksButton'
import CombinedRewardsTopLinks from '../v2/CombinedRewardsTopLinks'
import RewardsLeftLayout from '../layout/RewardsLeftLayout'
import RewardsRightLayout from '../layout/RewardsRightLayout'
import tw from 'twin.macro'
import useBreakPoint from '../../../hooks/useBreakPoint'

// Create simple components for the missing imports
const RaffleForWalletNotConnected = () => (
  <div css={[tw`flex flex-col items-center justify-center p-4 text-center`]}>
    <p css={[tw`text-lg font-medium mb-2`]}>Connect your wallet</p>
    <p css={[tw`text-sm text-gray-400`]}>Connect your wallet to view raffle details</p>
  </div>
)

const NoPrizesSoFar = () => (
  <div css={[tw`flex flex-col items-center justify-center p-4 text-center`]}>
    <p css={[tw`text-lg font-medium mb-2`]}>No Prizes Yet</p>
    <p css={[tw`text-sm text-gray-400`]}>You haven't won any prizes yet. Keep participating!</p>
  </div>
)

const MyRecentWinnings = ({ myRecentWinnings }) => (
  <div css={[tw`flex flex-col p-4`]}>
    <h3 css={[tw`text-lg font-medium mb-4`]}>My Recent Winnings</h3>
    {myRecentWinnings ? (
      <div css={[tw`flex flex-col gap-2`]}>
        {/* Render winnings here */}
        <p css={[tw`text-sm`]}>No recent winnings to display</p>
      </div>
    ) : (
      <p css={[tw`text-sm text-gray-400`]}>Loading your winnings...</p>
    )}
  </div>
)

const RaffleRightPanel = () => (
  <div css={[tw`flex flex-col items-center justify-center p-4 text-center`]}>
    <h3 css={[tw`text-xl font-medium mb-4`]}>Raffle Information</h3>
    <p css={[tw`text-sm mb-4`]}>Participate in our raffle for a chance to win exciting prizes!</p>
    <div css={[tw`flex flex-col gap-2 w-full max-w-xs`]}>
      <div css={[tw`flex justify-between`]}>
        <span>Next Draw:</span>
        <span>Coming Soon</span>
      </div>
      <div css={[tw`flex justify-between`]}>
        <span>Prize Pool:</span>
        <span>TBA</span>
      </div>
    </div>
  </div>
)

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
