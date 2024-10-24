import { useDarkMode, useGamma } from '@/context'
import { Badge, Button, cn, Icon } from 'gfx-component-lib'
import { FC, ReactElement } from 'react'
import { PoolStats } from './PoolStats'
import { GAMMAPoolWithUserLiquidity } from '@/types/gamma'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { loadIconImage } from '@/utils'

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
        `h-[207px] w-full border 
        border-solid dark:border-black-4 border-grey-4 bg-white dark:bg-black-2 p-2.5 rounded-[8px]`,
        className
      )}
    >
      <div className="flex flex-row justify-between mb-2.5 items-center">
        <div className="flex relative">
          <Icon
            src={loadIconImage(pool?.mintA?.logoURI, mode)}
            size="lg"
            className={'border-solid dark:border-black-2 border-white border-[3px] rounded-full'}
          />
          <Icon
            src={loadIconImage(pool?.mintB?.logoURI, mode)}
            size="lg"
            className={
              'absolute left-[30px] border-solid dark:border-black-2 border-white border-[3px] rounded-full'
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
        <Icon src={`img/assets/farm_${pool.pool_type}.svg`} size="sm" className="ml-1.5" />
        {pool.poolCreator == base58PublicKey && (
          <Badge size="sm" variant="default">
            Owner
          </Badge>
        )}
      </div>
      <PoolStats pool={pool} />
    </div>
  )
}

export default FarmCard