import React, { FC } from 'react'

const PrizeItem: FC<{ prizeAmount: number; tokenImage: string }> = ({ prizeAmount, tokenImage }) => (
  <div tw="flex flex-col items-center ml-5 mr-5">
    <div tw="h-20 w-20 rounded-full  bg-black-1">
      <img tw="p-2 h-full w-full" src={tokenImage} />
    </div>
    <div tw="text-white text-regular font-semibold mt-2.5">{prizeAmount.toLocaleString()}</div>
    <div tw="text-white text-regular font-semibold">{'GOFX'}</div>
  </div>
)
export default PrizeItem
