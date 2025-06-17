import { FC } from 'react'
import tw from 'twin.macro'

interface ClaimAllRewardsProps {
  openClaimAllRewardsDialog: boolean
  setOpenClaimAllRewardsDialog: (open: boolean) => void
}

export const ClaimAllRewards: FC<ClaimAllRewardsProps> = ({
  openClaimAllRewardsDialog,
  setOpenClaimAllRewardsDialog
}) => {
  return (
    <ClaimAllButton onClick={() => setOpenClaimAllRewardsDialog(true)}>
      Claim All Rewards
    </ClaimAllButton>
  )
}

const ClaimAllButton = tw.button`
  bg-[#7A7A7A] text-white rounded-lg px-4 py-2 text-sm font-medium
  hover:bg-[#8A8A8A] transition-colors duration-200
`

