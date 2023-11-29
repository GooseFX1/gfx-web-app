import { useDarkMode } from '../../../../context'
import tw from 'twin.macro'
import { Tooltip } from '../../../Tooltip'
import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { numberFormatter } from '../../../../utils'
interface RewardsBottomBarProps {
  calculating: boolean
  approxRewardAmount: number
}
export default function RewardsStakeBottomBar({
  calculating,
  approxRewardAmount
}: RewardsBottomBarProps): JSX.Element {
  const { mode } = useDarkMode()
  return (
    <div
      css={[
        tw`mt-3 min-md:mt-auto flex min-md:p-2.5 min-md:bg-gradient-to-r
        from-green-gradient-3 text-regular min-md:text-average
    to-green-gradient-4 bg-none rounded-t-tiny  min-md:text-tiny font-semibold text-grey-1
     dark:text-grey-2  min-md:text-grey-5
        min-md:dark:text-grey-5 items-center flex-col min-md:flex-row w-full max-w-[580px]`
      ]}
    >
      <div css={[tw`flex flex-wrap min-md:flex-col min-md:gap-1.25 justify-between min-md:justify-start w-full`]}>
        <p css={[tw`mb-0 whitespace-nowrap`]}>Approx. Daily Rewards</p>
        <p css={[tw` mb-0 text-black-4 dark:text-grey-5`]}>
          {calculating ? (
            <Skeleton height={'15px'} width={'60px'} borderRadius={'1rem'} highlightColor={'#37BB7D'} />
          ) : (
            `${numberFormatter(approxRewardAmount)} USDC`
          )}
        </p>
      </div>
      <div css={[tw`hidden min-md:block border-1 border-solid border-divider rounded-tiny mx-2.5 h-full`]} />
      <div css={[tw`flex flex-wrap min-md:flex-col min-md:gap-1.25 justify-between min-md:justify-start w-full`]}>
        <p css={[tw`mb-0 flex items-center gap-1`]}>
          Cooldown Period{' '}
          <Tooltip
            title={'You must wait 7 days after unstaking to reclaim your GOFX.'}
            className={'!inline-flex !m-0 !my-auto'}
            color={mode == 'dark' ? '#FFF' : '#1C1C1C'}
            tooltipIconClassName={'!ml-0'}
            showArrow={false}
            overrideIcon={'/img/assets/tooltip_holo.svg'}
          >
            <></>
          </Tooltip>
        </p>
        <p css={[tw`mb-0 text-black-4 dark:text-grey-5`]}>7 Days</p>
      </div>
    </div>
  )
}
