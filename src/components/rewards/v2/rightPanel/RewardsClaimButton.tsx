import React from 'react'
import useRewards from '../../../../context/rewardsContext'
import useTimer from '../../../../hooks/useTimer'
import { numberFormatter } from '../../../../utils'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button, cn } from 'gfx-component-lib'

function RewardsClaimButton(): JSX.Element {
  const { claimable, claimFeesMutation } = useRewards()
  const { connected } = useWallet()
  const { isDone, time } = useTimer({
    targetTime: {
      hour: 10,
      minute: 0,
      second: 0
    },
    format: '[Claim In:] hh[H] mm[Min]'
  })

  const buttonDisabled = !connected || claimable <= 0 || (!isDone && claimable <= 0)
  return (
    <Button
      disabled={buttonDisabled || claimFeesMutation.isLoading}
      onClick={()=>claimFeesMutation.mutate()}
      variant={'outline'}
      className={cn(
        `text-white bg-button-darkmode-primary disabled:bg-button-darkmode-disabled-primary w-[220px]
        sticky bottom-2.5 lg:bottom-0 lg:relative`,
        claimable > 0 && `opacity-100`
      )}
      isLoading={claimFeesMutation.isLoading}
    >
      { claimable > 0 && connected ? (
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
