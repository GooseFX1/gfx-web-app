import React, { FC } from 'react'
import { useDarkMode } from '../context'
/* eslint-disable @typescript-eslint/no-unused-vars */
import 'twin.macro'
import 'styled-components/macro'
import { SkeletonCommon } from '../pages/NFTs/Skeleton/SkeletonCommon'
import tw, { TwStyle, styled } from 'twin.macro'

interface IProps {
  loading: boolean
  children: JSX.Element
  cssStyle?: TwStyle
}

const TAG = styled.div<{ $mode: string; $cssStyle: TwStyle }>`
  background: ${({ $mode }) =>
    $mode === 'dark'
      ? 'linear-gradient(96.79deg, rgba(247, 147, 26, 0.92) 4.25%, rgba(172, 28, 199, 0.8) 97.61%)'
      : `linear-gradient(96.79deg, rgba(247, 147, 26, 0.93) 4.25%, rgba(172, 28, 199, 0.8) 97.61%);`};
  border-radius: 5.5px;
  padding: 1px;
  color: white;

  div {
    height: 100%;
    width: 100%;
    display: flex;
    align-items: center;
    font-weight: 600px;
    justify-content: center;
    font-weight: 600;
    font-size: 15px;
    line-height: 18px;
    padding: 1px 6px;
    background: ${({ $mode }) => ($mode === 'dark' ? '#101010b3' : '#c3c0c063')};
    border-radius: 4.5px;
    ${({ $cssStyle }) => $cssStyle};

    filter: drop-shadow(0px 6px 9px rgba(36, 36, 36, 0.15));
  }
`

export const Tag: FC<IProps> = ({ loading, cssStyle, children }: IProps): JSX.Element => {
  const { mode } = useDarkMode()
  return (
    <TAG $mode={mode} $cssStyle={cssStyle} className={'gfx-tag'} tw="relative">
      <div>
        <strong tw="text-white opacity-100 z-10 text-tiny font-semibold">
          {loading ? <SkeletonCommon height={'15px'} width={'42px'} borderRadius={'5px'} /> : children}
        </strong>
      </div>
    </TAG>
  )
}
