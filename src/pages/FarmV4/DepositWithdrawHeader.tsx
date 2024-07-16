import { useSSLContext } from '@/context'
import { FC } from 'react'
import { Icon, Button } from 'gfx-component-lib'
import RewardsClose from '@/assets/rewards_close.svg?react'

export const DepositWithdrawHeader: FC = (): JSX.Element => {
  const { selectedCard, setOperationPending } = useSSLContext()
  return (
    <div className="w-full h-14 flex flex-row items-center border-b 
        border-solid dark:border-black-4 border-grey-4 px-2.5">
      <Icon src={`img/crypto/${selectedCard?.sourceToken}.svg`} size="lg" />
      <Icon src={`img/crypto/${selectedCard?.targetToken}.svg`} size="lg" className="mr-1.5" />
      <div className="font-poppins font-semibold text-average text-black-4 dark:text-grey-8 ">
        {selectedCard.sourceToken + ' - ' + selectedCard.targetToken}
      </div>
      <Button
        onClick={() => setOperationPending(false)}
        variant={'ghost'}
        className={`hidden min-md:inline-block absolute p-[inherit] right-3.75 top-5 min-md:right-5
             min-md:top-5 z-[1] w-max p-0`}
        size={'sm'}
      >
        <RewardsClose
          className={`h-3 w-3 min-md:h-5 min-md:w-5 stroke-border-lightmode-primary 
    min-md:stroke-border-darkmode-primary min-md:dark:stroke-border-darkmode-primary`}
        />
      </Button>
    </div>
  )
}
