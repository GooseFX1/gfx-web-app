import { FC, ReactElement } from 'react'
import { useDarkMode, useGamma } from '@/context'
import { Icon } from 'gfx-component-lib'
import { bigNumberFormatter, loadIconImage } from '@/utils'
import BigNumber from 'bignumber.js'

export const MyPositionStats: FC = (): ReactElement => {
  const { selectedCard } = useGamma()
  const { mode } = useDarkMode()

  if (!selectedCard || !selectedCard.hasDeposit) return null

  return (
    <>
      <div className="flex justify-between mb-2">
        <span
          className={`!text-regular font-semibold dark:text-text-darkmode-secondary
               text-text-lightmode-secondary
              `}
        >
          Est. 24H Fees
        </span>
        <span className="!text-regular font-semibold dark:text-grey-8 text-black-4">
          ${bigNumberFormatter(new BigNumber(selectedCard.userLpPosition?.stats?.daily?.feesUSD))}
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
          <Icon
            src={loadIconImage(selectedCard.mintA.logoURI, mode)} size={'sm'}/>
          {bigNumberFormatter(new BigNumber(selectedCard.userLpPosition.uiValueA))}
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
          <Icon src={loadIconImage(selectedCard.mintB.logoURI, mode)} size={'sm'}/>
          {bigNumberFormatter(new BigNumber(selectedCard.userLpPosition.uiValueB))}
        </span>
      </div>
    </>
  )
}
