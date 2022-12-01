import React, { FC } from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { SkeletonCommon } from '../pages/NFTs/Skeleton/SkeletonCommon'

interface IProps {
  label: string
  value: null | undefined | string
}

export const Pill: FC<IProps> = (props: IProps) => {
  const PILL = styled.div`
    ${tw`items-center flex rounded-circle p-[2px]`}
    background: linear-gradient(96deg, #f7931a 1%, #ac1cc7 99%);

    .pill-inner {
      ${tw`px-[12px] py-[8px] rounded-circle`}
      background-color: ${({ theme }) => theme.bg1};
    }

    .pill-label {
      color: ${({ theme }) => theme.text1};
      font-size: 15px;
      opacity: 0.6;
      line-height: 18px;
    }

    strong {
      line-height: 18px;
      color: ${({ theme }) => theme.text1};
    }
  `
  return (
    <PILL>
      <span className={'pill-inner'}>
        <span className={'pill-label'}>{props.label}</span>{' '}
        <strong>
          {props.value == null ? (
            <SkeletonCommon height={'15px'} width={'42px'} borderRadius={'50px'} />
          ) : (
            props.value
          )}
        </strong>
      </span>
    </PILL>
  )
}
