import { FC, ReactElement } from 'react'
import { Connect } from '@/layouts'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button, Icon } from 'gfx-component-lib'
import { useDarkMode } from '@/context'

type StickyFooterProps  = {
  isDeposit: boolean
}
const StickyFooter: FC<StickyFooterProps> = ({isDeposit}): ReactElement => {
  const {connected} = useWallet()
  const {mode,isDarkMode} = useDarkMode()

  return (
    <div className='fixed h-[55px] w-full flex flex-row bottom-0 border-t 
        border-solid dark:border-black-4 border-grey-4 p-2.5 dark:bg-black-2 bg-white'>
      {connected ? (
        <Button
          colorScheme={'blue'}
          className={'h-8.75 w-[235px]'}
        //   disabled={disableActionButton || disabled || isLoading}
        //   onClick={depositWithdrawOnClick}
        //   isLoading={isLoading}
        >
          {isDeposit?'Deposit':'Withdraw'}
        </Button>
      ) : (
        <Connect containerStyle={'h-8.75 w-[235px] z-0'} customButtonStyle={'h-8.75 w-[235px]'} />
      )}
      <Button variant={'outline'}
              colorScheme={isDarkMode ? 'default' : 'blue'}
      className={'p-1.5 bg-white'}
      >
        <Icon src={`img/assets/refresh_${mode}.svg`} size='sm' />
      </Button>
      <Button
        variant={'outline'}
        colorScheme={isDarkMode ? 'default' : 'blue'}
        className={'bg-white'}
        iconLeft={<Icon src={`img/assets/footer_filter_${mode}.svg`} size="sm" />}
      >
        <span className="font-bold text-regular text-black-4 dark:text-white">0.1%</span>
      </Button>
    </div>
  )
}

export default StickyFooter
