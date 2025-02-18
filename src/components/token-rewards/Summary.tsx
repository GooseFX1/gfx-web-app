import { GAMMAPool } from '@/types/gamma'
import { IconWithFallback } from '../common/IconWithFallback'
import { loadIconImage } from '@/utils'
import { useDarkMode } from '@/context'
import { JupToken } from '@/pages/FarmV4/constants'
interface SummaryProps {
  selectedPool?: GAMMAPool
  selectedToken?: JupToken
  amountToken?: string
  selectedTimeframe?: string
}

export const Summary = ({ selectedPool, selectedToken, amountToken, selectedTimeframe }: SummaryProps) => {
  const { mode } = useDarkMode()

  return (
    <div className="w-full">
      <h1
        className="mb-6 text-center text-lg font-semibold text-text-lightmode-primary 
      dark:text-text-darkmode-primary"
      >
        Summary
      </h1>

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-lightmode-secondary dark:text-text-darkmode-secondary">
              1. Select Pool
            </span>
            {selectedPool ? (
              <div className="flex items-center">
                <div className="flex flex-row items-center">
                  <IconWithFallback
                    src={loadIconImage(selectedPool.mintA.logoURI, mode)}
                    className="border-solid dark:border-black-2 border-white
                          border-[2px] rounded-full h-[25px] w-[25px]"
                  />
                  <IconWithFallback
                    src={loadIconImage(selectedPool.mintB.logoURI, mode)}
                    className="relative right-[10px] border-solid dark:border-black-2
                          border-white border-[2px] rounded-full h-[25px] w-[25px]"
                  />
                </div>
                <span className="text-sm font-medium text-text-lightmode-primary dark:text-text-darkmode-primary">
                  {selectedPool?.mintA.symbol} - {selectedPool?.mintB.symbol}
                </span>
              </div>
            ) : (
              <span className="text-sm font-medium text-text-lightmode-primary dark:text-text-darkmode-primary">
                No pool selected
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-lightmode-secondary dark:text-text-darkmode-secondary">
              2. Select Reward Tokens
            </span>
            {selectedToken ? (
              <div className="flex items-center gap-1">
                <IconWithFallback
                  src={loadIconImage(selectedToken.logoURI, mode)}
                  className="border-solid dark:border-black-2 border-white
                          border-[2px] rounded-full h-[25px] w-[25px]"
                />
                <span
                  className="text-sm text-text-lightmode-secondary
                 dark:text-text-darkmode-secondary whitespace-nowrap"
                >
                  {amountToken} {selectedToken?.symbol}
                </span>
              </div>
            ) : (
              <span className="text-sm text-text-lightmode-secondary dark:text-text-darkmode-secondary">
                No token selected
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-lightmode-secondary dark:text-text-darkmode-secondary">
              3. Add Timeframe
            </span>
            <span className="text-sm text-text-lightmode-secondary dark:text-text-darkmode-secondary">
              {selectedTimeframe || 'No timeframe selected'}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
