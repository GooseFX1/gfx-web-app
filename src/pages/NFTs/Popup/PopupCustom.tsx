import React, { ReactNode, FC } from 'react'
import { Modal } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'
import 'styled-components/macro'
import { SVGDynamicReverseMode } from '../../../styles'
import { useDarkMode } from '../../../context'

export const STYLED_POPUP = styled(Modal)<{ width: string; height: string }>`
  height: ${({ height }) => height};
  width: ${({ width }) => width} !important;
  background-color: ${({ theme }) => theme.bg3};
  padding-bottom: 0;

  ${({ theme }) => theme.largeBorderRadius};

  .ant-modal-content {
    border-radius: 0;
    box-shadow: none;
  }

  .ant-modal-close {
    position: absolute;
    right: 25px;
    top: 25px;

    .ant-modal-close-x {
      display: flex;
      height: 24px;
      width: 24px;
      ${tw`sm:h-[18px] sm:w-[18px]`}
    }
  }
`

export const PopupCustom: FC<{
  width?: string
  height?: string
  children: ReactNode
  closeIcon: any
  className?: string
  [x: string]: any
}> = ({ width, height, children, className, ...props }) => {
  const { mode } = useDarkMode()
  return (
    <STYLED_POPUP
      className={className}
      width={width}
      height={height}
      closeIcon={<SVGDynamicReverseMode src={`/img/assets/close-white-icon.svg`} alt="close-icn" />}
      centered
      wrapClassName={mode === 'dark' ? 'dark' : ''}
      {...props}
    >
      {children}
    </STYLED_POPUP>
  )
}
