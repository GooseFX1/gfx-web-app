import { FC, ReactElement } from 'react'
import { Button, Icon } from 'gfx-component-lib'

const FindPool: FC = (): ReactElement => (
  <div
    className="h-[207px] w-full bg-red-100 border 
      border-solid dark:border-black-4 border-grey-4 bg-white dark:bg-black-2 p-2.5 rounded-[8px]"
  >
    <div className="flex flex-row items-center mb-3">
      <Icon
        src={`img/assets/question-icn.svg`}
        size="lg"
        className={'border-solid dark:border-black-2 border-white border-[3px] rounded-full mr-1.5'}
      />
      <div className="text-average font-semibold font-poppins dark:text-grey-8 text-black-4">
        Find The Perfect Pool
      </div>
    </div>
    <div className="text-regular font-semibold dark:text-grey-2 text-grey-1 mb-11.5">
      Answer few questions to assess your risk tolerance and discover the best liquidity pools tailored to your
      investment goals.
    </div>
    <Button
      className="cursor-pointer bg-blue-1 text-white w-full"
      variant={'secondary'}
      onClick={() => {
        console.log('start now')
      }}
    >
      Start Now
    </Button>
  </div>
)

export default FindPool