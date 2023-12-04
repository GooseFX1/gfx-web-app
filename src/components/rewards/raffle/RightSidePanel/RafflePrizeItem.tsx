import React, { FC } from 'react'
import tw from 'twin.macro'
import { numberFormatter } from '../../../../utils'
interface PrizeItemProps {
  prizeAmount: number
  tokenImage: string
  position: string
}
const PrizeItem: FC<PrizeItemProps> = ({ prizeAmount, tokenImage, position }) => (
  <div tw="flex flex-1 flex-col items-center min-md:gap-2.5 gap-1.25">
    <div tw="w-10 h-10 min-md:h-15 min-md:w-15 rounded-full  bg-black-1 relative flex">
      <img css={[tw`m-auto `]} src={tokenImage} />
      <img
        css={[tw`w-[21px] h-[24px] min-md:w-[31px] min-md:h-[35px] absolute top-[-8px] left-[-8px]`]}
        src={`/img/assets/win_${position}.svg`}
      />
    </div>
    <div css={[tw`flex min-md:flex-col items-center`]}>
      <p tw="text-white text-regular font-semibold ">{numberFormatter(prizeAmount)}</p>&nbsp;
      <p tw="text-white text-regular font-semibold">{'GOFX'}</p>
    </div>
  </div>
)
export default PrizeItem
