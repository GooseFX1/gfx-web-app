import React from 'react'
import tw from 'twin.macro'
import AllUnstakingTicketsModal from '../../ClaimTicketModal'
import useBoolean from '../../../../hooks/useBoolean'
import useRewards from '../../../../context/rewardsContext'
import Button from '../../../twComponents/Button'

function RewardsUnstakeBottomBar(): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useBoolean(false)
  const { activeUnstakingTickets, unstakeableTickets } = useRewards()
  return (
    <div css={[tw`mt-3 min-md:mt-0 h-[37px] max-w-[580px]`]}>
      <AllUnstakingTicketsModal isOpen={isModalOpen} onClose={setIsModalOpen.off} />
      <Button
        css={[
          tw`text-grey-2 dark:text-grey-1 underline items-baseline
  `,
          activeUnstakingTickets.length > 0 && tw`text-blue-1 dark:text-white`
        ]}
        disabled={activeUnstakingTickets.length == 0}
        onClick={setIsModalOpen.on}
      >
        {activeUnstakingTickets.length == 0 ? (
          'No Active Cooldowns'
        ) : (
          <>
            <span>See All Active Cooldowns</span>
            {unstakeableTickets.length > 0 && <span css={[tw`rounded-full w-2.5 h-2.5 bg-red-2`]} />}
          </>
        )}
      </Button>
    </div>
  )
}

export default RewardsUnstakeBottomBar
