import { useDarkMode } from '../../../../context'
import React from 'react'

export default function RewardsLeftPanelHeading(): JSX.Element {
  const { mode } = useDarkMode()

  return (
    <div className={`flex gap-5 mr-auto`}>
      <img className={`w-[35px] h-[35px] min-md:block`}
           src={`/img/mainnav/rewards-${mode}.svg`} height="35px" width="35px" />
      <div className={`flex flex-col gap-[4px] justify-center`}>
        <h2 className={`dark:text-grey-5 text-black-4 text-h4 min-sm:text-h2 font-semibold !mb-0 `}>
          Earn $USDC Daily by Staking $GOFX
        </h2>
      </div>
    </div>
  )
}
