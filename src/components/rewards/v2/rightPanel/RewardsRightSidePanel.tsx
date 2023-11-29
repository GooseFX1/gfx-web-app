import useRewards from '../../../../context/rewardsContext'
import { useDarkMode } from '../../../../context'
import { numberFormatter } from '../../../../utils'
import tw from 'twin.macro'
import { Tooltip } from '../../../Tooltip'
import RewardsClaimButton from './RewardsClaimButton'
import React from 'react'

export default function RewardsRightSidePanel({ apy }: { apy: number }): JSX.Element {
  const { totalEarned, totalStaked, gofxValue, totalStakedGlobally, userStakeRatio } = useRewards()
  const { mode } = useDarkMode()

  const totalEarnedString = numberFormatter(totalEarned, 2)
  const stakeRatio = numberFormatter(userStakeRatio, 2)
  return (
    <div
      css={[
        tw`py-2.5 min-sm:pb-5 px-7.5 flex flex-col gap-2 bg-gradient-to-r from-green-gradient-3 to-green-gradient-4
    font-semibold  flex-1 flex-basis[40%] items-center`
      ]}
    >
      <h1 css={[tw`text-h1 font-semibold !mb-0 leading-[auto]`]}>{apy}% APY</h1>
      <div css={[tw`flex flex-col gap-2 flex-1 max-w-[300px] w-full`]}>
        <div css={[tw`flex flex-col gap-2 items-center`]}>
          <p css={[tw`mb-0 text-45 min-sm:text-3xl text-white opacity-60`, totalEarned > 0 && tw`opacity-100`]}>
            {totalEarnedString == '0.00' ? (totalEarned > 0 ? '< 0.00' : '0.00') : totalEarnedString}
          </p>
          <p css={[tw`mb-0 text-regular min-sm:text-average text-white`]}>Past USDC Earnings</p>
        </div>
        <div css={[tw`flex flex-col items-center`]}>
          <p css={[tw`mb-0 text-regular min-sm:text-average text-white flex items-center gap-1.25`]}>
            Total Staked{' '}
            <Tooltip
              title={
                <div
                  css={[
                    tw`flex flex-col gap-1.25 [&>p]:mb-0 text-tiny font-semibold text-grey-5 dark:text-black-4`
                  ]}
                >
                  <p>Global Staked GOFX</p>
                  <p>≈ {numberFormatter(totalStakedGlobally * gofxValue, 2)}</p>
                  <p>My Stake Ratio</p>
                  <p>≈ {stakeRatio == '0.00' ? '<0.01' : stakeRatio}%</p>
                </div>
              }
              className={'!inline-flex !m-0 !my-auto'}
              color={mode !== 'dark' ? '#FFF' : '#1C1C1C'}
              tooltipIconClassName={'!ml-0 !w-5 !h-5 min-sm:!w-4 min-sm:!h-4'}
              showArrow={false}
              overrideIcon={'/img/assets/tooltip_holo.svg'}
            >
              <></>
            </Tooltip>
          </p>
          <p
            css={[
              tw`mb-0 text-regular min-sm:text-average opacity-60 text-white`,
              totalStaked > 0 && tw`opacity-100`
            ]}
          >
            {numberFormatter(totalStaked)} GOFX
          </p>
        </div>
        <RewardsClaimButton />
      </div>
      <h4 css={[tw`mb-0 text-white font-semibold text-regular font-semibold !mb-0 leading-[auto]`]}>
        During cooldown no rewards will be earned
      </h4>
    </div>
  )
}
