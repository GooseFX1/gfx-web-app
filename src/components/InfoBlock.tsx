import { FC, ReactElement } from 'react'
import styled from 'styled-components'
import { Row } from 'antd'

const INFOBLOCK = styled.div<{
  $height: string
  $width: string
  $color: string
  $backgroundColor: string
  $fontSize: string
  $borderRadius: string
  $bottomMargin: string
}>`
  height: ${({ $height }) => $height};
  width: ${({ $width }) => $width};
  color: ${({ $color }) => $color};
  font-size: ${({ $fontSize }) => $fontSize};
  border-radius: ${({ $borderRadius }) => $borderRadius};
  background-color: ${({ $backgroundColor }) => $backgroundColor};
  margin-bottom: ${({ $bottomMargin }) => $bottomMargin};
`
const TEXT = styled.div`
  padding-left: 25px;
  padding-right: 25px;
  padding-top: 12px;
  padding-bottom: 10px;
`

const TAIL = styled.div`
  margin-top: 2.5px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const InfoBlock: FC<{
  height: string
  width: string
  color: string
  backgroundColor: string
  fontSize: string
  bottomMargin: string
  borderRadius: string
  text: string
  tail: ReactElement
}> = ({ height, width, color, backgroundColor, fontSize, borderRadius, text, tail, bottomMargin }) => {
  return (
    <INFOBLOCK
      $height={height}
      $width={width}
      $color={color}
      $backgroundColor={backgroundColor}
      $fontSize={fontSize}
      $borderRadius={borderRadius}
      $bottomMargin={bottomMargin}
    >
      <Row justify={'space-between'}>
        <TEXT>{text}</TEXT>
        <TAIL>{tail}</TAIL>
      </Row>
    </INFOBLOCK>
  )
}
