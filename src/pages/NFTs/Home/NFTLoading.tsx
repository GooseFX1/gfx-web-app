/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { FC } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { SkeletonCommon } from '../Skeleton/SkeletonCommon'
import { checkMobile } from '../../../utils'

const CONTAINER = styled.div`
  min-height: 300px;
  flex-wrap: wrap;
  ${tw`dark:bg-black-1 bg-grey-5 duration-500 flex absolute z-[10]`}
`

const ITEM = styled.div`
  ${tw`p-2 h-[280px] w-[190px] flex flex-col`}
  .value {
    ${tw`flex flex-col mt-[180px] ml-[-177px] relative`}
  }
`

const NFTLoading: FC = () => (
  <CONTAINER>
    {[...Array(50)].map((_, index) => (
      <ITEM key={index} tw="mb-2">
        <div tw="flex">
          <div tw="border-1 border-solid flex p-2 !w-[175px] rounded-[10px] dark:border-grey-1 border-white">
            <SkeletonCommon width="155px" height="155px" style={{ marginRight: '10px' }} />
            <div className="value" tw="z-[100] pl-3">
              <div tw="flex justify-between w-[155px]">
                <SkeletonCommon width="71px" height="20px" style={{ marginRight: '0px' }} />
                <SkeletonCommon width="20px" height="20px" borderRadius="50%" />
              </div>
              <SkeletonCommon width="71px" height="20px" style={{ marginTop: '10px' }} />
              <SkeletonCommon width="71px" height="20px" style={{ marginTop: '10px' }} />
            </div>
          </div>
        </div>
      </ITEM>
    ))}
  </CONTAINER>
)

export const NFTRowLoading: FC = () => (
  <CONTAINER>
    {[...Array(20)].map((_, index) => (
      <div tw="w-[100%]" key={index}>
        <div tw="flex items-center justify-between m-3">
          <SkeletonCommon width={checkMobile() ? '150px' : '200px'} height="30px" />
          <SkeletonCommon width="80px" height="24px" />
          <SkeletonCommon width="80px" height="24px" />
        </div>
      </div>
    ))}
  </CONTAINER>
)

export default NFTLoading
