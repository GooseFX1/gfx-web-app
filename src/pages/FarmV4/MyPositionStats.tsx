import { FC, ReactElement } from 'react'
import { useDarkMode, useGamma } from '@/context'
import { bigNumberFormatter, loadIconImage } from '@/utils'
import BigNumber from 'bignumber.js'
import BN from 'bn.js'
import Decimal from 'decimal.js-light'
import { IconWithFallback } from '@/components/common/IconWithFallback'

export const MyPositionStats: FC<{
  withdrawableBalanceA: BN
  withdrawableBalanceB: BN
}> = ({ withdrawableBalanceA, withdrawableBalanceB }): ReactElement => {
  const { selectedCard } = useGamma()
  const { mode } = useDarkMode()

  return (
    <>
      <div className="flex justify-between mb-2">
        <span
          className={`!text-regular font-semibold dark:text-text-darkmode-secondary
               text-text-lightmode-secondary`}
        >
          Est. 24H Fees
        </span>
        <span className="!text-regular font-semibold dark:text-grey-8 text-black-4">
          ${bigNumberFormatter(new BigNumber(selectedCard?.stats?.daily?.feesUSD))}
        </span>
      </div>
      <div className="flex justify-between mb-2">
        <span
          className={`!text-regular font-semibold dark:text-text-darkmode-secondary
               text-text-lightmode-secondary
              `}
        >
          Token A
        </span>
        <span className="!text-regular font-semibold dark:text-grey-8 text-black-4 inline-flex gap-1">
          <IconWithFallback
            src={loadIconImage(selectedCard.mintA.logoURI, mode)}
            size={'sm'}
            className={`border border-solid rounded-circle 
                dark:border-border-darkmode-secondary border-border-lightmode-secondary`}
          />
          {bigNumberFormatter(
            new BigNumber(
              new Decimal(withdrawableBalanceA?.toString())
                .div(Math.pow(10, selectedCard?.mintA?.decimals || 0))
                .toString()
            )
          )}
        </span>
      </div>
      <div className="flex justify-between mb-2">
        <span
          className={`!text-regular font-semibold dark:text-text-darkmode-secondary
               text-text-lightmode-secondary
              `}
        >
          Token B
        </span>
        <span className="!text-regular font-semibold dark:text-grey-8 text-black-4 inline-flex gap-1">
          <IconWithFallback
            src={loadIconImage(selectedCard.mintB.logoURI, mode)}
            size={'sm'}
            className={`border border-solid rounded-circle 
                dark:border-border-darkmode-secondary border-border-lightmode-secondary`}
          />
          {bigNumberFormatter(
            new BigNumber(
              new Decimal(withdrawableBalanceB?.toString())
                .div(Math.pow(10, selectedCard?.mintA?.decimals || 0))
                .toString()
            )
          )}
        </span>
      </div>
    </>
  )
}
