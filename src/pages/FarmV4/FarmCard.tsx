import { useDarkMode, useGamma } from '@/context'
import { Badge, Button, cn, Icon } from 'gfx-component-lib'
import { FC, ReactElement } from 'react'
import { PoolStats } from './PoolStats'
import { GAMMAPool } from '@/types/gamma'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { loadBackUpImage, loadUriImage } from '@/pages/FarmV4/Step2'

const FarmCard: FC<{
  pool: GAMMAPool
  className?: string
}> = ({ pool, className, ...props }): ReactElement => {
  const { setOpenDepositWithdrawSlider, setSelectedCard, userLiquidityCache } = useGamma()
  const { base58PublicKey } = useWalletBalance()
  const { mode } = useDarkMode()
  const userDeposit = userLiquidityCache[pool.id]
  const hasDeposit = userDeposit != null
  //TODO : once we can detect user claim
  const canClaim = false
  return (
    <div
      {...props}
      className={cn(
        `h-[207px] w-full border 
        border-solid dark:border-black-4 border-grey-4 bg-white dark:bg-black-2 p-2.5 rounded-[8px]`,
        className
      )}
    >
      <div className="flex flex-row justify-between mb-2.5">
        <div className="flex relative">
          <Icon
            src={loadUriImage(pool.mintA.logoURI) ? pool.mintA.logoURI : loadBackUpImage(pool.mintA.symbol, mode)}
            size="lg"
            className={'border-solid dark:border-black-2 border-white border-[3px] rounded-full'}
          />
          <Icon
            src={loadUriImage(pool.mintB.logoURI) ? pool.mintB.logoURI : loadBackUpImage(pool.mintB.symbol, mode)}
            size="lg"
            className={
              'absolute left-[30px] border-solid dark:border-black-2 border-white border-[3px] rounded-full'
            }
          />
        </div>
        {canClaim && <Button
          onClick={() => {
            setSelectedCard(pool)
            setOpenDepositWithdrawSlider(true)
          }}
          variant={'outline'}
          colorScheme={'secondaryGradient'}
        >
          Claim
        </Button>}

        <Button
          className="cursor-pointer bg-blue-1 text-white h-[30px]"
          variant={'secondary'}
          onClick={() => {
            setSelectedCard(pool)
            setOpenDepositWithdrawSlider(true)
          }}
        >
          {!hasDeposit ? 'Deposit' : 'Withdraw'}
        </Button>
      </div>
      <div
        className="flex flex-row items-center text-average font-semibold font-poppins 
            dark:text-grey-8 text-black-4 mb-2"
      >
        {`${pool.mintA.symbol} - ${pool.mintB.symbol}`}
        <Icon src={`img/assets/farm_${pool.pool_type}.svg`} size="sm" className="ml-1.5" />
        {pool.config.fundOwner == base58PublicKey && (
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