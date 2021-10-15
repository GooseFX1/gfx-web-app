import { Select } from 'antd'
import { FC, ReactElement } from 'react'
import styled from 'styled-components'
import { SVGToWhite } from '../styles'
import { BlockTail } from './BlockTail'

export const OptionDetail: FC<{
  image: any
  title: string
}> = ({ image, title }) => {
  return (
    <BlockTail
      image={image}
      text={<span style={{ marginLeft: 15, fontSize: 13, color: 'white' }}>{title}</span>}
      imageHeight={'20px'}
      imageWidth={'20px'}
      backgroundColor={'transparent'}
      width={'100px'}
      justifyItems={'flex-start'}
    ></BlockTail>
  )
}
