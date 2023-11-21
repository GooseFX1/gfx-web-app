import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import useRewards from '../../context/rewardsContext'
import tw from 'twin.macro'
import 'styled-components/macro'
import useBreakPoint from '../../hooks/useBreakPoint'
import { useDarkMode } from '../../context'
import { Tooltip } from '../Tooltip'
import AllUnstakingTicketsModal from './ClaimTicketModal'
import useBoolean from '../../hooks/useBoolean'
import { numberFormatter } from '../../utils'
import Skeleton from 'react-loading-skeleton'

const UnstakeBottomBar: FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { unstakeableTickets, activeUnstakingTickets } = useRewards()
  const showUnstakingModal = useCallback(() => {
    if (activeUnstakingTickets.length == 0) return
    setIsModalOpen(true)
  }, [unstakeableTickets, activeUnstakingTickets])
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
          unstakeableTickets.length == 0 ? 'text-grey-1' : tw``
        ]}
        disabled={activeUnstakingTickets.length == 0}
        onClick={showUnstakingModal}
      >
        {activeUnstakingTickets.length == 0 ? 'No Active Cooldowns' : 'See All Active Cooldowns'}
      </button>
    </div>
  )
}
const StakeBottomBar: FC<{ proposedStakeAmount: number }> = ({ proposedStakeAmount = 0.0 }) => {
  const breakpoints = useBreakPoint()
  const { totalStakedInUSD, gofxValue } = useRewards()
  const [calculating, setCalculating] = useBoolean(false)
  const { mode } = useDarkMode()
  const [apy, setApy] = useState<number>(0)
  const [approxRewardAmount, setApproxRewardAmount] = useState<number>(0)
  useEffect(() => {
    fetch('https://api-services.goosefx.io/gofx-stake/getApy')
      .then((res) => res.json())
      .then((res) => setApy(Number(res.data)))
      .catch((err) => console.error('failed to fetch apy', err))
  }, [])
  const adjustedStakeAmountInUSD = useMemo(() => proposedStakeAmount * gofxValue, [proposedStakeAmount, gofxValue])
  useEffect(() => {
    setCalculating.on()
    const val = ((Number(totalStakedInUSD) + adjustedStakeAmountInUSD) / 365) * (apy / 100)
    setApproxRewardAmount(val)
    const t = setTimeout(setCalculating.off, 1000)
    return () => clearTimeout(t)
  }, [totalStakedInUSD, apy, adjustedStakeAmountInUSD])
  return breakpoints.isMobile ? (
    <div css={tw`mt-auto w-full flex flex-col mb-[28.5px] `}>
      <div css={tw`flex flex-row justify-between`}>
        <p css={tw`mb-0 text-[15px] leading-[18px] text-black-4 dark:text-grey-5`}>Approx. Daily Rewards</p>
        {calculating ? (
          <Skeleton height={'15px'} width={'66%'} borderRadius={'1rem'} />
        ) : (
          <p
            css={[
              tw`mb-0 text-[15px] leading-[18px] text-grey-1`,
              approxRewardAmount > 0.0 ? tw`text-black-4 dark:text-grey-5` : tw``
            ]}
          >
            {numberFormatter(approxRewardAmount, 2)} USDC
          </p>
        )}
      </div>
      <div css={tw`flex flex-row justify-between`}>
        <div css={tw`flex`}>
          <p css={tw`mb-0 text-[15px] leading-[18px] text-black-4 dark:text-grey-5`}>Cooldown Period</p>

          <Tooltip
            color={mode === 'dark' ? '#EEEEEE' : '#1C1C1C'}
            title={'You must wait 7 days after unstaking to reclaim your GO FX.'}
          >
            <img src="/img/assets/info-icon-transparent.svg" css={tw`w-[18px] h-[18px] ml-2`} />
          </Tooltip>
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
        {calculating ? (
          <Skeleton baseColor={'#EEE'} highlightColor={'#8ADE75'} height={'15px'} width={'66%'} />
        ) : (
          <p css={tw`mb-0 text-[15px] leading-[18px] text-white`}>${approxRewardAmount.toFixed(2)} USDC</p>
        )}
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
          >
            <img src="/img/assets/info-icon-transparent.svg" css={tw`w-[18px] h-[18px] ml-2`} />
          </Tooltip>
        </div>
        <p css={tw`mb-0`}>7 days</p>
      </div>
    </div>
  )
}

export { UnstakeBottomBar, StakeBottomBar }
