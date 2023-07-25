import { FC, useCallback, useState } from 'react'
import useRewards from '../../context/rewardsContext'
import tw from 'twin.macro'
import 'styled-components/macro'
import useBreakPoint from '../../hooks/useBreakPoint'
import { useDarkMode } from '../../context'
import { Tooltip } from '../Tooltip'
import AllUnstakingTicketsModal from './ClaimTicketModal'

const UnstakeBottomBar: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { rewards } = useRewards()
  const showUnstakingModal = useCallback(() => {
    if (rewards.user.staking.activeUnstakingTickets.length == 0) return
    setIsModalOpen(true)
  }, [rewards.user.staking.unstakeableTickets])
  const hideUnstakingModal = useCallback(() => setIsModalOpen(false), [])
  return (
    <div css={[tw`min-md:h-[91px]`]}>
      <AllUnstakingTicketsModal isOpen={isModalOpen} onClose={hideUnstakingModal} />
      <button
        css={[
          tw`min-md:mt-0 min-md:mb-0 min-md:h-[91px] text-[18px] leading-[22px] text-primary-gradient-1
          underline dark:text-grey-5 cursor-pointer bg-transparent hover:bg-transparent focus:bg-transparent
           active:bg-transparent font-semibold border-0 min-md:mb-[28px]
  `,
          rewards.user.staking.unstakeableTickets.length == 0 ? 'text-grey-1' : tw``
        ]}
        disabled={rewards.user.staking.activeUnstakingTickets.length == 0}
        onClick={showUnstakingModal}
      >
        {rewards.user.staking.activeUnstakingTickets.length == 0
          ? 'No Active Cooldowns'
          : 'See All Active Cooldowns'}
      </button>
    </div>
  )
}
const StakeBottomBar: FC = () => {
  const breakpoints = useBreakPoint()
  const { mode } = useDarkMode()
  const approxRewardAmount = 0.0
  return breakpoints.isMobile ? (
    <div css={tw`mt-auto w-full flex flex-col mb-[28.5px] `}>
      <div css={tw`flex flex-row justify-between`}>
        <p css={tw`mb-0 text-[15px] leading-[18px] text-black-4 dark:text-grey-5`}>Approx. Daily Rewards</p>
        <p
          css={[
            tw`mb-0 text-[15px] leading-[18px] text-grey-1`,
            approxRewardAmount > 0.0 ? tw`text-black-4 dark:text-grey-5` : tw``
          ]}
        >
          {approxRewardAmount.toFixed(2)} USDC
        </p>
      </div>
      <div css={tw`flex flex-row justify-between`}>
        <div css={tw`flex`}>
          <p css={tw`mb-0 text-[15px] leading-[18px] text-black-4 dark:text-grey-5`}>Cooldown Period</p>

          <Tooltip
            color={mode === 'dark' ? '#EEEEEE' : '#1C1C1C'}
            title={'You must wait 7 days after unstaking to reclaim your GO FX.'}
          ></Tooltip>
        </div>
        <p css={[tw`mb-0 text-[15px] leading-[18px] text-black-4 dark:text-grey-5`]}>7 days</p>
      </div>
    </div>
  ) : (
    <div
      css={tw`mt-auto w-max px-4 flex flex-row font-semibold rounded-t-lg items-center  gap-4 min-h-[91px]`}
      style={{
        background: `linear-gradient(89.96deg, #36BB7C 0.04%, #194B5E 99.97%)`
      }}
    >
      <div css={tw` flex flex-col`}>
        <p css={tw`mb-0 text-[13px] leading-[16px] `}>Approx. Daily Rewards</p>
        <p css={tw`mb-0 text-[15px] leading-[18px] text-white`}>${approxRewardAmount.toFixed(2)} USDC</p>
      </div>
      <span
        css={tw`h-3/4 rounded-lg`}
        style={{
          border: `1.5px solid rgba(248, 255, 253, 0.2)`
        }}
      />
      <div css={tw`flex flex-col `}>
        <div css={tw`flex`}>
          <p css={tw`mb-0 text-[13px] leading-[16px]`}>Cooldown period</p>
          <Tooltip
            color={mode === 'dark' ? '#EEEEEE' : '#1C1C1C'}
            title={'You must wait 7 days after unstaking to reclaim your GOFX.'}
            overrideIcon={'/img/assets/info-icon-transparent.svg'}
            dark={false}
          ></Tooltip>
        </div>
        <p css={tw`mb-0`}>7 days</p>
      </div>
    </div>
  )
}

export { UnstakeBottomBar, StakeBottomBar }
