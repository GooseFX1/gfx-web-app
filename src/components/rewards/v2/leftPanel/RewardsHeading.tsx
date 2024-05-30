import { useDarkMode } from '../../../../context'
import React from 'react'

export default function RewardsLeftPanelHeading(): JSX.Element {
  const { mode } = useDarkMode()

  return (
    <div className={`flex gap-5 mr-auto`}>
      <img className={`hidden min-md:block`} src={`/img/assets/rewards-${mode}.svg`} height="69px" width="64px" />
      <div className={`flex flex-col gap-[4px] justify-center`}>
        <h2 className={`dark:text-grey-5 text-black-4 text-h3 min-sm:text-h2 font-semibold !mb-0 `}>
          Earn USDC daily by staking your GOFX
        </h2>
        <h3 className={`dark:text-grey-2 text-grey-1 text-h4 min-sm:text-h3 font-semibold !mb-0 `}>
          How much would you like to stake?
        </h3>
      </div>
    </div>
  )
}
