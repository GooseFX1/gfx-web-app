import { useGamma } from '@/context'
import { FC, ReactElement, useMemo } from 'react'
import { Container, Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'
import DepositWithdrawLabel from './DepositWithdrawLabel'
import { bigNumberFormatter, numberFormatter } from '@/utils'
import { useWalletBalance } from '@/context/walletBalanceContext'
import BigNumber from 'bignumber.js'

export const ReviewConfirm: FC<{
  tokenAActionValue: string
  tokenBActionValue: string
  isDeposit: boolean
}> = ({ tokenAActionValue, tokenBActionValue, isDeposit }): ReactElement => {
  const { selectedCard, referralDetails } = useGamma()
  const { balance } = useWalletBalance()
  const depositValue = useMemo(() => {
    const depositAValue = new BigNumber(balance[selectedCard?.mintA?.address]?.price).multipliedBy(
      tokenAActionValue
    )
    const depositBValue = new BigNumber(balance[selectedCard?.mintB?.address]?.price).multipliedBy(
      tokenBActionValue
    )

    return depositAValue.plus(depositBValue)
  }, [balance, selectedCard, tokenBActionValue, tokenAActionValue])

  return (
    <>
      <DepositWithdrawLabel text="2. Review and Confirm" />
      <Container colorScheme={'default'} className={'mx-2.5 my-3 p-2.5 w-auto rounded-[4px]'}>
        {referralDetails ? (
          <div className="flex justify-between mb-2">
            <span
              className="!font-regular font-semibold
                        dark:text-grey-2 text-grey-1"
            >
              Referral
            </span>
            <span className={'inline-flex gap-2 !font-regular font-semibold dark:text-grey-8 text-black-4'}>
              {referralDetails.name}
            </span>
          </div>
        ) : null}
        <div className="flex justify-between mb-2">
          <span
            className="!font-regular font-semibold
                        dark:text-grey-2 text-grey-1"
          >
            Est. 24H Fees
          </span>
          <span className="!font-regular font-semibold dark:text-grey-8 text-black-4">
            $
            {numberFormatter(
              Math.max(0, selectedCard?.stats?.daily?.feesUsd) || 0.0,
              new BigNumber(Math.max(0, selectedCard?.stats?.daily?.feesUsd) || 0.0).gt(0) ? 4 : 2
            )}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <Tooltip>
            <TooltipTrigger
              className={`!font-regular !font-semibold dark:text-text-darkmode-secondary
                        text-grey-1 underline decoration-dotted`}
            >
              Pool Fee Rate
            </TooltipTrigger>
            <TooltipContent>
              This is a dynamic fee that can vary between 0.01-10% depending on the token volatility
            </TooltipContent>
          </Tooltip>

          <span className="!font-regular font-semibold dark:text-grey-8 text-black-4">
            {(
              new BigNumber(selectedCard?.latestDynamicFeeRate || 0.0).div(10 ** 4).toNumber() ||
              new BigNumber(selectedCard?.config?.tradeFeeRate || 0.0).div(10 ** 4).toNumber()
            ).toFixed(2)}
            %
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <Tooltip>
            <TooltipTrigger
              className={`!font-regular font-semibold 
                        dark:text-grey-2 text-grey-1 underline decoration-dotted`}
            >
              Total {isDeposit ? 'Deposit' : 'Withdraw'}
            </TooltipTrigger>
            <TooltipContent>This is the sum of your deposits of Token A/B</TooltipContent>
          </Tooltip>
          <span className="!font-regular font-semibold dark:text-grey-8 text-black-4">
            ${bigNumberFormatter(depositValue, depositValue.gt(0) ? 4 : 2)}
          </span>
        </div>
      </Container>
    </>
  )
}
