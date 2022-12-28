import React, { FC, ReactNode } from 'react'
import { Modal as AntModal } from 'antd'
import styled from 'styled-components'
import { useDarkMode } from '../context'
import { CenteredImg, SpaceBetweenDiv, SVGToWhite } from '../styles'
import tw from 'twin.macro'

const ANTMODAL = styled(AntModal)`
  ${({ theme }) => theme.customScrollBar('4px')};
  background-color: ${({ theme }) => theme.bg9};
`

const CLOSE_ICON = styled(CenteredImg)`
  ${tw`absolute top-[28px] right-[25px] cursor-pointer`}

  img {
    ${tw`h-[20px] w-[20px] opacity-60`}
  }
`

const HEADER = styled(SpaceBetweenDiv)`
  width: 100%;
  margin-bottom: 0.5rem;
`

const TITLE = styled.span`
  font-size: 20px;
  font-weight: bold;
  color: ${({ theme }) => theme.text7};
`

const BIG_TITLE = styled.span`
  font-size: 30px;
  font-weight: bold;
  color: ${({ theme }) => theme.text7};
`

export const Modal: FC<{
  children: ReactNode
  setVisible: (x: boolean) => void
  title: string
  visible: boolean
  bigTitle?: boolean
  style?: any
  large?: boolean
  centerTitle?: boolean
  onCancel?: () => void
  [x: string]: any
}> = ({
  children,
  onCancel,
  large = false,
  setVisible,
  title,
  visible,
  style,
  bigTitle,
  centerTitle,
  ...props
}) => {
  const { mode } = useDarkMode()
  const handleCancel = () => {
    onCancel && onCancel()
    setVisible(false)
  }

  return (
    <ANTMODAL
      bodyStyle={{
        borderRadius: '20px',
        maxHeight: '95vh',
        fontFamily: 'Montserrat',
        ...style
      }}
      centered
      closable={false}
      footer={null}
      onCancel={handleCancel}
      maskClosable
      visible={visible}
      width={large ? '50vw' : 350}
      {...props}
    >
      <HEADER style={centerTitle && { justifyContent: 'center' }}>
        {bigTitle ? <BIG_TITLE>{title}</BIG_TITLE> : <TITLE>{title}</TITLE>}
        <CLOSE_ICON onClick={handleCancel}>
          {mode === 'dark' ? (
            <SVGToWhite src={`/img/assets/cross.svg`} alt="close" />
          ) : (
            <img src={`/img/assets/cross.svg`} alt="close" />
          )}
        </CLOSE_ICON>
      </HEADER>
      {children}
    </ANTMODAL>
  )
}
