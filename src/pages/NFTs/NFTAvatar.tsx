import React from 'react'
import { Image } from 'antd'
import styled from 'styled-components'

interface AvatarProps {
  src?: string
}

const AVATAR_NFT = styled(Image)`
  border-radius: 60px;
  width: 60px;
  height: 60px;
`

const NFTAvatar = ({ src }: AvatarProps) => {
  return <AVATAR_NFT fallback={`${process.env.PUBLIC_URL}/img/assets/avatar.png`} src={src} />
}

export {}

export default NFTAvatar
