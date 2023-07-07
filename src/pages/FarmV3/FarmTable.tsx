/* eslint-disable */
import { FC } from 'react'
import tw, { styled } from 'twin.macro'
import 'styled-components/macro'

const WRAPPER = styled.div``

export const FarmTable: FC = () => {
  return (
    <WRAPPER>
      <div tw="flex flex-row items-end mb-5">
        <img src="/img/assets/Stable_pools.svg" alt="pool-icon" height={67} width={60} tw="mr-5" />
        <div tw="flex flex-col">
          <div tw="text-[25px] font-semibold dark:text-grey-5 text-black-4">Stable Pools</div>
          <div tw="text-regular font-medium text-grey-1 dark:text-grey-2 mt-[-4px]">
            If you're looking for stable returns with balanced risk, <br /> Stable pools are the way to go.
          </div>
        </div>
      </div>
    </WRAPPER>
  )
}
