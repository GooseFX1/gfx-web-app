import { FC, ReactElement, useState } from 'react'
import { Connect } from '@/layouts'
import { useWallet } from '@solana/wallet-adapter-react'
import { Button, Icon, IconTooltip, Input, Popover, PopoverContent, PopoverTrigger } from 'gfx-component-lib'
import { BASE_SLIPPAGE, useDarkMode, useFarmContext } from '@/context'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import useBreakPoint from '@/hooks/useBreakPoint'

type StickyFooterProps  = {
  isDeposit: boolean
}
const StickyFooter: FC<StickyFooterProps> = ({isDeposit}): ReactElement => {
  const {connected} = useWallet()
  const {isMobile} = useBreakPoint()
  const {mode,isDarkMode} = useDarkMode()
  const {slippage, setSlippage, isCustomSlippage} = useFarmContext();
  const [value,setValue] = useState<number>(0);
  const localIsCustomSlippage = isCustomSlippage || !BASE_SLIPPAGE.includes(value)
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
      <Popover modal={false}>
        <PopoverTrigger asChild>
          <Button
            variant={'outline'}
            colorScheme={isDarkMode ? 'default' : 'blue'}
            className={'bg-white'}
            iconLeft={<Icon src={`img/assets/footer_filter_${mode}.svg`} size="sm" />}
          >
            <span className="font-bold text-regular text-black-4 dark:text-white">
              {isNaN(slippage)?'0.00':slippage.toFixed(2)}%
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className={`flex flex-col max-sm:w-screen max-sm:rounded-b-none gap-2.5`}
        side={'bottom'}
                        sideOffset={isMobile?-44:5}
        >
          <div className={'flex gap-1 items-center'}>
            <h5>Liquidity Slippage</h5>
            <IconTooltip tooltipType={'outline'} >
              <span className="font-semibold text-tiny">
                The maximum slippage that you are willing to accept for this transaction.
              </span>
            </IconTooltip>
          </div>
          <RadioOptionGroup defaultValue={'0.1'}
                            value={localIsCustomSlippage?'custom':value.toString()}
                            options={[
            {
              label: '0.1%',
              value: '0.1',
              onClick: () => setValue(0.1)
            },
            {
              label: '0.5%',
              value: '0.5',
              onClick: () => setValue(0.5)
            },
            {
              label: '1%',
              value: '1',
              onClick: () => setValue(1)
            },
            {
              label: 'Custom',
              value: 'custom',
              onClick: () => setValue(0)
            }
          ]} />
          <Input
            className={'text-right'}
          value={value}
          onChange={(e) => setValue(parseFloat(e.target.value))}
          type={'number'}
          />
          <Button
            fullWidth
            colorScheme={'blue'}
            disabled={value==slippage}
            onClick={()=>setSlippage(value)}
          >
            Save
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default StickyFooter
