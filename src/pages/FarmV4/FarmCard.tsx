import { useDarkMode, useGamma } from '@/context'
import { Button, cn, Icon, Skeleton, Tooltip, TooltipContent, TooltipTrigger } from 'gfx-component-lib'
import { FC, ReactElement } from 'react'
import { PoolStats } from './PoolStats'
import { GAMMAPoolWithUserLiquidity } from '@/types/gamma'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { loadIconImage } from '@/utils'
import { IconWithFallback } from '@/components/common/IconWithFallback'
import useBreakPoint from '@/hooks/useBreakPoint'
import { useQuery } from '@tanstack/react-query'
import { QUERY_KEY } from '@/queries/query.helper'
import { useBoostedRewards } from '@/context/boostedRewardsContext'
import { PublicKey } from '@solana/web3.js'

const FarmCard: FC<{
  pool: GAMMAPoolWithUserLiquidity | undefined
  className?: string
  key?: string
}> = ({ pool, className, ...props }): ReactElement => {
  const { updateGammaRoute } = useGamma()
  const { base58PublicKey } = useWalletBalance()
  const { mode } = useDarkMode()
  const { isDesktop } = useBreakPoint()
  const { getActiveRewardByPoolId } = useBoostedRewards()

  const { data: activeReward } = useQuery({
    queryKey: [QUERY_KEY, 'activeReward', pool.id],
    queryFn: () => getActiveRewardByPoolId(new PublicKey(pool.id)),
    enabled: !!pool.id
  })

  // Need to change this as per on chain data, setting to true for testing ui.
  // const canClaim = true

  return (
    <div
      {...props}
      className={cn(
        `h-[210px] w-full border cursor-pointer relative
        border-solid dark:border-black-4 border-grey-4 bg-white dark:bg-black-2 p-2.5 rounded-[8px]`,
        className
      )}
      onClick={() => {
        updateGammaRoute(pool)
      }}
    >
      <div className="flex flex-row justify-between mb-2.5 items-center">
        <div className="flex relative">
          {pool.poolCreator == base58PublicKey && (
            <Tooltip>
              <TooltipTrigger className='absolute h-5 w-5'>
                <Icon
                  src={`/img/assets/owner-${mode}.svg`}
                  alt="pool-owner"
                  size={'sm'}
                  className="absolute bottom-5 right-5 h-5 w-5"
                />
              </TooltipTrigger>
              <TooltipContent>
                <span>You are the owner of this pool</span>
              </TooltipContent>
            </Tooltip>
          )}
          <IconWithFallback
            src={loadIconImage(pool?.mintA?.logoURI, mode)}
            size="lg"
            className={'outline dark:outline-black-2 outline-white outline-[3px] rounded-full'}
          />
          <IconWithFallback
            src={loadIconImage(pool?.mintB?.logoURI, mode)}
            size="lg"
            className={
              'absolute left-[30px] outline dark:outline-black-2 outline-white outline-[3px] rounded-full'
            }
          />
          {/* {canClaim && <span className={'absolute rounded-full bg-red-2 w-3 h-3 top-[-4px] left-[-4px]'} />} */}
        </div>
        <div>
          {isDesktop && (
            <Button
              className={cn(`cursor-pointer bg-blue-1 text-white h-[30px]`, pool.hasDeposit && 'w-[30px] h-[30px]')}
              variant={'secondary'}
              onClick={() => {
                updateGammaRoute(pool)
              }}
            >
              {!pool.hasDeposit ? 'Deposit' : '+'}
            </Button>
          )}
        </div>
      </div>
      <div
        className="flex flex-row items-center text-average font-semibold font-poppins 
            dark:text-grey-8 text-black-4 mb-2 max-sm:text-[13px]"
      >
        {`${pool?.mintA?.symbol} - ${pool?.mintB?.symbol}`}
        {activeReward && activeReward.length > 0 && (
          <Icon
            src={`/img/assets/rewards-icon-${mode}.svg`}
            alt="claim-rewards"
            size={'md'}
            className='ml-2'
          />
        )}
        {/* <IconWithFallback src={`img/assets/farm_${pool.pool_type}.svg`} size="sm" className="ml-1.5" /> */}
      </div>
      <PoolStats pool={pool} />
    </div>
  )
}

export default FarmCard

export const FarmCardLoader: FC<{ className?: string }> = ({ className }) => <div className={cn(`
  w-full max-w-screen sm:max-w-[341px] h-[210px] p-2.5 border  flex gap-2 flex-col
        border-solid dark:border-black-4 border-grey-4 bg-white dark:bg-black-2 rounded-[8px]
`, className)}>
  <div className={'flex w-full'}>
    <div>
      <div className="relative">
        <Skeleton
          className={`w-[40px] h-[40px] rounded-full border-solid dark:border-black-2 border-white border-[3px]
          `}
        />
        <Skeleton
          className={`absolute top-0 left-[19px] w-[40px] h-[40px] rounded-full border-solid 
          dark:border-black-2 border-white border-[3px]`}
        />
      </div>
      <Skeleton className={'rounded-0.5 w-[125px] h-[25px] mt-2 rounded-[2px]'} />
    </div>
    <Skeleton
      className={cn(`cursor-pointer bg-blue-1 text-white h-[30px] w-[75px] rounded-full ml-auto`)} />
  </div>

  <Skeleton className={'rounded-[2px] w-full h-[25px]'} />

  <Skeleton className={'rounded-[2px] w-full h-[25px]'} />

  <Skeleton className={'rounded-[2px] w-full h-[25px]'} />

  <Skeleton className={'rounded-[2px] w-full h-[25px]'} />

</div>