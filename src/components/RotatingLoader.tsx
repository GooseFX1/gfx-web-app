import { FC } from 'react'
import { LoadingOutlined } from '@ant-design/icons'
import { Spin } from 'antd'
import styled from 'styled-components'
import tw from 'twin.macro'

const WRAPPER = styled.div`
  ${tw`w-full !h-full flex items-center justify-center !pl-0`}
  .loadingText {
    ${tw`mx-3`}
  }
`

export const RotatingLoader: FC<{ textSize: number; iconSize: number; text?: string; iconColor?: string }> = ({
  textSize = 14,
  iconSize = 18,
  text = '',
  iconColor = ''
}) => {
  const antIcon = <LoadingOutlined style={{ fontSize: iconSize, color: iconColor }} spin />

  return (
    <WRAPPER>
      <span className="loadingText" style={{ fontSize: textSize }}>
        {text}
      </span>
      <Spin style={{ fontSize: iconSize }} indicator={antIcon} />
    </WRAPPER>
  )
}
