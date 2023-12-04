import React, { ReactNode } from 'react'
import tw, { TwStyle } from 'twin.macro'

interface CombinedRewardsTopLinks {
  containerStyles?: TwStyle[]
  children?: ReactNode | ReactNode[]
}
function CombinedRewardsTopLinks({ containerStyles, children }: CombinedRewardsTopLinks): JSX.Element {
  return (
    <div
      css={[tw`flex gap-4 w-full items-center justify-between pr-10 min-md:pr-0`].concat(containerStyles ?? [])}
    >
      {children}
    </div>
  )
}

export default CombinedRewardsTopLinks
