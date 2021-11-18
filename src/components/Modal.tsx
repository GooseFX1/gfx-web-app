import React, { FC, ReactNode } from 'react'
import { Modal as AntModal } from 'antd'
import styled from 'styled-components'
import { useDarkMode } from '../context'
import { CenteredImg, SpaceBetweenDiv, SVGToWhite } from '../styles'

const CLOSE_ICON = styled(CenteredImg)`
  ${({ theme }) => theme.measurements('14px')}
  cursor: pointer;
`

const HEADER = styled(SpaceBetweenDiv)`
  width: 100%;
`

const TITLE = styled.span`
  font-size: 14px;
  font-weight: bold;
  color: ${({ theme }) => theme.text1};
`

export const Modal: FC<{
  children: ReactNode
  setVisible: (x: boolean) => void
  onCancel?: () => void
  title: string
  visible: boolean
  [x: string]: any
}> = ({ children, setVisible, title, visible, onCancel, ...props }) => {
  const { mode } = useDarkMode()
  const handleCancel = () => {
    onCancel && onCancel()
    setVisible(false)
  }

  return (
    <AntModal
      bodyStyle={{ backgroundColor: mode === 'dark' ? '#2a2a2a' : 'white', borderRadius: '20px' }}
      centered={true}
      closable={false}
      footer={null}
      maskClosable={true}
      onCancel={handleCancel}
      visible={visible}
      {...props}
    >
      <HEADER>
        <TITLE>{title}</TITLE>
        <CLOSE_ICON className="modal-close-icon" onClick={handleCancel}>
          {mode === 'dark' ? (
            <SVGToWhite src={`${process.env.PUBLIC_URL}/img/assets/cross.svg`} alt="close" />
          ) : (
            <img src={`${process.env.PUBLIC_URL}/img/assets/cross.svg`} alt="close" />
          )}
        </CLOSE_ICON>
      </HEADER>
      {children}
    </AntModal>
  )
}
