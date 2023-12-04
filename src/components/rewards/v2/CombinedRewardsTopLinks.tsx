import React, { ReactNode } from 'react'
import tw, { TwStyle } from 'twin.macro'

interface CombinedRewardsTopLinks {
  containerStyles?: TwStyle[]
  children?: ReactNode | ReactNode[]
}
function CombinedRewardsTopLinks({ containerStyles, children }: CombinedRewardsTopLinks): JSX.Element {
  return (
    <div css={[tw`flex gap-4 w-full items-center justify-start`].concat(containerStyles ?? [])}>{children}</div>
  )
}

export default CombinedRewardsTopLinks
