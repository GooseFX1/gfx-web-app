import React, { ReactElement } from 'react'
import tw from 'twin.macro'
import { useDarkMode } from '../../../context'

const NoPrizesSoFar = (): ReactElement => {
  const { mode } = useDarkMode()
  return (
    <div tw="flex flex-col items-center mt-7.5">
      <img css={[tw`h-[90px] w-[98px]`]} src={`/img/assets/noPrizes${mode}.svg`} />
      <div tw="text-grey-1 text-regular font-semibold text-center mt-5">
        No prices so far, sell, buy and trade NFTs to start <br /> earning points and start wining!
      </div>
    </div>
  )
}
export default NoPrizesSoFar
