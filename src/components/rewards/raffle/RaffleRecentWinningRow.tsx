import React, { FC, ReactElement } from 'react'
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import tw from 'twin.macro'
import { numberFormatter } from '../../../utils'

const RecentWinningRow: FC<{ winning }> = ({ winning }): ReactElement => (
  <div tw="flex flex-1 h-[47px] items-center gap-3">
    <img src={`/img/crypto/${winning.currency}.svg`} tw="h-10 w-10" />
    <div tw="flex flex-col justify-center">
      <p tw="text-black-4 text-average font-semibold dark:text-grey-5 text-black-4 text-justify">
        {numberFormatter(winning.amount)} {winning.currency}
      </p>
      <p tw="text-grey-1 text-xs text-regular font-semibold dark:text-grey-2 text-grey-1 ">{winning.date}</p>
    </div>

    <img src="/img/assets/Aggregator/Solscan.svg" className="solscan" css={[tw`ml-auto`]} />
  </div>
)
export default RecentWinningRow
