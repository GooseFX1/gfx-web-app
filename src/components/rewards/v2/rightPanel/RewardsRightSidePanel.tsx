import useRewards from '../../../../context/rewardsContext'
import { numberFormatter } from '../../../../utils'
import RewardsClaimButton from './RewardsClaimButton'
import React, { FC } from 'react'
import RewardsRightLayout from '../../layout/RewardsRightLayout'
import { cn } from 'gfx-component-lib'
const RewardInfoRow: FC<{
  label: string
  children?: React.ReactNode | React.ReactNode[]
}> = ({label, children})=>
  <div className={`flex flex-row w-full justify-between items-center text-b2
  text-text-darkmode-primary font-semibold`}>
  <p className={`underline decoration-dashed underline-offset-[4px] decoration-[1px] text-b2 
  text-text-darkmode-primary font-semibold`}>
    {label}
  </p>
    <p className={`text-b2 text-text-darkmode-primary font-semibold text-right`}>
      {children}
    </p>
</div>
export default function RewardsRightSidePanel({ apy }: { apy: number }): JSX.Element {
  const { totalEarned, totalStaked, gofxValue } = useRewards()
  // const { mode } = useDarkMode()

  const totalEarnedString = numberFormatter(totalEarned, 2)
  // const stakeRatio = numberFormatter(userStakeRatio, 2)

  return (
    <RewardsRightLayout className={`bg-gradient-to-br from-green-gradient-3 to-green-gradient-4 gap-4 md:gap-6 
    md:p-6 p-2`}>
      <h2 className={`text-h2 font-semibold !mb-0 text-white mx-auto hidden md:block`}>
        Earnings
      </h2>

      <div className={`flex flex-col gap-2 items-center fonte-semibold mt-[9px] md:mt-0`}>
        <h1
          className={cn(
            `mb-0 text-[40px] md:text-[48px] text-white opacity-60 leading-[1] font-sans`,
            totalEarned > 0 && `opacity-100`
          )}
        >
          {totalEarnedString == '0.00' ? (totalEarned > 0 ? '< 0.00' : '0.00') : totalEarnedString}
        </h1>
        <p className={cn(`mb-0 text-h4 text-white font-semibold font-poppins leading-[1]`)}>
          Total USDC Earnings
        </p>
      </div>
      <div className={'flex flex-col gap-2 w-full'}>
        <RewardInfoRow label={'Total Staked'}>
          {numberFormatter(totalStaked)} GOFX ≈ ${numberFormatter(gofxValue * totalStaked)}
        </RewardInfoRow>
        <RewardInfoRow label={'Earning Rate'}>
          {apy}% APY
        </RewardInfoRow>
        <RewardInfoRow label={'Cooldown Period'}>
          7 Days
        </RewardInfoRow>
        <RewardInfoRow label={'Earning Period'}>
          24H
        </RewardInfoRow>
      </div>
      <RewardsClaimButton />
    </RewardsRightLayout>
  )
}
