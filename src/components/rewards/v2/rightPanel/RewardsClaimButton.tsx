import React, { useCallback } from 'react'
import Button from '../../../twComponents/Button'
import tw from 'twin.macro'
import useRewards from '../../../../context/rewardsContext'
import useTimer from '../../../../hooks/useTimer'
import { numberFormatter } from '../../../../utils'
import { Loader } from '../../../Loader'
import useBoolean from '../../../../hooks/useBoolean'

function RewardsClaimButton(): JSX.Element {
  const { claimable, claimFees } = useRewards()
  const [isClaiming, setIsClaiming] = useBoolean(false)
  const { isDone, time } = useTimer({
    targetTime: {
      hour: 9,
      minute: 30,
      second: 0
    },
    format: '[Claim In:] hh[H] mm[Min] ss[s]'
  })
  const handleClaim = useCallback(async () => {
    setIsClaiming.on()
    await claimFees().finally(setIsClaiming.off)
  }, [claimFees])
  return (
    <Button
      disabled={claimable <= 0.0 || !isDone}
      onClick={handleClaim}
      cssClasses={[
        tw`py-2.5 text-blue-1 bg-white opacity-50 font-bold max-w-[300px] w-full text-center h-10`,
        claimable > 0 && tw`opacity-100`
      ]}
    >
      {isClaiming ? (
        <Loader zIndex={2} />
      ) : !isDone ? (
        time
      ) : claimable >= 0 ? (
        `Claim ${numberFormatter(claimable)} USDC`
      ) : (
        'No USDC Claimable'
      )}
    </Button>
  )
}

export default RewardsClaimButton
