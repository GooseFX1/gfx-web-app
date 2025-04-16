import { loadIconImage } from '@/utils/misc'
import { IconWithFallback } from '../common/IconWithFallback'
import { useDarkMode } from '@/context'
import { AccordionContent, AccordionItem, AccordionTrigger, Icon } from 'gfx-component-lib'
import { useBoostedRewards } from '@/context/boostedRewardsContext'
import { GAMMAPool } from '@/types/gamma'
import { PublicKey } from '@solana/web3.js'
import { numberFormatter } from '@/utils'

export function ClaimSinglePoolBoostedReward({ pool }: { pool: GAMMAPool }) {
  const { mode } = useDarkMode()
  const { getActiveRewardByPoolId } = useBoostedRewards()

  const activeReward = getActiveRewardByPoolId(new PublicKey(pool.id))

  if (!activeReward) return null

  return (
    <div className="w-full border-transparent bg-gradient-to-r from-[#F7931A] to-[#C31AE3] p-[1px] rounded-[4px]">
      <AccordionItem value="boosted-rewards" className="dark:bg-black-1 bg-grey-5 rounded-[4px]">
        <AccordionTrigger>
          <div className="flex flex-row items-center gap-[5px]">
            <Icon src={`/img/assets/rewards-icon-${mode}.svg`} className="h-[14px] w-[14px] mr-2" size="sm" />
            <h4 className="text-primary-gradient">Boosted Rewards</h4>
          </div>
        </AccordionTrigger>
        <AccordionContent>
          <div className="flex flex-col gap-[10px] pt-2">
            {activeReward.map((reward) => (
              <div key={reward.token.address.toString()} className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-[5px]">
                  <IconWithFallback src={loadIconImage(reward.token.logoURI, mode)} className=" rounded-full " />
                  <p
                    className="font-display font-semibold text-[15px] 
                    text-text-lightmode-primary dark:text-text-darkmode-primary"
                  >
                    {reward.token.symbol}
                  </p>
                </div>
                <p
                  className="font-display font-semibold text-[15px] 
                      text-text-lightmode-secondary dark:text-text-darkmode-secondary"
                >
                  {numberFormatter(reward.pricePerDay.toNumber())} {reward.token.symbol} / day
                </p>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </div>
  )
}
