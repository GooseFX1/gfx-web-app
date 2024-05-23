import React, { FC } from 'react'
import { useDarkMode } from '../context'
import tw from 'twin.macro'
import 'styled-components/macro'
import { GFX_LINK } from '../styles'
import { SOCIAL_MEDIAS } from '../constants'

const Maintenance: FC = () => {
  const { mode } = useDarkMode()

  return (
    <div css={[tw`w-[100vw] h-[calc(100vh - 58px)] flex flex-col items-center justify-center`]}>
      <img css={[tw`sm:w-[80vw]`]} src={`/img/assets/maintenance_${mode}.svg`} alt="" />

      <div css={[tw`text-center mt-[32px]`]}>
        <h1 css={[tw`font-bold text-lg-1 dark:text-grey-5 text-black-4 sm:text-lg`]}>
          Sorry, We Will Be Back Soon...
        </h1>
        <p css={[tw`w-[720px] text-regular text-grey-1 sm:w-[80vw]`]}>
          We are performing some updates and maintenance at the moment. We should be back up soon! If you need to
          reach us, you can always contact us on <GFX_LINK href={SOCIAL_MEDIAS['twitter']}>X</GFX_LINK> or{' '}
          <GFX_LINK href={SOCIAL_MEDIAS['discord']}>Discord</GFX_LINK>. All funds are SAFU!
        </p>
      </div>
    </div>
  )
}
export default Maintenance
