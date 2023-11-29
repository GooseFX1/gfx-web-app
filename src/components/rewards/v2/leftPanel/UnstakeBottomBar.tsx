import React from 'react'
import tw from 'twin.macro'
import AllUnstakingTicketsModal from '../../ClaimTicketModal'
import useBoolean from '../../../../hooks/useBoolean'
import useRewards from '../../../../context/rewardsContext'
import Button from '../../../twComponents/Button'

function RewardsUnstakeBottomBar(): JSX.Element {
  const [isModalOpen, setIsModalOpen] = useBoolean(false)
  const { activeUnstakingTickets } = useRewards()
  return (
    <div css={[tw`mt-3 min-md:mt-0 h-[38.5px] max-w-[580px]`]}>
      <AllUnstakingTicketsModal isOpen={isModalOpen} onClose={setIsModalOpen.off} />
      <Button
        css={[
          tw`text-grey-2 dark:text-grey-1 underline
  `,
          activeUnstakingTickets.length > 0 && tw`text-blue-1 dark:text-white`
        ]}
        disabled={activeUnstakingTickets.length == 0}
        onClick={setIsModalOpen.on}
      >
        {activeUnstakingTickets.length == 0 ? 'No Active Cooldowns' : 'See All Active Cooldowns'}
      </Button>
    </div>
  )
}

export default RewardsUnstakeBottomBar
