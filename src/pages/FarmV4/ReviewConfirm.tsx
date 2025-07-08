import { useGamma } from '@/context'
import { FC, ReactElement, useMemo } from 'react'
import { Container, Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'
import DepositWithdrawLabel from './DepositWithdrawLabel'
import { bigNumberFormatter, numberFormatter } from '@/utils'
import { useWalletBalance } from '@/context/walletBalanceContext'
import BigNumber from 'bignumber.js'
import { useBoostedRewards } from '@/context/boostedRewardsContext'
import { getPoolValuesByRange } from './FarmRow'
import { PublicKey } from '@solana/web3.js'
import { useKamino } from '@/context/kaminoContext'

export const ReviewConfirm: FC<{
  tokenAActionValue: string
  tokenBActionValue: string
  isDeposit: boolean
}> = ({ tokenAActionValue, tokenBActionValue, isDeposit }): ReactElement => {
  const { selectedCard, referralDetails, viewRange } = useGamma()
  const { balance } = useWalletBalance()
  const { getActiveRewardByPoolId } = useBoostedRewards()
  const { apyForPool } = useKamino()
  const depositValue = useMemo(() => {
    const depositAValue = new BigNumber(balance[selectedCard?.mintA?.address]?.price).multipliedBy(
      tokenAActionValue
    )
    const depositBValue = new BigNumber(balance[selectedCard?.mintB?.address]?.price).multipliedBy(
      tokenBActionValue
    )

    return depositAValue.plus(depositBValue)
  }, [balance, selectedCard, tokenBActionValue, tokenAActionValue])
 
  const lendingApy = useMemo(
    () =>
      selectedCard?.mintA?.address && selectedCard?.mintB?.address
        ? apyForPool(selectedCard.mintA.address, selectedCard.mintB.address)
        : [],
    [selectedCard, apyForPool]
  )
  const lendingApySum = useMemo(
    () => lendingApy.reduce((acc, curr) => acc + curr.apy, 0),
    [lendingApy]
  )

  const activeReward = useMemo(
    () => selectedCard?.id ? getActiveRewardByPoolId(new PublicKey(selectedCard.id)) : [],
    [selectedCard, getActiveRewardByPoolId]
  )

  const activeRewardsAmount = useMemo(
    () =>
      activeReward?.reduce(
        (acc, curr) => acc.plus(curr.pricePerDayUsd),
        new BigNumber(0)
      ) || new BigNumber(0),
    [activeReward]
  )

  const activeRewardsApr = useMemo(
    () =>
      selectedCard?.tvl && activeRewardsAmount
        ? activeRewardsAmount
            .div(selectedCard.tvl)
            .multipliedBy(100)
            .multipliedBy(365)
        : new BigNumber(0),
    [activeRewardsAmount, selectedCard]
  )

  const { tradeAPR } = useMemo(
    () => selectedCard ? getPoolValuesByRange(selectedCard, viewRange) : { tradeAPR: '0' },
    [selectedCard, viewRange]
  )

  const apr = useMemo(
    () =>
      numberFormatter(
        new BigNumber(tradeAPR)
          .plus(lendingApySum)
          .plus(activeRewardsApr)
          .toNumber()
      ),
    [tradeAPR, lendingApySum, activeRewardsApr, numberFormatter]
  )

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
            {apr}%
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
