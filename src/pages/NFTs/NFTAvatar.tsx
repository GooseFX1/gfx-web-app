import React from 'react'
import { Image } from 'antd'
import styled from 'styled-components'
import { useHistory } from 'react-router-dom'

interface AvatarProps {
  src?: string
}

const AVATAR_NFT = styled(Image)`
  border-radius: 60px;
  width: 60px;
  height: 60px;
  cursor: pointer;
`

const NFTAvatar = ({ src }: AvatarProps) => {
  const history = useHistory()
  const goProfile = () => history.push('/NFTs/profile')
  return <AVATAR_NFT fallback={`${process.env.PUBLIC_URL}/img/assets/avatar.png`} src={src} onClick={goProfile} />
}

export {}

export default NFTAvatar
