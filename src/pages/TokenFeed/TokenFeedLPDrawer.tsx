import React, { FC, useEffect, useState } from 'react'
import {
  Button,
  cn,
  Dialog,
  DialogBody,
  DialogCloseDefault,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  Icon,
  IconTooltip,
  Input,
  IntemediaryToast,
  IntemediaryToastHeading,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ToastTitle
} from 'gfx-component-lib'
import useBreakPoint from '@/hooks/useBreakPoint'
import { useTokenFeed } from '@/context/tokenFeedContext'
import CircularProgress from '@/components/CircularProgress'
import { H3, H4, P } from '@/components/text/TextComponents'
import { toast } from 'sonner'
import SuccessIcon from '@/assets/Success-icon.svg?react'
import { IconWithFallback } from '@/components/common/IconWithFallback'
import ProgressBar from '@/components/ProgressBar'
import TokenFeedDrawerTokenMetrics from './TokenFeedDrawerTokenMetrics'
import TokenFeedDrawerBuySell from '@/pages/TokenFeed/TokenFeedDrawerBuySell'
import { Connect } from '@/layouts'
import { useWallet } from '@solana/wallet-adapter-react'
import RadioOptionGroup from '@/components/common/RadioOptionGroup'
import { useDarkMode, useGamma } from '@/context'
import { BASE_SLIPPAGE } from '@/pages/FarmV4/constants'
import { useWalletBalance } from '@/context/walletBalanceContext'
import useBoolean from '@/hooks/useBoolean'

const TokenFeedDrawerMetrics: FC<{
  label: string
  value: string
  iconSrc?: string
}> = ({ label, value, iconSrc }) => (
  <div className={`flex flex-col gap-1`}>
    <div className={`inline-flex gap-1`}>
      {iconSrc && <IconWithFallback src={iconSrc} size={'xs'} />}
      <P className={`text-b2`}>{label}</P>
    </div>
    <P className={`text-b2 text-text-lightmode-primary dark:text-text-darkmode-primary mr-auto`}>{value}</P>
  </div>
)

