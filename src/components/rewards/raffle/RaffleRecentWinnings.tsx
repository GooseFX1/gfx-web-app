import React, { FC, ReactElement } from 'react'
import RecentWinningRow from './RaffleRecentWinningRow'

const MyRecentWinnings: FC<{ myRecentWinnings }> = ({ myRecentWinnings }): ReactElement => (
  <div tw="flex flex-col pt-2">
    <div tw="flex justify-start text-[18px] font-semibold">My Recent Prizes</div>
    <div tw="overflow-y-auto h-[400px]" className="hideScrollbar">
      {myRecentWinnings?.length &&
        myRecentWinnings.map((winning, index) => <RecentWinningRow key={index} winning={winning} />)}
    </div>
  </div>
)

export default MyRecentWinnings
