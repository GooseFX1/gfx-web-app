import { FC, useEffect } from 'react'
//import { Container } from 'gfx-component-lib'
import { useGamma } from '@/context'
import MyPositionSortHeader from './MyPositionSortHeader'
import MyPositionItems from './MyPositions'
import FarmSort from '@/pages/FarmV4/FarmSort'
import useBoolean from '@/hooks/useBoolean'
import TokenSearchBar from '@/pages/FarmV4/TokenSearchBar'
import { ClaimAllRewardsDialog } from '@/components/token-rewards/ClaimAllRewardsDialog'
import { Button } from 'gfx-component-lib'

const ProPositions: FC = () => {
  const [openClaimAllRewardsDialog, setOpenClaimAllRewardsDialog] = useBoolean(false)
  const {
    setShowDeposited,
    showDeposited
  } = useGamma()
  const [isOpen, setIsOpen] = useBoolean(false)
  useEffect(() => {
    if (!showDeposited) {
      setShowDeposited(true)
    }
  }, [])
  return (
    <div>
      <div className="flex flex-row justify-between items-center mb-3.75">
        <h4 className="font-poppins text-average font-semibold dark:text-grey-8 text-black-4">My Positions</h4>
        {/* <div
          className="h-[42px] w-[274px] rounded-[4px] border border-solid items-center justify-between
                    dark:border-black-4 border-grey-4 dark:bg-black-2 bg-white flex flex-row p-2"
        >
          <div>
              <span className="font-poppins text-regular font-semibold dark:text-grey-2 text-grey-1 mr-1.5">
                Pending Yield
              </span>
            <span className="font-poppins text-regular font-semibold dark:text-grey-8 text-black-4">$21.88</span>
          </div>
          <Container
            className="h-[30px] w-[85px] cursor-pointer flex flex-row
                        justify-center items-center !rounded-[200px]"
            colorScheme={'primaryGradient'}
            size={'lg'}
          >
            Claim All
          </Container>
        </div> */}
      </div>
      <div className="flex items-center max-sm:flex-col max-sm:gap-4 sm-lg:flex-col sm-lg:gap-4 mb-3.75">
        <div className="flex w-full items-center justify-between">
          <TokenSearchBar />
          <div className="flex justify-between items-center gap-[15px]">
            <Button
              onClick={() => setOpenClaimAllRewardsDialog(true)}
              variant={'ghost'}
              size={'sm'}
              className={`
  bg-[#7A7A7A] text-white rounded-lg px-4 py-2 text-sm font-medium
  hover:bg-[#8A8A8A] transition-colors duration-200
`}
            >
              Claim All Rewards
            </Button>
            <ClaimAllRewardsDialog
              openClaimAllRewardsDialog={openClaimAllRewardsDialog}
              setOpenClaimAllRewardsDialog={setOpenClaimAllRewardsDialog.set}
            />
            <FarmSort isOpen={isOpen} setIsOpen={setIsOpen.set} />
          </div>
        </div>
      </div>
      <MyPositionSortHeader />
      <MyPositionItems />
    </div>
  )
}

export default ProPositions