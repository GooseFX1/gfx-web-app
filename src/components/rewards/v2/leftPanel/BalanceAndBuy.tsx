import { TokenAmount } from '@solana/web3.js'
import tw from 'twin.macro'
import { numberFormatter } from '../../../../utils'
import Button from '../../../twComponents/Button'
import React from 'react'
import useRewards from '../../../../context/rewardsContext'

export default function RewardsWalletBalanceAndBuyGofx({
  userGoFxBalance
}: {
  userGoFxBalance: TokenAmount
}): JSX.Element {
  const { gofxValue } = useRewards()
  return (
    <div css={[tw`flex justify-between w-full items-center order-2 min-md:order-1`]}>
      <div css={[tw`flex flex-col gap-1.5`]}>
        <div css={[tw`flex flex-wrap items-center`]}>
          <p css={[tw`mb-0 text-regular min-md:text-average font-semibold text-grey-1 dark:text-grey-2 mb-0 `]}>
            Wallet Balance:&nbsp;
          </p>
          <p
            css={[
              tw`mb-0 text-average font-semibold text-grey-2 dark:text-grey-1 whitespace-nowrap`,
              userGoFxBalance.uiAmount > 0 && tw`dark:text-grey-5 text-black-4`
            ]}
          >
            {numberFormatter(userGoFxBalance.uiAmount)} GOFX
          </p>
        </div>
        <div css={[tw`flex flex-wrap items-center`]}>
          <p css={[tw`mb-0 text-regular min-md:text-average font-semibold text-grey-1 dark:text-grey-2 mb-0 `]}>
            ≈ USD Value:&nbsp;
          </p>
          <p
            css={[
              tw`mb-0 text-average font-semibold text-grey-2 dark:text-grey-1`,
              userGoFxBalance.uiAmount > 0 && tw`dark:text-grey-5 text-black-4`
            ]}
          >
            (${numberFormatter(gofxValue * userGoFxBalance.uiAmount, 2)})
          </p>
        </div>
      </div>

      <Button
        onClick={() => window.open('https://jup.ag/swap/USDC-GOFX', '_blank')}
        cssClasses={[
          tw`ml-auto h-[40px] font-bold bg-gradient-to-r from-secondary-gradient-1 to-secondary-gradient-2 text-white
      min-w-[122px] min-md:py-2.5 py-1.875 px-2.5 min-md:px-1.5 box-border`
        ]}
      >
        Buy GOFX now!
      </Button>
    </div>
  )
}
