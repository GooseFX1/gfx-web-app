/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'

const CONTAINER = styled.div`
  min-height: 300px;
  flex-wrap: wrap;
  ${tw`dark:bg-[#1c1c1c] bg-[#e2e2e2] duration-500 flex absolute z-[10]`}
`

const ITEM = styled.div`
  ${tw`p-4 h-[280px] w-[190px] flex flex-col`}
  .value {
    ${tw`flex flex-col mt-[180px] ml-[-177px] relative`}
  }
`

const NFTLoading: FC = () => (
  <CONTAINER>
    {[...Array(50)].map((_, index) => (
      <ITEM key={index}>
        <div tw="flex">
          <SkeletonCommon width="170px" height="170px" style={{ marginRight: '10px' }} />
          <div className="value">
            <SkeletonCommon width="100px" height="24px" style={{ marginRight: '10px' }} />
            <SkeletonCommon width="60px" height="24px" style={{ marginTop: '10px' }} />
          </div>
        </div>
      </ITEM>
    ))}
  </CONTAINER>
)

export default NFTLoading
