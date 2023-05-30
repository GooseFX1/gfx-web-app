import React, { useCallback, ReactElement } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { GradientText } from '../components/GradientText'
import { Button } from '../components/Button'
import { useDarkMode } from '../context'
import { GFX_LINK } from '../styles'
import { SOCIAL_MEDIAS } from '../constants'
import { useHistory } from 'react-router-dom'

const WRAPPER = styled.div`
  font-family: Montserrat !important;
  ${tw``}
`

export const ComingSoon = (): ReactElement => {
  const history = useHistory()
  const { mode } = useDarkMode()

  const handleRelocateToWithdraw = useCallback(() => history.push('/withdraw'), [history])

  return (
    <WRAPPER tw="h-[100vh] w-full flex flex-col items-center justify-center">
      <GradientText text={'SSL V3'} fontSize={28} fontWeight={600} />
      <div tw="dark:text-grey-5 mt-2 text-black-4 text-lg font-semibold">Coming Soon...</div>

      <img tw="mt-4 w-[579px] h-[361px]" src={`/img/assets/coming-soon-farm-${mode}.svg`} />

      <div tw="w-[726px] dark:text-grey-5 mt-4 text-black-4 text-average font-semibold text-center">
        SSL V1 Pools have been deprecated, please make sure to withdraw your funds.{' '}
        <GFX_LINK tw="text-average" href={SOCIAL_MEDIAS['twitter']} target={'_blank'} rel="noreferrer">
          Follow us
        </GFX_LINK>{' '}
        for more updates!
      </div>
      <div>
        <Button
          height="40px"
          width="180px"
          loading={false}
          onClick={handleRelocateToWithdraw}
          cssStyle={tw`bg-blue-1 rounded-circle border-0 mt-[32px]`}
          disabled={false}
        >
          {' '}
          <span tw="font-semibold text-regular">Withdraw funds</span>
        </Button>
      </div>
    </WRAPPER>
  )
}
