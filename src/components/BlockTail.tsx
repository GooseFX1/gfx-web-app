import { FC, ReactElement } from 'react'
import { Row } from 'antd'

export const BlockTail: FC<{
  image: any
  imageHeight: string
  imageWidth: string
  text: ReactElement
  backgroundColor: string
  width: string
  justifyItems: string
}> = ({ image, imageHeight, imageWidth, text, backgroundColor, width, justifyItems }) => {
  return (
    <Row
      justify={'space-around'}
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: backgroundColor,
        height: 45,
        width: width,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        paddingRight: 10,
        justifyContent: justifyItems
      }}
    >
      <img src={image} style={{ height: imageHeight, width: imageWidth }} />
      {text}
    </Row>
  )
}
