import { FC, useMemo } from 'react'
import { Badge, cn, Icon } from 'gfx-component-lib'
import { useDarkMode, useGamma } from '@/context'
import useBreakpoint from '../../hooks/useBreakPoint'
import { GAMMAPoolWithUserLiquidity } from '@/types/gamma'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { numberFormatter } from '@/utils'
import { loadIconImage } from '@/utils'

const FarmRow: FC<{ pool: GAMMAPoolWithUserLiquidity }> = ({ pool, ...props }): JSX.Element => {
  const { setSelectedCard, setOpenDepositWithdrawSlider } = useGamma()
  const { isMobile, isTablet, isDesktop } = useBreakpoint()
  const { base58PublicKey } = useWalletBalance()
  const { mode } = useDarkMode()

  const formattedTVL = useMemo(() => {
      const liquidity = parseFloat(pool.tvl)
      return liquidity ? numberFormatter(liquidity) : '0.00'
    }, [pool])
  const formattedVolume = useMemo(
    () => numberFormatter(pool.stats.daily.volumeTokenAUSD + pool.stats.daily.volumeTokenBUSD),
    [pool.stats.daily.volumeTokenAUSD, pool.stats.daily.volumeTokenBUSD]
  )
  const formattedFees = useMemo(() => numberFormatter(pool.stats.daily.tradeFeesUSD), [pool.stats.daily.tradeFeesUSD])
  const formattedAPR = useMemo(() => numberFormatter(pool.stats.daily.feesAprUSD), [pool.stats.daily.feesAprUSD])

  return (
    <div
      className={cn(
        `grid grid-flow-col grid-cols-[1.5fr_1fr_1fr_1fr_0.5fr] dark:bg-black-2 px-2.5 cursor-pointer
      h-15 border border-solid dark:border-black-4 border-grey-4 bg-white rounded-tiny py-3.75`,
        isMobile && `grid-cols-[1.5fr_0.5fr]`,
        isTablet && `grid-cols-[1.5fr_1fr_1fr_0.5fr]`
      )}
      {...props}
      onClick={() => {
        setSelectedCard(pool)
        setOpenDepositWithdrawSlider(true)
      }}
    >
      <div className="flex flex-row items-center">
        <Icon
          src={loadIconImage(pool.mintA.logoURI, mode)}
          className="border-solid dark:border-black-2 border-white
          border-[2px] rounded-full h-[25px] w-[25px]"
        />
        <Icon
          src={loadIconImage(pool.mintB.logoURI, mode)}
          className="relative right-[10px] border-solid dark:border-black-2
          border-white border-[2px] rounded-full h-[25px] w-[25px]"
        />
        <div className="font-poppins text-regular font-semibold dark:text-grey-8 text-black-4">
          {pool.mintA.symbol} - {pool.mintB.symbol}
        </div>

        <div
          className="border border-solid dark:border-black-4 flex items-center
          font-poppins text-tiny font-semibold dark:text-grey-8 text-black-4
          border-grey-1 bg-grey-5 dark:bg-black-2 rounded-[2.5px] h-[25px] px-1 ml-2"
        >
          {numberFormatter(0.2)}%
        </div>

        <Icon src={`img/assets/farm_${pool.pool_type}.svg`} size="sm" className="ml-1.5" />
        {pool.poolCreator === base58PublicKey && (
          <Badge size="sm" variant="default" className={'ml-1'}>
            Owner
          </Badge>
        )}
      </div>
      <div className="flex items-center justify-center text-regular font-semibold dark:text-grey-8 text-black-4">
        {formattedTVL}
      </div>
      {(isTablet || isDesktop) && (
        <div className="flex items-center justify-center text-regular font-semibold dark:text-grey-8 text-black-4">
          {formattedVolume}
        </div>
      )}
      {isDesktop && (
        <div className="flex items-center justify-center text-regular font-semibold dark:text-grey-8 text-black-4">
          {formattedFees}
        </div>
      )}
      {(isTablet || isDesktop) && (
        <div className="flex items-center justify-center">
          <Badge variant="default" size={'lg'} className={'to-brand-secondaryGradient-secondary/50'}>
            <span className={'font-poppins font-semibold my-0.5'}>{formattedAPR}%</span>
          </Badge>
        </div>
      )}
    </div>
  )
}

export default FarmRow
