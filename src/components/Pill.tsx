import React, { FC } from 'react'
import 'twin.macro'
import 'styled-components/macro'
import { SkeletonCommon } from '../pages/NFTs/Skeleton/SkeletonCommon'

interface IProps {
  label: string
  value: null | undefined | string
  loading: boolean
}

export const Pill: FC<IProps> = ({ label, value, loading }: IProps) => (
  <div
    className={'gfx-pill'}
    tw="bg-gradient-to-r from-secondary-gradient-1 to-secondary-gradient-2 
      items-center flex rounded-circle p-[2px]"
  >
    <span tw="dark:bg-black-1 bg-grey-5 px-[10px] py-[6px] rounded-circle">
      <span tw="text-regular dark:text-grey-2 text-grey-1">{label}</span>{' '}
      <strong tw="dark:text-white text-black">
        {loading ? <SkeletonCommon height={'15px'} width={'42px'} borderRadius={'50px'} /> : value}
      </strong>
    </span>
  </div>
)
