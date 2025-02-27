import { GAMMAPool } from '@/types/gamma'
import { IconWithFallback } from '../common/IconWithFallback'
import { loadIconImage, numberFormatter } from '@/utils'
import { useDarkMode } from '@/context'
import { JupToken } from '@/pages/FarmV4/constants'
import dayjs from 'dayjs'
import { useMemo } from 'react'
import Decimal from 'decimal.js'
import { Button } from 'gfx-component-lib'
import useBreakPoint from '@/hooks/useBreakPoint'

interface SummaryProps {
  selectedPool?: GAMMAPool
  selectedToken?: JupToken
  amountToken?: string
  startDate?: dayjs.Dayjs
  endDate?: dayjs.Dayjs
  key: string
  hideTitle?: boolean
  activeStep?: number
}

export const Summary = ({
  selectedPool,
  selectedToken,
  amountToken,
  startDate,
  endDate,
  hideTitle,
  activeStep
}: SummaryProps) => {
  const { mode } = useDarkMode()
  const { isMobile } = useBreakPoint()

  const estimatedRewardsPerDay = useMemo(() => {
    if (!selectedPool || !selectedToken || !startDate || !endDate) return null

    const days = dayjs(endDate).diff(dayjs(startDate), 'days')
    if (days <= 1) return amountToken

    const totalRewards = numberFormatter(new Decimal(amountToken).div(days).toNumber())
    return totalRewards
  }, [selectedPool, selectedToken, startDate, endDate])

  const { usdValue } = useMemo(() => {
    const returnValue = {
      usdValue: '0.00'
    }
    if (estimatedRewardsPerDay && selectedToken && selectedToken.price) {
      returnValue.usdValue = numberFormatter(
        new Decimal(estimatedRewardsPerDay).mul(selectedToken.price).toNumber()
      )
    }

    return returnValue
  }, [estimatedRewardsPerDay, selectedToken])

  return (
    <div className="w-full h-full flex flex-col">
      {!hideTitle && (
        <h1
          className="mb-6 text-center text-lg font-semibold text-text-lightmode-primary 
      dark:text-text-darkmode-primary"
        >
          Summary
        </h1>
      )}

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span
              className={`flex items-center gap-2 text-[15px] ${
                activeStep >= 1
                  ? 'text-text-lightmode-primary dark:text-text-darkmode-primary'
                  : 'text-text-lightmode-tertiary dark:text-text-darkmode-tertiary'
              }`}
            >
              <div
                className={`flex items-center justify-center w-[22px] h-[22px] 
              text-[15px] rounded-full ${
                activeStep >= 1 ? 'bg-[#A846FF]' : 'bg-text-lightmode-tertiary dark:bg-text-darkmode-tertiary'
              }  text-white text-sm`}
              >
                1
              </div>
              Select Pool
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
                <span
                  className={`w-max text-[15px] font-medium ${
                    activeStep >= 1
                      ? 'text-text-lightmode-primary dark:text-text-darkmode-primary'
                      : 'text-text-lightmode-tertiary dark:text-text-darkmode-tertiary'
                  }`}
                >
                  {selectedPool?.mintA.symbol} - {selectedPool?.mintB.symbol}
                </span>
              </div>
            ) : (
              <span
                className="w-max text-[15px] 
              font-medium text-text-lightmode-tertiary dark:text-text-darkmode-tertiary"
              >
                No pool selected
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span
              className={`flex items-center gap-2 text-[15px] ${
                activeStep >= 2
                  ? 'text-text-lightmode-primary dark:text-text-darkmode-primary'
                  : 'text-text-lightmode-tertiary dark:text-text-darkmode-tertiary'
              }`}
            >
              <div
                className={`flex items-center justify-center w-[22px] h-[22px] 
              text-[15px] rounded-full ${
                activeStep >= 2 ? 'bg-[#A846FF]' : 'bg-text-lightmode-tertiary dark:bg-text-darkmode-tertiary'
              }  text-white text-sm`}
              >
                2
              </div>
              Select Reward Tokens
            </span>
            {selectedToken ? (
              <div className="flex items-center gap-1">
                <IconWithFallback
                  src={loadIconImage(selectedToken.logoURI, mode)}
                  className="border-solid dark:border-black-2 border-white
                          border-[2px] rounded-full h-[25px] w-[25px]"
                />
                <span
                  className={`text-[15px] ${
                    activeStep >= 2
                      ? 'text-text-lightmode-primary dark:text-text-darkmode-primary'
                      : 'text-text-lightmode-tertiary dark:text-text-darkmode-tertiary'
                  }`}
                >
                  {amountToken} {selectedToken?.symbol}
                </span>
              </div>
            ) : (
              <span className="text-[15px] text-text-lightmode-tertiary dark:text-text-darkmode-tertiary">
                No token selected
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span
              className={`flex items-center gap-2 text-[15px] ${
                activeStep >= 3
                  ? 'text-text-lightmode-primary dark:text-text-darkmode-primary'
                  : 'text-text-lightmode-tertiary dark:text-text-darkmode-tertiary'
              }`}
            >
              <div
                className={`flex items-center justify-center w-[22px] h-[22px] 
              text-[15px] rounded-full ${
                activeStep >= 3 ? 'bg-[#A846FF]' : 'bg-text-lightmode-tertiary dark:bg-text-darkmode-tertiary'
              }  text-white text-sm`}
              >
                3
              </div>
              Add Timeframe
            </span>
            {startDate && endDate ? (
              <span
                className={`text-[15px] ${
                  activeStep >= 3
                    ? 'text-text-lightmode-primary dark:text-text-darkmode-primary'
                    : 'text-text-lightmode-tertiary dark:text-text-darkmode-tertiary'
                }`}
              >
                {dayjs(endDate).diff(dayjs(startDate), 'days')} days
              </span>
            ) : (
              <span className="text-[15px] text-text-lightmode-tertiary dark:text-text-darkmode-tertiary">
                No timeframe selected
              </span>
            )}
          </div>
        </div>
        <div className="w-full h-[1px] bg-grey-4"></div>
        {estimatedRewardsPerDay !== null && (
          <>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-[15px]  text-text-lightmode-secondary dark:text-text-darkmode-secondary">
                  Est. Rewards / day
                </span>
                <span className="text-[15px]  text-text-lightmode-secondary dark:text-text-darkmode-secondary">
                  {estimatedRewardsPerDay} {selectedToken?.symbol}
                </span>
              </div>
            </div>
            {usdValue && (
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[15px]  text-text-lightmode-secondary dark:text-text-darkmode-secondary">
                    Est. Total USD Value
                  </span>
                  <span className="text-[15px]  text-text-lightmode-secondary dark:text-text-darkmode-secondary">
                    ~${usdValue}
                  </span>
                </div>
              </div>
            )}
            {isMobile && (
              <p className="text-sm text-text-lightmode-secondary dark:text-text-darkmode-secondary">
                Rewards are locked in once transaction is confirmed. New rewards appear on the platform after they
                have been confirmed on the network.
              </p>
            )}
          </>
        )}
      </div>
      {estimatedRewardsPerDay && (
        <>
          {isMobile && <div className="w-full mt-4 h-[1px] bg-grey-4"></div>}
          <div className="flex justify-end mt-auto">
            <Button className=" w-max mt-4" colorScheme={'blue'} variant={'primary'}>
              Token Rewards
            </Button>
          </div>
          {!isMobile && (
            <p className="text-xs text-text-lightmode-secondary dark:text-text-darkmode-secondary">
              Rewards are locked in once transaction is confirmed. New rewards appear on the platform after they
              have been confirmed on the network.
            </p>
          )}
        </>
      )}
    </div>
  )
}
