import { loadIconImage } from '@/utils/misc'
import { IconWithFallback } from '../common/IconWithFallback'
import { RewardInfo, TokenListToken, useDarkMode, useConnectionConfig, usePriceFeedFarm } from '@/context'
import { AccordionContent, AccordionItem, AccordionTrigger, Button } from 'gfx-component-lib'
import { useBoostedRewards } from '@/context/boostedRewardsContext'
import { GAMMAPool } from '@/types/gamma'
import { PublicKey } from '@solana/web3.js'
import { useEffect, useMemo } from 'react'
import { useState } from 'react'
import BigNumber from 'bignumber.js'
import { numberFormatter } from '@/utils'
import { BoostedRewardInfo, claimRewards } from '@/web3/Farm'
import useTransaction from '@/hooks/useTransaction'
import { useWallet } from '@solana/wallet-adapter-react'

export function ClaimSinglePoolBoostedReward({ pool }: { pool: GAMMAPool }) {
  const { mode } = useDarkMode()
  const { getActiveRewardByPoolId, getClaimableRewardByPoolId } = useBoostedRewards()

  const [activeReward, setActiveReward] = useState<{
    publicKey: PublicKey
    rewardInfo: RewardInfo
    token: TokenListToken
    pricePerDay: BigNumber
  } | null>(null)

  const [claimableReward, setClaimableReward] = useState<
    | (BoostedRewardInfo & { claimableAmount: BigNumber; claimableAmountUsd: BigNumber; token: TokenListToken })
    | null
  >(null)

  const [sendingTransaction, setSendingTransaction] = useState(false)
  const { sendTransaction, createTransactionBuilder } = useTransaction()
  const { connection } = useConnectionConfig()
  const { wallet } = useWallet()
  const { GammaProgram } = usePriceFeedFarm()
  const userPublicKey = useMemo(() => wallet?.adapter?.publicKey, [wallet?.adapter, wallet?.adapter?.publicKey])

  useEffect(() => {
    getActiveRewardByPoolId(new PublicKey(pool.id)).then((reward) => setActiveReward(reward))
    getClaimableRewardByPoolId(new PublicKey(pool.id)).then((reward) => setClaimableReward(reward))
  }, [getActiveRewardByPoolId, getClaimableRewardByPoolId, pool.id])

  if (!activeReward) return null

  const handleClaimReward = async () => {
    try {
      setSendingTransaction(true)
      const txBuilder = createTransactionBuilder()

      const tx = await claimRewards(GammaProgram, userPublicKey, connection, claimableReward)
      txBuilder.add(tx)

      const { success } = await sendTransaction(
        txBuilder,
        {
          // eslint-disable-next-line max-len
          successMessage: `You claimed ${claimableReward.claimableAmountUsd.toNumber()} in rewards`
        },
        undefined,
        undefined,
        true
      )
      console.log('ClaimAllRewardsResponse', success)
      if (!success) {
        //off(connectionId)
        console.log('An error occurred while claiming rewards!')
      }
    } catch (e) {
      console.log('An error occurred while claiming rewards.', e)
    }
    setSendingTransaction(false)
  }

  return (
    <div className="w-full border-transparent bg-gradient-to-r from-[#F7931A] to-[#C31AE3] p-[1px] rounded-[4px]">
      <AccordionItem value="boosted-rewards" className="dark:bg-black-1 bg-grey-5 rounded-[4px]">
        <AccordionTrigger>
          <h4 className="text-primary-gradient">Boosted Rewards</h4>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-[10px]">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-[5px]">
                <IconWithFallback
                  src={loadIconImage(activeReward.token.logoURI, mode)}
                  className="border-solid dark:border-black-2 border-white
                          border-[2px] rounded-full h-[25px] w-[25px]"
                />
                <p
                  className="font-display font-semibold text-[15px] 
          text-text-lightmode-primary dark:text-text-darkmode-primary"
                >
                  {activeReward.token.symbol}
                </p>
              </div>
              <p
                className="font-display font-semibold text-[15px] 
        text-text-lightmode-secondary dark:text-text-darkmode-secondary"
              >
                {numberFormatter(activeReward.pricePerDay.toNumber())} {activeReward.token.symbol} / day
              </p>
            </div>
            {activeReward && claimableReward && (
              <Button
                className="w-full py-[5px] px-[10px] 
        border-[1px] border-transparent bg-gradient-to-r from-[#F7931A] to-[#C31AE3] p-[1px]
      "
                colorScheme={'blue'}
                variant={'outline'}
                onClick={handleClaimReward}
                isLoading={sendingTransaction}
              >
                <div
                  className="bg-white dark:bg-black-1 h-full w-full rounded-[999px] 
        flex items-center justify-center"
                >
                  Claim ${numberFormatter(claimableReward.claimableAmountUsd.toNumber())}
                </div>
              </Button>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </div>
  )
}
