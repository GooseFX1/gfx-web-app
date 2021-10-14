import { FC } from 'react'
import { Row } from 'antd'

export const InfoBlockTail: FC<{
  image: any
  imageHeight: string
  imageWidth: string
  text: string
}> = ({ image, imageHeight, imageWidth, text }) => {
  return (
    <Row
      justify={'space-around'}
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#4a4949',
        height: 45,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        paddingRight: 10
      }}
    >
      <img src={image} style={{ height: imageHeight, width: imageWidth }} />
      <span>{text}</span>
    </Row>
  )
}