function TokenFeedLpDrawer() {
  const { isMobile } = useBreakPoint()
  const { isDarkMode, mode } = useDarkMode()
  const { connected } = useWallet()
  const { isTokenDepositOpen, selectedToken, selectToken } = useTokenFeed()
  const { balance } = useWalletBalance()
  const [swapButtonText, setSwapButtonText] = useState('Insufficient Funds')
  const [isSwapEnabled, setIsSwapEnabled] = useBoolean(false)
  // TODO: remove this once we get actual data
  const [progressSim, setProgressSim] = useState(0)
  const { slippage, setSlippage, isCustomSlippage } = useGamma()
  const [value, setValue] = useState<number>(slippage)
  const localIsCustomSlippage = isCustomSlippage || !BASE_SLIPPAGE.includes(value)
  const handleSlippageSave = () => {
    setSlippage(value)
    toast(
      <IntemediaryToast>
        <IntemediaryToastHeading stage={'success'}>Settings Saved!</IntemediaryToastHeading>
        <p className={cn(`pt-1`)}>Swap slippage update to {value}%.</p>
      </IntemediaryToast>,
      { id: 'slippage-save' }
    )
  }
  useEffect(() => {
    const interval = setInterval(() => {
      setProgressSim((prev) => {
        const newProgress = prev + 1
        if (newProgress >= 100) {
          clearInterval(interval)
          return 100
        }
        return newProgress
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  const copyTokenDetails = () => {
    navigator.clipboard.writeText(selectedToken?.address)
    toast(
      <div>
        <ToastTitle
          className={'items-center'}
          iconLeft={<SuccessIcon className={'stroke-background-green h-4 w-4'} />}
        >
          <H4 className={'text-text-green'}>Success</H4>
        </ToastTitle>
        <P className={'text-b3 mt-2'}>Token address copied successfully!</P>
      </div>,
      {
        id: 'copyTokenFeedAddress'
      }
    )
  }

  const onTokensUpdate = (tokenA, tokenB, tokenAAmount, tokenBAmount) => {
    const a = balance[tokenA?.address]?.tokenAmount?.uiAmount || 0
    const paymentAmount = tokenAAmount || 0
    if (a < paymentAmount || a == 0) {
      setIsSwapEnabled.off()
      setSwapButtonText('Insufficient Funds')
    } else if (tokenAAmount && tokenBAmount) {
      setSwapButtonText(`Swap`)
      setIsSwapEnabled.on()
    } else if (!tokenB || !tokenA) {
      setIsSwapEnabled.off()
      setSwapButtonText('Select Tokens')
    } else {
      setIsSwapEnabled.off()
      setSwapButtonText('Enter Amount')
    }
  }
  return (
    <Dialog open={isTokenDepositOpen} onOpenChange={() => selectToken(null)}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent
          placement={isMobile ? 'bottom' : 'right'}
          fullScreen={isMobile}
          className={'flex flex-col gap-3 p-0 rounded-none max-h-none h-full'}
        >
          <DialogHeader
            className={`px-[10px] py-2 border-b-1 border-b-solid border-border-lightmode-secondary
             dark:border-border-darkmode-secondary flex flex-col gap-2`}
          >
            <div className={`inline-flex gap-2 items-center`}>
              <div className={'w-[40px] h-[40px] p-1.25 relative'}>
                <CircularProgress progress={progressSim} />
                <Icon
                  src={selectedToken?.logoURI}
                  className={cn(
                    '!w-[30px] !h-[30px] !min-w-[30px] !min-h-[30px] !max-w-[30px] !max-h-[30px] !rounded-full'
                  )}
                />
              </div>
              <H3>{selectedToken?.symbol}</H3>
              <div className={`inline-flex gap-1`}>
                <P className={`text-b2`}>{selectedToken?.name}</P>
                <Icon
                  src={'/img/assets/clipboard_dark.svg'}
                  className={`!w-[15px] !h-[15px] !max-w-[15px] !max-h-[15px] !min-w-[15px] !min-h-[15px]
              cursor-pointer`}
                  onClick={copyTokenDetails}
                />
              </div>
            </div>
            <div className={`inline-flex gap-2 justify-between`}>
              <TokenFeedDrawerMetrics label={'Market Cap'} value={'$70.5k'} />
              <TokenFeedDrawerMetrics label={'Liquidity'} value={'$1.06k'} />
              <TokenFeedDrawerMetrics label={'Holders'} value={'100'} iconSrc={`/img/assets/holders_dark.svg`} />
            </div>
            <div className={`flex flex-col gap-2 items-start`}>
              <P className={`text-b2`}>Bonding Curve</P>
              <ProgressBar progressPercentage={progressSim} />
            </div>
            <DialogCloseDefault className={`top-2`} />
          </DialogHeader>
          <DialogBody className={`px-2.5 flex flex-col gap-2.5`}>
            <TokenFeedDrawerTokenMetrics selectedToken={selectedToken} />
            <TokenFeedDrawerBuySell selectedToken={selectedToken} onTokensUpdate={onTokensUpdate} />
          </DialogBody>
          <DialogFooter className={`flex-row p-2.5 gap-2`}>
            {!connected ? (
              <Connect fullWidth />
            ) : (
              <Button variant={'primary'} colorScheme={'blue'} fullWidth disabled={!isSwapEnabled}>
                {swapButtonText}
              </Button>
            )}
            <Popover modal={false}>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  colorScheme={isDarkMode ? 'default' : 'blue'}
                  className={'bg-white'}
                  iconLeft={<Icon src={`/img/assets/footer_filter_${mode}.svg`} size="sm" />}
                >
                  <span className="font-bold text-regular text-black-4 dark:text-white">
                    {isNaN(slippage) ? '0.00' : slippage.toFixed(2)}%
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className={`flex flex-col max-sm:w-screen max-sm:rounded-b-none gap-2.5`}
                sideOffset={isMobile ? -44 : 5}
                align={isMobile ? 'center' : 'end'}
                alignOffset={0}
              >
                <div className={'flex gap-1 items-center'}>
                  <h5>Liquidity Slippage</h5>
                  <IconTooltip tooltipType={'outline'}>
                    <span className="font-semibold text-tiny">
                      The maximum slippage that you are willing to accept for this transaction.
                    </span>
                  </IconTooltip>
                </div>
                <RadioOptionGroup
                  defaultValue={'0.1'}
                  value={localIsCustomSlippage ? 'custom' : value.toString()}
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
                  ]}
                />
                <Input
                  className={'text-right'}
                  value={value}
                  onChange={(e) => setValue(parseFloat(e.target.value))}
                  type={'number'}
                />
                <Button
                  fullWidth
                  colorScheme={'blue'}
                  disabled={value == slippage || value <= 0.0}
                  onClick={handleSlippageSave}
                >
                  Save
                </Button>
              </PopoverContent>
            </Popover>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  )
}

export default TokenFeedLpDrawer
