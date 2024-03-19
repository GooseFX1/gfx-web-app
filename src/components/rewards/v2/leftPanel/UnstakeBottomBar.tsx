import React from 'react'
import AllUnstakingTicketsModal from '../../ClaimTicketModal'
import useBoolean from '../../../../hooks/useBoolean'
import useRewards from '../../../../context/rewardsContext'
import { Button, cn } from 'gfx-component-lib'

function RewardsUnstakeBottomBar(): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useBoolean(false)
  const { activeUnstakingTickets, unstakeableTickets } = useRewards()
  return (
    <div className={`min-md:mt-0 flex justify-center items-center min-md:h-[57px] max-w-[580px]`}>
      <AllUnstakingTicketsModal isOpen={isModalOpen} onClose={setIsModalOpen.off} />
      <Button
        className={cn(
          `text-grey-2 dark:text-grey-1 underline items-baseline p-0 font-bold
  `,
          activeUnstakingTickets.length > 0 && `text-blue-1 dark:text-white`
        )}
        variant={'link'}
        disabled={activeUnstakingTickets.length == 0}
        onClick={setIsModalOpen.on}
      >
        {activeUnstakingTickets.length == 0 ? (
          'No Active Cooldowns'
        ) : (
          <>
            <span>See All Active Cooldowns</span>
            {unstakeableTickets.length > 0 && <span className={`rounded-full w-2.5 h-2.5 bg-red-2`} />}
          </>
        )}
      </Button>
    </div>
  )
}

export default RewardsUnstakeBottomBar
