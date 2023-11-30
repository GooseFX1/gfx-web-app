import React, { useCallback } from 'react'
import Button from '../../../twComponents/Button'
import tw from 'twin.macro'
import useRewards from '../../../../context/rewardsContext'
import useTimer from '../../../../hooks/useTimer'
import { numberFormatter } from '../../../../utils'
import { Loader } from '../../../Loader'
import useBoolean from '../../../../hooks/useBoolean'
import { useWallet } from '@solana/wallet-adapter-react'

function RewardsClaimButton(): JSX.Element {
  const { claimable, claimFees } = useRewards()
  const { connected } = useWallet()
  const [isClaiming, setIsClaiming] = useBoolean(false)
  const { isDone, time } = useTimer({
    targetTime: {
      hour: 9,
      minute: 30,
      second: 0
    },
    format: '[Claim In:] hh[H] mm[Min]'
  })
  const handleClaim = useCallback(async () => {
    setIsClaiming.on()
    await claimFees().finally(setIsClaiming.off)
  }, [claimFees])
  console.log(claimable, isDone, time)
  const buttonDisabled = !connected || claimable <= 0 || (!isDone && claimable <= 0)
  return (
    <Button
      disabled={buttonDisabled || isClaiming}
      onClick={handleClaim}
      cssClasses={[
        tw`py-2.5 text-blue-1 bg-white opacity-50 font-bold max-w-[300px] w-full text-center h-10`,
        claimable > 0 && tw`opacity-100`
      ]}
    >
      {isClaiming ? (
        <Loader zIndex={2} color={'blue-1'} />
      ) : claimable > 0 && connected ? (
        `Claim ${numberFormatter(claimable)} USDC`
      ) : !isDone && connected ? (
        time
      ) : (
        'No USDC Claimable'
      )}
    </Button>
  )
}

export default RewardsClaimButton
