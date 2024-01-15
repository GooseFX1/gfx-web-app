import React, { FC } from 'react'
import tw from 'twin.macro'
import { numberFormatter } from '../../../../utils'
import useBreakPoint from '../../../../hooks/useBreakPoint'
interface PrizeItemProps {
  prizeAmount: number
  tokenImage: string
  position: string
}
const PrizeItem: FC<PrizeItemProps> = ({ prizeAmount, tokenImage, position }) => {
  const { isMobile, isTablet } = useBreakPoint()
  return (
    <div tw="flex flex-1 flex-col items-center min-md:gap-2.5 gap-1.25">
      <div tw="w-10 h-10 min-md:h-15 min-md:w-15 rounded-full  bg-black-1 relative flex">
        <img css={[tw`m-auto `]} src={tokenImage} />
        <img
          css={[tw`w-[21px] h-[24px] min-md:w-[31px] min-md:h-[35px] absolute top-[-8px] left-[-8px]`]}
          src={`/img/assets/win_${position}.svg`}
        />
      </div>
      <div css={[tw`flex min-md:flex-col items-center`]}>
        <h3 tw="text-white  font-semibold ">{numberFormatter(prizeAmount)}</h3>
        {isMobile || isTablet ? <>&nbsp;</> : null}
        <h3 tw="text-white  font-semibold">{'GOFX'}</h3>
      </div>
    </div>
  )
}
export default PrizeItem
