import { Image } from 'antd'
import React, { FC } from 'react'
import styled from 'styled-components'

const FooterImage = styled(Image)`
  width: 110px;
  aspect-ratio: 1;
  border-radius: 10px;
  margin-right: 50px;
`

const FooterCarouselItem: FC<{ item?: any }> = () => {
  return <FooterImage preview={false} src={`${process.env.PUBLIC_URL}/img/assets/footer-demo.png`} />
}

export default FooterCarouselItem
