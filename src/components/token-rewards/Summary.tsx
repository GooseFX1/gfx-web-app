import { GAMMAPool } from '@/types/gamma'
import { IconWithFallback } from '../common/IconWithFallback'
import { loadIconImage, numberFormatter } from '@/utils'
import { useConnectionConfig, usePriceFeedFarm, useDarkMode } from '@/context'
import { JupToken } from '@/pages/FarmV4/constants'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import Decimal from 'decimal.js'
import { Button, Icon } from 'gfx-component-lib'
import useBreakPoint from '@/hooks/useBreakPoint'
import { createTokenRewards } from '@/web3/Farm'
import useTransaction from '@/hooks/useTransaction'
import { forceCronUpdateWithConnectionAndTxSig } from '@/api/gamma'
import { useWallet } from '@solana/wallet-adapter-react'

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
  const [sendingTransaction, setSendingTransaction] = useState(false)
  const { sendTransaction, createTransactionBuilder } = useTransaction()
  const { wallet } = useWallet()
  const { connection } = useConnectionConfig()
  const { GammaProgram } = usePriceFeedFarm()
  const userPublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])

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

  const handleAddTokenRewards = async () => {
    try {
      setSendingTransaction(true)
      const txBuilder = createTransactionBuilder()
      const tx = await createTokenRewards(
        GammaProgram,
        selectedPool.id,
        startDate,
        endDate,
        amountToken,
        selectedToken,
        userPublicKey
      )
      txBuilder.add(tx)
      // eslint-disable-next-line max-len
      const { success, txSig } = await sendTransaction(txBuilder, {
        // eslint-disable-next-line max-len
        successMessage: `You successfully created token rewards`
      })
      console.log('SwapResponse', success)
      if (!success) {
        //off(connectionId)
        console.log('An error occurred while Swapping!')
      } else {
        await forceCronUpdateWithConnectionAndTxSig(connection, txSig)
      }
    } catch (e) {
      console.log('An error occurred while depositing.', e)
    }
    setSendingTransaction(false)
  }

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
              <Icon src={'/img/assets/Stepper-1.svg'} className="w-[22px] h-[22px] min-w-[22px] min-h-[22px]" />
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
              {activeStep >= 2 ? (
                <Icon src={'/img/assets/Stepper-2.svg'} className="w-[22px] h-[22px] min-w-[22px] min-h-[22px]" />
              ) : (
                <Icon
                  src={'/img/assets/Stepper-2-inactive.svg'}
                  className="w-[22px] h-[22px] min-w-[22px] min-h-[22px]"
                />
              )}
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
              {activeStep >= 3 ? (
                <Icon src={'/img/assets/Stepper-3.svg'} className="w-[22px] h-[22px] min-w-[22px] min-h-[22px]" />
              ) : (
                <Icon
                  src={'/img/assets/Stepper-3-inactive.svg'}
                  className="w-[22px] h-[22px] min-w-[22px] min-h-[22px]"
                />
              )}
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
            <Button
              className=" w-max mt-4"
              colorScheme={'blue'}
              variant={'primary'}
              onClick={handleAddTokenRewards}
              isLoading={sendingTransaction}
            >
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
