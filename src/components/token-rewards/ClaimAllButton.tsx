import { useMemo, useEffect } from 'react'
import { Button, cn } from 'gfx-component-lib'
import useBreakPoint from '@/hooks/useBreakPoint'
import { useBoostedRewards } from '@/context/boostedRewardsContext'
import { numberFormatter } from '@/utils'

type ClaimAllRewardsProps = {
  openClaimAllRewardsDialog: boolean
  setOpenClaimAllRewardsDialog: (open: boolean) => void
}

export function ClaimAllRewards({ setOpenClaimAllRewardsDialog }: ClaimAllRewardsProps) {
  const { isMobile } = useBreakPoint()
  const { claimableRewardsWithTokens } = useBoostedRewards()

  const canClaimAll = useMemo(
    () => claimableRewardsWithTokens.totalClaimableRewardsUsd.gt(0),
    [claimableRewardsWithTokens]
  )
  useEffect(() => {
    console.log('claimableRewardsWithTokens', claimableRewardsWithTokens.totalClaimableRewardsUsd.toNumber())
  }, [claimableRewardsWithTokens])

  // Early returns after all hooks have been called
  const shouldRender = claimableRewardsWithTokens.totalClaimableRewardsUsd.gt(0.1) &&
    claimableRewardsWithTokens.rewards.length > 0

  if (!shouldRender) return null

  const content = (className?: string) => (
    <div
      className={cn(
        'flex flex-row items-center gap-4 border-1',
        'border-border-lightmode-secondary dark:border-border-darkmode-secondary',
        'bg-white dark:bg-black-2 px-2 py-[3.5px] rounded-[4px]',
        className
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <h2
          className="text-[15px] font-semibold text-text-lightmode-secondary 
          dark:text-text-darkmode-secondary"
        >
          Rewards:
        </h2>
        <p
          className="text-[15px] font-semibold text-black-1
          dark:text-white font-poppins"
        >
          ${numberFormatter(+claimableRewardsWithTokens.totalClaimableRewardsUsd.toFixed(2))}
        </p>
      </div>
      <Button
        className="h-[28px] "
        size={'sm'}
        colorScheme={canClaimAll ? 'secondaryGradient' : ''}
        variant={'outline'}
        onClick={() => setOpenClaimAllRewardsDialog(true)}
        disabled={!canClaimAll}
      >
        Claim All
      </Button>
    </div>
  )

  if (isMobile) {
    return (
      <div className={'fixed bottom-[12px] left-0 right-0 mx-auto z-[1001] w-max'}>{content('py-[7.5px]')}</div>
    )
  }

  return content()
}
