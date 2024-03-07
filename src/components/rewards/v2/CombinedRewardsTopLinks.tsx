import React, { ReactNode } from 'react'
import tw, { TwStyle } from 'twin.macro'
import Button from '../../twComponents/Button'
import { useRewardToggle } from '../../../context'

interface CombinedRewardsTopLinks {
  containerStyles?: TwStyle[]
  children?: ReactNode | ReactNode[]
}
function CombinedRewardsTopLinks({ containerStyles, children }: CombinedRewardsTopLinks): JSX.Element {
  const { rewardToggle } = useRewardToggle()

  return (
    <div css={[tw`flex gap-4 w-full items-center justify-between `].concat(containerStyles ?? [])}>
      <div css={[tw`flex gap-4 w-full items-center justify-between`]}>{children}</div>
      <Button onClick={() => rewardToggle(false)} cssClasses={[tw`min-md:hidden`]}>
        <img css={[tw`h-7.5 w-7.5`]} src={'/img/assets/close_button.svg'} alt={'rewards-close-button'} />
      </Button>
    </div>
  )
}

export default CombinedRewardsTopLinks
