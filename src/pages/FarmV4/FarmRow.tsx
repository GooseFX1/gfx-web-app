import { FC } from 'react'
import { Badge, cn, Icon } from 'gfx-component-lib'
import { useDarkMode, useGamma } from '@/context'
import useBreakpoint from '../../hooks/useBreakPoint'
import { GAMMAPool } from '@/types/gamma'
import { useWalletBalance } from '@/context/walletBalanceContext'
import { numberFormatter } from '@/utils'
import { loadBackUpImage, loadUriImage } from '@/pages/FarmV4/Step2'

const FarmRow: FC<{ pool: GAMMAPool, key: string }> = ({ pool, key }): JSX.Element => {
  const { setSelectedCard, setOpenDepositWithdrawSlider } = useGamma()
  const { isMobile, isTablet, isDesktop } = useBreakpoint()
  const { base58PublicKey } = useWalletBalance()
  const {mode} = useDarkMode()
  return (
    <div
      className={cn(
        `grid grid-flow-col grid-cols-5 dark:bg-black-2 px-2.5 cursor-pointer
      h-15 border border-solid dark:border-black-4 border-grey-4 bg-white rounded-tiny py-3.75 my-3.75`,
        isMobile && `grid-cols-2`,
        isTablet && `grid-cols-4`
      )}
      key={key}
      onClick={() => {
        setSelectedCard(pool)
        setOpenDepositWithdrawSlider(true)
      }}
    >
      <div className="flex flex-row items-center min-w-[210px]">
        <Icon
          src={loadUriImage(pool.mintA.logoURI) ? pool.mintA.logoURI : loadBackUpImage(pool.mintA.symbol, mode)}
          className="border-solid dark:border-black-2 border-white
          border-[2px] rounded-full h-[25px] w-[25px]"
        />
        <Icon
          src={loadUriImage(pool.mintB.logoURI) ? pool.mintB.logoURI : loadBackUpImage(pool.mintB.symbol, mode)}
          className="relative right-[10px] border-solid dark:border-black-2
          border-white border-[2px] rounded-full h-[25px] w-[25px]"
        />
        <div className="font-poppins text-regular font-semibold dark:text-grey-8 text-black-4">
          {pool.mintA.symbol} - {pool.mintB.symbol}
        </div>
        {isDesktop && (
          <div
            className="border border-solid dark:border-black-4 flex items-center
            font-poppins text-tiny font-semibold dark:text-grey-8 text-black-4
            border-grey-1 bg-grey-5 dark:bg-black-2 rounded-[2.5px] w-10 h-[25px] px-1 ml-2"
          >
            0.2%
          </div>
        )}
        {pool.config.fundOwner == base58PublicKey && (
          <Badge size="sm" variant="default" className={'ml-1'}>
            Owner
          </Badge>
        )}
        <Icon src={`img/assets/farm_${pool.pool_type}.svg`} size="sm" className="ml-1.5" />
      </div>
      <div className="flex items-center justify-center text-regular font-semibold dark:text-grey-8 text-black-4">
        {pool.tvl}
      </div>
      {(isTablet || isDesktop) && (
        <div className="flex items-center justify-center text-regular font-semibold dark:text-grey-8 text-black-4">
          {numberFormatter(pool.stats.daily.volumeTokenAUSD + pool.stats.daily.volumeTokenBUSD)}
        </div>
      )}
      {isDesktop && (
        <div className="flex items-center justify-center text-regular font-semibold dark:text-grey-8 text-black-4">
          {numberFormatter(pool.stats.daily.tradeFeesUSD)}
        </div>
      )}
      {(isTablet || isDesktop) && (
        <div className="flex items-center justify-center">
          <Badge variant="default" size={'lg'} className={'to-brand-secondaryGradient-secondary/50'}>
            <span className={'font-poppins font-semibold my-0.5'}>
              {numberFormatter(pool.stats.daily.feesAprUSD)}%
            </span>
          </Badge>
        </div>
      )}
    </div>
  )
}

export default FarmRow
