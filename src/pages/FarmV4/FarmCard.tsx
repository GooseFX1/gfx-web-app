import { useDarkMode, useGamma } from '@/context'
import { Badge, Button, cn, Skeleton } from 'gfx-component-lib'
import { FC, ReactElement } from 'react'
import { PoolStats } from './PoolStats'
import { GAMMAPoolWithUserLiquidity } from '@/types/gamma'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { loadIconImage } from '@/utils'
import { IconWithFallback } from '@/components/common/IconWithFallback'

const FarmCard: FC<{
  pool: GAMMAPoolWithUserLiquidity | undefined
  className?: string
}> = ({ pool, className, ...props }): ReactElement => {
  const { setOpenDepositWithdrawSlider, setSelectedCard } = useGamma()
  const { base58PublicKey } = useWalletBalance()
  const { mode } = useDarkMode()

  // Need to change this as per on chain data, setting to true for testing ui.
  // const canClaim = true

  return (
    <div
      {...props}
      className={cn(
        `h-[210px] w-full border 
        border-solid dark:border-black-4 border-grey-4 bg-white dark:bg-black-2 p-2.5 rounded-[8px]`,
        className
      )}
    >
      <div className="flex flex-row justify-between mb-2.5 items-center">
        <div className="flex relative">
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
          {/* {canClaim && <Button
            onClick={() => setSelectedCard(pool)}
            variant={'outline'}
            colorScheme={'secondaryGradient'}
            className='h-[30px] mr-2.5'
          >
            Claim
          </Button>} */}
          <Button
            className={cn(`cursor-pointer bg-blue-1 text-white h-[30px]`, pool.hasDeposit && 'w-[30px] h-[30px]')}
            variant={'secondary'}
            onClick={() => {
              setSelectedCard(pool)
              setOpenDepositWithdrawSlider(true)
            }}
          >
            {!pool.hasDeposit ? 'Deposit' : '+'}
          </Button>
        </div>
      </div>
      <div
        className="flex flex-row items-center text-average font-semibold font-poppins 
            dark:text-grey-8 text-black-4 mb-2"
      >
        {`${pool?.mintA?.symbol} - ${pool?.mintB?.symbol}`}
        <IconWithFallback src={`img/assets/farm_${pool.pool_type}.svg`} size="sm" className="ml-1.5" />
        {pool.poolCreator == base58PublicKey && (
          <Badge size="sm" variant="default" className='h-5.5'>
            Owner
          </Badge>
        )}
      </div>
      <PoolStats pool={pool} />
    </div>
  )
}

export default FarmCard

export const FarmCardLoader: FC<{className?:string}> = ({className}) => <div className={cn(`
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