import { FC, ReactElement } from 'react'
import { Connect } from '@/layouts'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button, Icon } from 'gfx-component-lib'
import { useDarkMode } from '@/context'

const StickyFooter: FC = (): ReactElement => {
  const {connected} = useWallet()
  const {mode} = useDarkMode()

  return (
    <div className='fixed h-[55px] w-full flex flex-row bottom-0 border-t 
        border-solid dark:border-black-4 border-grey-4 p-2.5 dark:bg-black-1 bg-white'>
      {connected ? (
        <Button
          colorScheme={'blue'}
          className={'h-8.75 w-[235px]'}
        //   disabled={disableActionButton || disabled || isLoading}
        //   onClick={depositWithdrawOnClick}
        //   isLoading={isLoading}
        >
          Deposit
        </Button>
      ) : (
        <Connect containerStyle={'h-8.75 w-[235px] z-0'} customButtonStyle={'h-8.75 w-[235px]'} />
      )}
      <div className='mx-2.5 h-8.75 w-8.75 rounded-full border-[1.5px] border-solid dark:border-white 
            border-blue-1 flex justify-center items-center cursor-pointer'>
        <Icon src={`img/assets/refresh_${mode}.svg`} size='sm' />
      </div>
      <div className='h-8.75 w-[82px] rounded-full border-[1.5px] border-solid dark:border-white 
            border-blue-1 flex justify-between items-center py-[7.5px] px-2.5 cursor-pointer'>
            <Icon src={`img/assets/footer_filter_${mode}.svg`} size='sm' />
            <span className='font-bold text-regular text-black-4 dark:text-white'>0.1%</span>
      </div>
    </div>
  )
}

export default StickyFooter
