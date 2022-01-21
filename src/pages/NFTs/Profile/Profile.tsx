import React, { useState, useEffect, FC } from 'react'
import { useParams } from 'react-router-dom'
import { useWallet } from '@solana/wallet-adapter-react'
import styled from 'styled-components'
import { HeaderProfile } from './HeaderProfile'
import { TabProfile } from './TabProfile'
import { Loader } from '../../../components'
import { IAppParams } from '../../../types/app_params.d'
import { useNFTProfile } from '../../../context'

const WRAPPED_LOADER = styled.div`
  position: relative;
  height: 48px;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const Profile: FC = (): JSX.Element => {
  const params = useParams<IAppParams>()
  const [err, setErr] = useState(false)
  const [loading, setLoading] = useState(true)
  const { sessionUser, setSessionUser, fetchSessionUser } = useNFTProfile()
  const { publicKey } = useWallet()

  useEffect(() => {
    if (!sessionUser) {
      params.userId ? getUserByParam(params.userId) : setUnnamedUser()
    } else {
      setLoading(false)
    }

    return () => {}
  }, [])

  const getUserByParam = (param: string) => {
    fetchSessionUser('nickname', param).then((res) => {
      if (res.response && res.response.status !== 200) {
        setErr(true)
      } else {
        setLoading(false)
      }
    })
  }

  const setUnnamedUser = () => {
    setSessionUser({
      user_id: null,
      pubkey: `${publicKey}`,
      nickname: 'Unnamed',
      email: '',
      bio: '',
      twitter_link: '',
      instagram_link: '',
      facebook_link: '',
      youtube_link: '',
      profile_pic_link: '',
      is_verified: false
    })

    setLoading(false)
  }

  return loading ? (
    <WRAPPED_LOADER>
      <Loader />
    </WRAPPED_LOADER>
  ) : err ? (
    <h2>Something went wrong fetching user profile</h2>
  ) : (
    <>
      <HeaderProfile />
      <TabProfile />
    </>
  )
}
