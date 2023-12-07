import React, { ReactElement } from 'react'
import tw from 'twin.macro'
import { Connect } from '../../../layouts'
import { useDarkMode } from '../../../context'

const RaffleForWalletNotConnected = (): ReactElement => {
  const { mode } = useDarkMode()
  return (
    <div tw="flex flex-col">
      <div css={[tw`mt-10 flex items-center `]}>
        <img src={`/img/assets/rewardsProgram${mode}.svg`} />
        <div tw="ml-4 font-semibold !text-lg dark:text-grey-5 text-black-4">
          Start earning points and start winning!
        </div>
      </div>
      <div tw="mt-5">
        <Connect customButtonStyle={[tw`w-[520px] !max-w-[520px] !h-[40px]`]} />
      </div>
      <div tw="mt-5 text-regular dark:text-grey-2 text-grey-1 font-semibold">
        To generate points start by trading on our perps platform. The more transactions you do, the more chances
        you have to win our weekly prizes.
      </div>
    </div>
  )
}

export default RaffleForWalletNotConnected
