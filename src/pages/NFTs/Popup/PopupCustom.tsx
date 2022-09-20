import React, { ReactNode, FC } from 'react'
import { Modal } from 'antd'
import styled from 'styled-components'
import { SVGDynamicReverseMode } from '../../../styles/utils'

export const STYLED_POPUP = styled(Modal)<{ width: string; height: string }>`
  * {
    font-family: 'Montserrat' !important;
  }

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
}> = ({ width, height, children, className, ...props }) => (
  <STYLED_POPUP
    className={className}
    width={width}
    height={height}
    closeIcon={<SVGDynamicReverseMode src={`/img/assets/close-white-icon.svg`} alt="smalllll" />}
    {...props}
  >
    {children}
  </STYLED_POPUP>
)
