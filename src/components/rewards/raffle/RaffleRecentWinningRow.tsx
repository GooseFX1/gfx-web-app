import React, { FC, ReactElement } from 'react'

const RecentWinningRow: FC<{ winning }> = ({ winning }): ReactElement => (
  <div tw="flex h-[47px] mt-3.5 items-center">
    <div>
      <img src={`/img/crypto/${winning.currency}.svg`} tw="h-10 w-10" />
    </div>
    <div tw="flex flex-col justify-center ml-3 ">
      <div tw="text-black-4 text-average font-semibold dark:text-grey-5 text-black-4">
        {winning.amount.toLocaleString()} {winning.currency}
      </div>
      <div tw="text-grey-1 text-xs text-regular font-semibold dark:text-grey-2 text-grey-1">{winning.date}</div>
    </div>

    <div tw="ml-auto">
      <img src="/img/assets/Aggregator/Solscan.svg" className="solscan" />
    </div>
  </div>
)
export default RecentWinningRow
