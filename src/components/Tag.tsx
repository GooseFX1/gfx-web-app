import React, { FC } from 'react'
import { useDarkMode } from '../context'
import 'twin.macro'
import 'styled-components/macro'
import styled from 'styled-components'
import { SkeletonCommon } from '../pages/NFTs/Skeleton/SkeletonCommon'

interface IProps {
  loading: boolean
  children: JSX.Element
}

const TAG = styled.div<{ $mode: string }>`
  background: ${({ $mode }) =>
    $mode === 'dark'
      ? 'linear-gradient(96deg, #f7931a 1%, #ac1cc7 99%)'
      : `linear-gradient(96.79deg, rgba(247, 147, 26, 0.8) 4.25%, rgba(172, 28, 199, 0.8) 97.61%);`};
  border-radius: 5px;
  padding: 1px;
  color: white;

  div {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    padding: 1px 6px;
    background: ${({ $mode }) => ($mode === 'dark' ? '#3c3b3b80' : '#94949452')};
    border-radius: 5px;
    filter: drop-shadow(0px 6px 9px rgba(36, 36, 36, 0.15));
  }
`

export const Tag: FC<IProps> = ({ loading, children }: IProps): JSX.Element => {
  const { mode } = useDarkMode()
  return (
    <TAG $mode={mode} className={'gfx-tag'} tw="relative">
      <div>
        <strong tw="text-white opacity-100 z-10 text-tiny font-semibold">
          {loading ? <SkeletonCommon height={'15px'} width={'42px'} borderRadius={'5px'} /> : children}
        </strong>
      </div>
    </TAG>
  )
}
