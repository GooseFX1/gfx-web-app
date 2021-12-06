import React, { ReactNode, FC } from 'react'
import { Modal } from 'antd'
import styled from 'styled-components'

export const STYLED_POPUP = styled(Modal)<{ width: string; height: string }>`
  background-color: ${({ theme }) => theme.bg3};
  ${({ theme }) => theme.largeBorderRadius};
  width: ${({ width }) => width} !important;
  height: ${({ height }) => height};

  .ant-modal-close-x {
    width: auto;
    height: auto;
    font-size: 26px;
    line-height: 1;
    svg {
      color: ${({ theme }) => theme.text1};
    }
  }

  .ant-modal-body {
    padding: ${({ theme }) => theme.margins['8x']} ${({ theme }) => theme.margins['9x']};
  }

  .ant-modal-content {
    border-radius: 0;
    box-shadow: none;
  }

  .ant-modal-close {
    top: 23px;
    left: 35px;
  }
`

export const PopupCustom: FC<{
  width?: string
  height?: string
  children: ReactNode
  className?: string
  [x: string]: any
}> = ({ width, height, children, className, ...props }) => {
  return (
    <STYLED_POPUP className={className} width={width} height={height} {...props}>
      {children}
    </STYLED_POPUP>
  )
}
