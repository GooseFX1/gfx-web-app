import { FC } from 'react'
import { IconWithFallback } from '@/components/common/IconWithFallback'
import RewardsClose from '@/assets/rewards_close.svg?react'
import useBreakPoint from '@/hooks/useBreakPoint'
import useBoolean from '@/hooks/useBoolean'
import { useConnectionConfig } from '@/context'
import { useDarkMode } from '@/context'

const JtoRewards: FC = () => {
  const { userCache, updateUserCache } = useConnectionConfig()
  const { isMobile } = useBreakPoint()
  const { mode } = useDarkMode()
  
  const [showBanner, setShowBanner] = useBoolean(userCache.gamma.jtoRewardsBanner !== false)

  const handleCloseJtoRewardsBanner = () => {
    setShowBanner.off()
    updateUserCache({
      gamma: {
        ...userCache.gamma,
        jtoRewardsBanner: false
      }
    })
  }

  return showBanner ? (
    <div className={`px-5 pt-5 max-sm:px-2.5 max-sm:pt-3.75 max-sm:pb-0`}>
      <div
        className={`relative flex ${
          isMobile ? '' : 'gap-7 items-center'
        } w-full p-4 rounded-[4px] bg-white dark:bg-black-2
            border border-solid border-grey-1 dark:border-grey-8`}
      >
        {!isMobile && (
          <IconWithFallback
            src={`/img/assets/jto-rewards-${mode}.svg`}
            alt="Boosted Rewards"
            className="min-h-[95px] min-w-[95px] max-h-[95px] max-w-[95px] h-[95px] w-[95px]"
          />
        )}
        <div className={
          isMobile ? 'max-sm:flex-col' : 'gap-7 items-center'
        }>
          <h2 className="text-primary-gradient mb-3 mr-5 max-sm:order-first">
            Earn 10K $JTO and 300K $GOFX for 30D
          </h2>
          <div className={isMobile ? 'max-sm:flex max-sm:items-center' : ''}>
            {isMobile && (
              <IconWithFallback
                src={`/img/assets/jto-rewards-${mode}.svg`}
                alt="Boosted Rewards"
                className="min-h-[95px] min-w-[95px] max-h-[95px] max-w-[95px] h-[95px] w-[95px]"
              />
            )}
            <p className="text-black-4 dark:text-grey-8 max-sm:ml-4">
                Add liquidity to the SOL-JITOSOL pool and earn extra $JTO for the next 30 days. Deposit to start
                earning today!
            </p>
          </div>
        </div>

        <RewardsClose
          className={`absolute right-2 top-[10px] h-[12px] w-[12px] stroke-border-lightmode-primary
             dark:stroke-border-darkmode-primary cursor-pointer`}
          onClick={handleCloseJtoRewardsBanner}
        />
      </div>
    </div>
  ) : null
}

export default JtoRewards
