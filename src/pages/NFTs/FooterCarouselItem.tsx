import { Image } from 'antd'
import React, { FC } from 'react'
import styled from 'styled-components'

const FOOTER_IMAGE = styled(Image)`
  width: 110px;
  aspect-ratio: 1;
  border-radius: 10px;
  margin-right: 50px;
`

const FooterCarouselItem: FC<{ item?: any }> = () => {
  return <FOOTER_IMAGE preview={false} src={`${process.env.PUBLIC_URL}/img/assets/footer-demo.png`} />
}

export default FooterCarouselItem
