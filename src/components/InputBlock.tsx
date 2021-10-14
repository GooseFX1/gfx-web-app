import { FC, ReactElement } from 'react'
import styled from 'styled-components'
import { Input } from 'antd'

const INPUTBLOCK = styled.div<{
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

export const InputBlock: FC<{
  height: string
  width: string
  color: string
  backgroundColor: string
  fontSize: string
  bottomMargin: string
  borderRadius: string
  defaultValue: string
  addOn: ReactElement
}> = ({ height, width, color, backgroundColor, fontSize, borderRadius, bottomMargin, defaultValue, addOn }) => {
  return (
    <INPUTBLOCK
      $height={height}
      $width={width}
      $color={color}
      $backgroundColor={backgroundColor}
      $fontSize={fontSize}
      $borderRadius={borderRadius}
      $bottomMargin={bottomMargin}
    >
      <Input addonAfter={addOn} defaultValue={defaultValue} />
    </INPUTBLOCK>
  )
}
