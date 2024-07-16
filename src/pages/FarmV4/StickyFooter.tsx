import { FC, ReactElement } from 'react'
import { Connect } from '@/layouts'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button, Icon } from 'gfx-component-lib'
import { useDarkMode } from '@/context'

const StickyFooter: FC = (): ReactElement => {
  const {connected} = useWallet()
  const {mode} = useDarkMode()

  return (
    <div className='w-full flex flex-row fixed bottom-2 border-t 
        border-solid dark:border-black-4 border-grey-4 p-2.5'>
      {connected ? (
        <Button
          colorScheme={'blue'}
          className={'basis-1/2'}
        //   disabled={disableActionButton || disabled || isLoading}
        //   onClick={depositWithdrawOnClick}
        //   isLoading={isLoading}
        >
          Deposit
        </Button>
      ) : (
        <Connect containerStyle={'inline-flex basis-1/2 z-0'} customButtonStyle={'h-[35px] w-full'} />
      )}
      <div className='mx-2.5 h-8.75 w-8.75 rounded-full border-[1.5px] border-solid dark:border-white 
            border-blue-1 flex justify-center items-center'>
        <Icon src={`img/assets/refresh_${mode}.png`} size='sm' />
      </div>
      <div className='h-8.75 w-[82px] rounded-full border-[1.5px] border-solid dark:border-white 
            border-blue-1 flex justify-center items-center py-[7.5px] px-2.5'>
            <Icon src={`img/assets/footer_filter_${mode}.svg`} size='sm' className='cursor-pointer' />
            <span className='font-bold text-regular text-black-4 dark:text-white'>0.1%</span>
      </div>

    </div>
  )
}

export default StickyFooter
