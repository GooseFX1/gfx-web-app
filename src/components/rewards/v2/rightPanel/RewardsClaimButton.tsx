import React, { useCallback } from 'react'
import useRewards from '../../../../context/rewardsContext'
import useTimer from '../../../../hooks/useTimer'
import { numberFormatter } from '../../../../utils'
import { Loader } from '../../../Loader'
import useBoolean from '../../../../hooks/useBoolean'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button, cn } from 'gfx-component-lib'

function RewardsClaimButton(): JSX.Element {
  const { claimable, claimFees } = useRewards()
  const { connected } = useWallet()
  const [isClaiming, setIsClaiming] = useBoolean(false)
  const { isDone, time } = useTimer({
    targetTime: {
      hour: 10,
      minute: 0,
      second: 0
    },
    format: '[Claim In:] hh[H] mm[Min]'
  })
  const handleClaim = useCallback(async () => {
    setIsClaiming.on()
    await claimFees().finally(setIsClaiming.off)
  }, [claimFees])
  const buttonDisabled = !connected || claimable <= 0 || (!isDone && claimable <= 0)
  return (
    <Button
      disabled={buttonDisabled || isClaiming}
      onClick={handleClaim}
      variant={'outline'}
      className={cn(
        'text-white bg-button-darkmode-primary disabled:bg-button-darkmode-disabled-primary ',
        claimable > 0 && `opacity-100`
      )}
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
