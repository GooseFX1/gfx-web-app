import React, { ReactNode, FC } from 'react'
import { Modal } from 'antd'
import styled from 'styled-components'

export const STYLED_POPUP = styled(Modal)<{ width: string; height: string }>`
  * {
    font-family: 'Montserrat' !important;
  }

  height: ${({ height }) => height};
  width: ${({ width }) => width} !important;
  background-color: ${({ theme }) => theme.bg3};
  ${({ theme }) => theme.largeBorderRadius};

  .ant-modal-body {
    padding: ${({ theme }) => theme.margin(3)} ${({ theme }) => theme.margin(4)};
  }

  .ant-modal-content {
    border-radius: 0;
    box-shadow: none;
  }

  .ant-modal-close {
    position: absolute;
    right: ${({ theme }) => theme.margin(4)};
    top: ${({ theme }) => theme.margin(3)};

    .ant-modal-close-x {
      width: auto;
      height: auto;
      font-size: 26px;
      line-height: 1;
      svg {
        color: ${({ theme }) => theme.text1};
      }
    }
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
    <STYLED_POPUP
      className={className}
      width={width}
      height={height}
      {...props}
      closeIcon={<img className="close-white-icon" src={`/img/assets/close-white-icon.svg`} alt="" />}
    >
      {children}
    </STYLED_POPUP>
  )
}
