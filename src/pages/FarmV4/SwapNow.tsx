import { FC, ReactElement } from 'react'
import { Icon, Button } from 'gfx-component-lib'

const SwapNow: FC = (): ReactElement => (
  <div className="mx-2.5">
    <div className={`w-full p-[1px] bg-gradient-1 rounded-tiny`}>
      <div className={`bg-grey-5 dark:bg-black-1 h-full rounded-tiny p-2.5`}>
        <div className="flex flex-row items-center">
          <Icon src="img/assets/jupiter.svg" size="sm" />
          <span className="font-poppins text-average font-semibold dark:text-grey-8 text-black-4">Swap Now!</span>
        </div>
        <div className="text-regular font-semibold dark:text-grey-2 text-grey-1 my-2.5">
          You don't have enough tokens to complete this transaction. No worries, you can quickly swap tokens now to
          get the right amount!
        </div>
        <Button
          className="cursor-pointer bg-blue-1 text-white block mx-auto"
          variant={'secondary'}
        >
          Swap Now!
        </Button>
      </div>
    </div>
  </div>
)

export default SwapNow
