import { useGamma } from '@/context'
import { FC, ReactElement, useMemo } from 'react'
import { Container } from 'gfx-component-lib'
import DepositWithdrawLabel from './DepositWithdrawLabel'
import { bigNumberFormatter, numberFormatter } from '@/utils'
import { useWalletBalance } from '@/context/walletBalanceContext'
import BigNumber from 'bignumber.js'

export const ReviewConfirm: FC<{
  tokenAActionValue: string
  tokenBActionValue: string
}> = ({ tokenAActionValue, tokenBActionValue }): ReactElement => {
  const { selectedCard } = useGamma()
  const { balance } = useWalletBalance()

  const depositValue = useMemo(() => {
    const depositAValue = new BigNumber(balance[selectedCard?.mintA?.address]?.price).multipliedBy(tokenAActionValue)
    const depositBValue = new BigNumber(balance[selectedCard?.mintB?.address]?.price).multipliedBy(tokenBActionValue)

    return depositAValue.plus(depositBValue)
  }, [balance, selectedCard, tokenBActionValue, tokenAActionValue])

  return (
    <>
      <DepositWithdrawLabel text="2. Review and Confirm" />
      <Container colorScheme={'default'} className={'mx-2.5 my-3 p-2.5 w-auto rounded-[4px]'}>
        <div className="flex justify-between mb-2">
          <span
            className="!font-regular font-semibold underline
                        dark:text-grey-2 text-grey-1 decoration-dotted"
          >
            Est. 24H Fees
          </span>
          <span className="!font-regular font-semibold dark:text-grey-8 text-black-4">
            ${numberFormatter(selectedCard?.stats?.daily?.feesUSD || 0.00,
            new BigNumber(selectedCard?.stats?.daily?.feesUSD || 0.00).gt(0) ? 4 : 2)}
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span
            className="!font-regular font-semibold dark:text-grey-2 
                        text-grey-1 underline decoration-dotted"
          >
            Pool Fee Rate
          </span>
          <span className="!font-regular font-semibold dark:text-grey-8 text-black-4">
            {bigNumberFormatter(new BigNumber(selectedCard?.config?.protocolFeeRate || 0.00).div(100e3), 2)}%
          </span>
        </div>
        <div className="flex justify-between mb-2">
          <span
            className="!font-regular font-semibold 
                        dark:text-grey-2 text-grey-1 underline decoration-dotted"
          >
            Total Deposit
          </span>
          <span className="!font-regular font-semibold dark:text-grey-8 text-black-4">
            ${bigNumberFormatter(depositValue, depositValue.gt(0) ? 4 : 2)}
          </span>
        </div>
      </Container>
    </>
  )
}
