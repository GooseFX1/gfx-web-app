import { useGamma } from '@/context'
import { FC, Dispatch, SetStateAction } from 'react'
import { Button, DialogTitle, Icon } from 'gfx-component-lib'
import RewardsClose from '@/assets/rewards_close.svg?react'

export const DepositWithdrawHeader: FC<{
  setUserSourceDepositAmount: Dispatch<SetStateAction<string>>
  setUserSourceWithdrawAmount: Dispatch<SetStateAction<string>>
  setUserTargetDepositAmount: Dispatch<SetStateAction<string>>
  setUserTargetWithdrawAmount: Dispatch<SetStateAction<string>>
}> = ({
  setUserSourceDepositAmount,
  setUserSourceWithdrawAmount,
  setUserTargetDepositAmount,
  setUserTargetWithdrawAmount
}): JSX.Element => {
  const { selectedCard, setOpenDepositWithdrawSlider } = useGamma()

  const handleClose = () => {
    setUserSourceDepositAmount('')
    setUserSourceWithdrawAmount('')
    setUserTargetDepositAmount('')
    setUserTargetWithdrawAmount('')
    setOpenDepositWithdrawSlider(false)
  }

  return (
    <DialogTitle
      className="w-full h-14 flex flex-row items-center border-b 
        border-solid dark:border-black-4 border-grey-4 px-2.5"
    >
      <div className="flex relative w-[80px]">
        <Icon
          src={`img/crypto/${selectedCard?.sourceToken}.svg`}
          size="lg"
          className={'border-solid dark:border-black-2 border-white border-[3px] rounded-full'}
        />
        <Icon
          src={`img/crypto/${selectedCard?.targetToken}.svg`}
          size="lg"
          className={
            'absolute left-[30px] border-solid dark:border-black-2 border-white border-[3px] rounded-full'
          }
        />
      </div>
      <div className="font-poppins font-semibold text-average text-black-4 dark:text-grey-8 ">
        {selectedCard?.sourceToken + ' - ' + selectedCard?.targetToken}
      </div>
      <Button
        onClick={handleClose}
        variant={'ghost'}
        className={`inline-block absolute p-[inherit] right-3.75 top-5 min-md:right-5
             min-md:top-5 z-[1] w-max p-0`}
        size={'sm'}
      >
        <RewardsClose
          className={`h-5.25 w-5.25 min-md:h-5 min-md:w-5 min-md:stroke-border-lightmode-primary 
    min-md:dark:stroke-border-darkmode-primary`}
        />
      </Button>
    </DialogTitle>
  )
}
