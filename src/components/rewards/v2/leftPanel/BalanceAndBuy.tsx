import { TokenAmount } from '@solana/web3.js'
import { numberFormatter } from '../../../../utils'
import React from 'react'
import useRewards from '../../../../context/rewardsContext'
import { Button, cn } from 'gfx-component-lib'

export default function RewardsWalletBalanceAndBuyGofx({
  userGoFxBalance
}: {
  userGoFxBalance: TokenAmount
}): JSX.Element {
  const { gofxValue } = useRewards()
  return (
    <div className={`flex justify-between w-full items-center order-2 min-md:order-first`}>
      <div className={`flex flex-col `}>
        <div className={`flex flex-wrap items-center`}>
          <p className={`mb-0 text-regular min-md:text-average font-semibold text-grey-1 dark:text-grey-2`}>
            Wallet Balance:&nbsp;
          </p>
          <p
            className={cn(
              `mb-0 text-average font-semibold text-grey-2 dark:text-grey-1 whitespace-nowrap`,
              userGoFxBalance.uiAmount > 0 && `dark:text-grey-5 text-black-4`
            )}
          >
            {numberFormatter(userGoFxBalance.uiAmount)} GOFX
          </p>
        </div>
        <div className={`flex flex-wrap items-center`}>
          <p className={`mb-0 text-regular min-md:text-average font-semibold text-grey-1 dark:text-grey-2 `}>
            ≈ USD Value:&nbsp;
          </p>
          <p
            className={cn(
              `mb-0 text-average font-semibold text-grey-2 dark:text-grey-1`,
              userGoFxBalance.uiAmount > 0 && `dark:text-grey-5 text-black-4`
            )}
          >
            (${numberFormatter(gofxValue * userGoFxBalance.uiAmount, 2)})
          </p>
        </div>
      </div>

      <Button
        colorScheme={'primaryGradient'}
        onClick={() => window.open('https://jup.ag/swap/USDC-GOFX', '_blank')}
        className={`ml-auto font-bold
         text-white min-w-[122px] min-md:py-2.5 py-1.875 px-2.5 min-md:px-1.5 box-border`}
        size={'lg'}
      >
        <img src="/img/crypto/GOFX.svg" alt="gofx-tooken" className="h-[26px]" />
        Buy GOFX
      </Button>
    </div>
  )
}
