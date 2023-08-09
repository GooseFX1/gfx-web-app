import { FC, useEffect, useState } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import { FarmHeader } from './FarmHeader'
import { usePriceFeedFarm } from '../../context'
import 'styled-components/macro'
import { FarmTable } from './FarmTable'
import { Faqs } from './Faqs'

const WRAPPER = styled.div`
  ${tw`p-5 dark:bg-black-1 bg-grey-5 sm:pt-3.75 sm:pb-3.75 sm:pl-2.5 sm:pr-0`}
  * {
    font-family: Montserrat;
  }
  ${({ theme }) => theme.customScrollBar('0px')};
`

export const Farm: FC = () => {
  const [poolIndex, setPoolIndex] = useState<0 | 1>(0)
  const { refreshTokenData } = usePriceFeedFarm()

  // initial load of all the prices
  useEffect(() => {
    refreshTokenData()
  }, [])

  return (
    <WRAPPER>
      <FarmHeader setPoolIndex={setPoolIndex} />
      <FarmTable poolIndex={poolIndex} setPoolIndex={setPoolIndex} />
      <Faqs />
    </WRAPPER>
  )
}
