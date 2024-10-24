import { useDarkMode, useGamma } from '@/context'
import { FC } from 'react'
import { Button, DialogTitle, Icon } from 'gfx-component-lib'
import RewardsClose from '@/assets/rewards_close.svg?react'
import { loadIconImage } from '@/utils'

export const DepositWithdrawHeader: FC<{ handleClose: () => void }> = ({ handleClose }): JSX.Element => {
  const { selectedCard } = useGamma()
  const {mode} = useDarkMode()
  return (
    <DialogTitle
      className="w-full h-14 flex flex-row items-center border-b 
        border-solid dark:border-black-4 border-grey-4 px-2.5"
    >
      <div className="flex relative w-[80px]">
        <Icon
          src={loadIconImage(selectedCard?.mintA?.logoURI, mode)}
          size="lg"
          className={'border-solid dark:border-black-2 border-white border-[3px] rounded-full'}
        />
        <Icon
          src={loadIconImage(selectedCard?.mintB?.logoURI, mode)}
          size="lg"
          className={
            'absolute left-[30px] border-solid dark:border-black-2 border-white border-[3px] rounded-full'
          }
        />
      </div>
      <div className="font-poppins font-semibold text-average text-black-4 dark:text-grey-8 ">
        {selectedCard?.mintA?.symbol + ' - ' + selectedCard?.mintB?.symbol}
      </div>
      <Button
        onClick={handleClose}
        variant={'ghost'}
        className={`inline-block absolute p-[inherit] right-3.75 top-5 min-md:right-5
             min-md:top-5 z-[1] w-max p-0`}
        size={'sm'}
      >
        <RewardsClose
          className={`h-5.25 w-5.25 min-md:h-5 min-md:w-5 
            stroke-border-lightmode-primary dark:stroke-border-darkmode-primary`}
        />
      </Button>
    </DialogTitle>
  )
}
